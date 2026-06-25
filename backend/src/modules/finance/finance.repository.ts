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
}
