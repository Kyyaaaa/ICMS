import { supabaseAdmin } from '../../configs/supabase';
import { RefundRequest, RefundStatusUpdate } from './refund.model';
import pool from '../../configs/database';

export class RefundRepository {
  static async create(refund: RefundRequest) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const invoiceResult = await client.query(
        `SELECT id, learner_id, class_id, amount, status
         FROM invoices
         WHERE id = $1
         FOR UPDATE`,
        [refund.invoice_id]
      );
      const invoice = invoiceResult.rows[0];
      if (!invoice) throw new Error('Invoice not found');
      if (invoice.learner_id !== refund.learner_id) throw new Error('Forbidden: Invoice does not belong to learner');
      if (invoice.status !== 'PAID') throw new Error('Only PAID invoices can be refunded');
      if (Number(invoice.amount) !== Number(refund.amount)) throw new Error('Refund amount does not match invoice amount');

      const paymentResult = await client.query(
        `SELECT MAX(created_at) AS paid_at
         FROM payments
         WHERE invoice_id = $1 AND status = 'SUCCESS'`,
        [refund.invoice_id]
      );
      const paidAt = paymentResult.rows[0]?.paid_at;
      if (!paidAt) throw new Error('No successful payment found for this invoice');
      if (Date.now() - new Date(paidAt).getTime() > 24 * 60 * 60 * 1000) {
        throw new Error('Refund requests must be submitted within 24 hours of payment');
      }

      const attendanceResult = await client.query(
        `SELECT 1
         FROM attendances a
         JOIN class_sessions s ON s.id = a.session_id
         WHERE s.class_id = $1 AND a.learner_id = $2 AND a.status = 'PRESENT'
         LIMIT 1`,
        [invoice.class_id, refund.learner_id]
      );
      if (attendanceResult.rows.length > 0) {
        throw new Error('Refund is not allowed after attending a class session');
      }

      const activeRefundResult = await client.query(
        `SELECT id
         FROM refund_requests
         WHERE invoice_id = $1 AND status IN ('PENDING', 'APPROVED', 'COMPLETED')
         LIMIT 1
         FOR UPDATE`,
        [refund.invoice_id]
      );
      if (activeRefundResult.rows.length > 0) {
        throw new Error('An active refund request already exists for this invoice');
      }

      await client.query("SELECT pg_advisory_xact_lock(hashtext('refund_code_generation'))");
      const codeResult = await client.query(
        `SELECT COALESCE(MAX(CAST(SUBSTRING(refund_code FROM 4) AS INTEGER)), 0) + 1 AS next_number
         FROM refund_requests
         WHERE refund_code ~ '^REF[0-9]+$'`
      );
      const refundCode = `REF${String(codeResult.rows[0].next_number).padStart(6, '0')}`;
      const result = await client.query(
        `INSERT INTO refund_requests
          (refund_code, invoice_id, learner_id, amount, reason, bank_name, bank_account_name, bank_account_number, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 'PENDING'))
         RETURNING *`,
        [
          refundCode,
          refund.invoice_id,
          refund.learner_id,
          refund.amount,
          refund.reason,
          refund.bank_name,
          refund.bank_account_name,
          refund.bank_account_number,
          refund.status
        ]
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByLearnerId(learnerId: string) {
    const { data, error } = await supabaseAdmin
      .from('refund_requests')
      .select('*, invoices(*, classes(courses(title)))')
      .eq('learner_id', learnerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getLatestRefund() {
    const { data, error } = await supabaseAdmin
      .from('refund_requests')
      .select('refund_code')
      .order('refund_code', { ascending: false })
      .limit(1)
      .single();
    
    // It will throw PGRST116 if no rows found, which is fine
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findAll() {
    const { data, error } = await supabaseAdmin
      .from('refund_requests')
      .select('*, account(full_name, email), invoices(*, classes(courses(title)))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateStatus(id: string, update: RefundStatusUpdate) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const currentResult = await client.query(
        'SELECT * FROM refund_requests WHERE id = $1 FOR UPDATE',
        [id]
      );
      const current = currentResult.rows[0];
      if (!current) throw new Error('Refund request not found');

      if (current.status === update.status) {
        await client.query('COMMIT');
        return current;
      }

      const allowedTransitions: Record<string, string[]> = {
        PENDING: ['APPROVED', 'REJECTED'],
        APPROVED: ['COMPLETED', 'REJECTED'],
        COMPLETED: [],
        REJECTED: []
      };
      if (!allowedTransitions[current.status]?.includes(update.status)) {
        throw new Error(`Invalid refund transition from ${current.status} to ${update.status}`);
      }

      const isProcessed = ['COMPLETED', 'REJECTED'].includes(update.status);
      const isApproved = update.status === 'APPROVED';

      const result = await client.query(
        `UPDATE refund_requests
         SET status = $1,
             admin_notes = $2,
             processed_at = CASE WHEN $4::boolean THEN NOW() ELSE processed_at END,
             approved_at = CASE WHEN $5::boolean THEN NOW() ELSE approved_at END,
             proof_image_url = CASE WHEN $6::text IS NOT NULL THEN $6::text ELSE proof_image_url END
         WHERE id = $3
         RETURNING *`,
        [update.status, update.admin_notes || null, id, isProcessed, isApproved, update.proof_image_url || null]
      );
      const refund = result.rows[0];
      if (!refund) throw new Error('Refund request not found');

      if (update.status === 'COMPLETED' && refund.invoice_id) {
        const invoiceResult = await client.query(
          "UPDATE invoices SET status = 'REFUNDED' WHERE id = $1 AND status = 'PAID' RETURNING class_id",
          [refund.invoice_id]
        );
        if (invoiceResult.rows.length === 0) {
          throw new Error('Invoice is no longer eligible for refund');
        }
        await client.query(
          "UPDATE invoice_installments SET status = 'REFUNDED' WHERE invoice_id = $1 AND status = 'PAID'",
          [refund.invoice_id]
        );
        await client.query(
          "UPDATE invoice_installments SET status = 'CANCELLED' WHERE invoice_id = $1 AND status IN ('PENDING', 'OVERDUE')",
          [refund.invoice_id]
        );
        const classId = invoiceResult.rows[0]?.class_id;
        if (classId) {
          await client.query(
            "UPDATE enrollments SET status = 'CANCELED' WHERE learner_id = $1 AND class_id = $2",
            [refund.learner_id, classId]
          );
        }
      }

      await client.query('COMMIT');
      return refund;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
