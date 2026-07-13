import { PoolClient } from 'pg';
import pool from '../../configs/database';

export class PaymentRepository {
  private static async enrollLearner(
    client: PoolClient,
    learnerId: string,
    classId: string,
    maxCapacity: number
  ) {
    await client.query('SELECT id FROM classes WHERE id = $1 FOR UPDATE', [classId]);

    const countResult = await client.query(
      'SELECT count(*) FROM enrollments WHERE class_id = $1 AND status = $2',
      [classId, 'ACTIVE']
    );
    if (Number(countResult.rows[0].count) >= maxCapacity) {
      throw new Error('Class is full');
    }

    const existingResult = await client.query(
      'SELECT id, status FROM enrollments WHERE learner_id = $1 AND class_id = $2 FOR UPDATE',
      [learnerId, classId]
    );
    const existing = existingResult.rows[0];
    if (existing?.status === 'ACTIVE') return existing;

    if (existing) {
      const result = await client.query(
        'UPDATE enrollments SET status = $1, enrollment_date = NOW() WHERE id = $2 RETURNING *',
        ['ACTIVE', existing.id]
      );
      return result.rows[0];
    }

    const result = await client.query(
      'INSERT INTO enrollments (learner_id, class_id, status) VALUES ($1, $2, $3) RETURNING *',
      [learnerId, classId, 'ACTIVE']
    );
    return result.rows[0];
  }

  static async recordPaymentAndEnroll(txnRef: string, amount: number, transactionNo: string) {
    const referenceMatch = txnRef.match(/^(.*?)(?:-(\d+))?$/);
    const invoiceCode = referenceMatch?.[1] || txnRef;
    const installmentNumber = referenceMatch?.[2] ? Number(referenceMatch[2]) : null;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const invoiceResult = await client.query(
        `SELECT i.*, c.capacity
         FROM invoices i
         JOIN classes c ON c.id = i.class_id
         WHERE i.invoice_code = $1
         FOR UPDATE`,
        [invoiceCode]
      );
      const invoice = invoiceResult.rows[0];
      if (!invoice) throw new Error('Invoice not found');

      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [transactionNo]);
      const duplicatePaymentResult = await client.query(
        `SELECT invoice_id, amount, status
         FROM payments
         WHERE transaction_no = $1
         FOR UPDATE`,
        [transactionNo]
      );
      const duplicatePayment = duplicatePaymentResult.rows[0];
      if (duplicatePayment) {
        if (
          duplicatePayment.invoice_id === invoice.id &&
          Number(duplicatePayment.amount) === amount &&
          duplicatePayment.status === 'SUCCESS'
        ) {
          await client.query('COMMIT');
          return invoice;
        }
        throw new Error('Duplicate payment transaction');
      }

      if (installmentNumber !== null) {
        const installmentResult = await client.query(
          `SELECT * FROM invoice_installments
           WHERE invoice_id = $1 AND installment_number = $2
           FOR UPDATE`,
          [invoice.id, installmentNumber]
        );
        const installment = installmentResult.rows[0];
        if (!installment) throw new Error('Installment not found');
        if (installment.status === 'PAID') {
          await client.query('COMMIT');
          return invoice;
        }
        if (!['PENDING', 'PARTIAL'].includes(invoice.status)) {
          throw new Error('Invoice is not payable');
        }
        if (Number(installment.amount) !== amount) {
          throw new Error('Payment amount does not match installment amount');
        }

        if (installmentNumber === 1 && invoice.status === 'PENDING') {
          await this.enrollLearner(client, invoice.learner_id, invoice.class_id, Number(invoice.capacity));
        }

        await client.query(
          `INSERT INTO payments (invoice_id, amount, payment_method, transaction_no, status)
           VALUES ($1, $2, 'VNPAY', $3, 'SUCCESS')`,
          [invoice.id, amount, transactionNo]
        );
        await client.query(
          `UPDATE invoice_installments
           SET status = 'PAID', paid_date = NOW()
           WHERE id = $1`,
          [installment.id]
        );

        const unpaidResult = await client.query(
          `SELECT count(*) FROM invoice_installments
           WHERE invoice_id = $1 AND status <> 'PAID'`,
          [invoice.id]
        );
        const nextStatus = Number(unpaidResult.rows[0].count) === 0 ? 'PAID' : 'PARTIAL';
        await client.query('UPDATE invoices SET status = $1 WHERE id = $2', [nextStatus, invoice.id]);
      } else {
        if (invoice.status === 'PAID') {
          await client.query('COMMIT');
          return invoice;
        }
        if (invoice.status !== 'PENDING') {
          throw new Error('Invoice is not payable');
        }
        if (Number(invoice.amount) !== amount) {
          throw new Error('Payment amount does not match invoice amount');
        }

        await this.enrollLearner(client, invoice.learner_id, invoice.class_id, Number(invoice.capacity));
        await client.query(
          `INSERT INTO payments (invoice_id, amount, payment_method, transaction_no, status)
           VALUES ($1, $2, 'VNPAY', $3, 'SUCCESS')`,
          [invoice.id, amount, transactionNo]
        );
        await client.query("UPDATE invoices SET status = 'PAID' WHERE id = $1", [invoice.id]);
      }

      await client.query('COMMIT');
      return invoice;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
