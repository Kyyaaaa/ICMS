import { supabaseAdmin } from '../../configs/supabase';
import { RefundRequest, RefundStatusUpdate } from './refund.model';

export class RefundRepository {
  static async create(refund: RefundRequest) {
    const { data, error } = await supabaseAdmin
      .from('refund_requests')
      .insert([refund])
      .select()
      .single();
      
    if (error) throw error;
    return data;
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
    const { data, error } = await supabaseAdmin
      .from('refund_requests')
      .update({
        status: update.status,
        admin_notes: update.admin_notes,
        processed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (update.status === 'COMPLETED' && data.invoice_id) {
      await supabaseAdmin.from('invoices').update({ status: 'REFUNDED' }).eq('id', data.invoice_id);
      await supabaseAdmin.from('invoice_installments').update({ status: 'REFUNDED' }).eq('invoice_id', data.invoice_id).eq('status', 'PAID');
      await supabaseAdmin.from('invoice_installments').update({ status: 'CANCELLED' }).eq('invoice_id', data.invoice_id).in('status', ['PENDING', 'OVERDUE']);
    }

    return data;
  }
}
