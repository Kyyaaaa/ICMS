import { supabaseAdmin } from '../../configs/supabase';

export class FinanceRepository {
  static async getAllInvoices() {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .select(`
        id,
        invoice_code,
        amount,
        status,
        created_at,
        account:learner_id(full_name, account_code),
        classes(courses(title)),
        invoice_installments(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getAllRefunds() {
    const { data, error } = await supabaseAdmin
      .from('refund_requests')
      .select(`
        *,
        account:learner_id(full_name, account_code),
        invoices(classes(courses(title)))
      `)
      .in('status', ['APPROVED', 'COMPLETED'])
      .order('processed_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getAllPaidPayrolls() {
    const { data, error } = await supabaseAdmin
      .from('payrolls')
      .select(`
        *,
        account:account_id (
          account_code,
          full_name,
          roles:role_id ( name )
        )
      `)
      .eq('status', 'Paid')
      .order('payment_date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
}
