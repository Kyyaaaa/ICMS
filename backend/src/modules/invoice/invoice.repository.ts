import { supabaseAdmin } from '../../configs/supabase';

export class InvoiceRepository {
  static async getClassAndCourse(classId: string) {
    const { data, error } = await supabaseAdmin
      .from('classes')
      .select(`
        *,
        courses (
          id,
          title,
          band,
          sessions,
          format,
          price
        )
      `)
      .eq('id', classId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  static async getPendingInvoice(learnerId: string, classId: string) {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('learner_id', learnerId)
      .eq('class_id', classId)
      .eq('status', 'PENDING')
      .gte('created_at', fifteenMinsAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // It's okay if no pending invoice is found
    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }
    
    return data;
  }

  static async deleteInvoice(invoiceId: string) {
    const { error } = await supabaseAdmin.from('invoices').delete().eq('id', invoiceId);
    if (error) throw new Error(error.message);
  }

  // checkRegistrationConflicts has been moved to EnrollmentService

  static async createInvoice(learnerId: string, classId: string, amount: number, discount: number = 0, discountCodeId: string | null = null, paymentPlan: string = 'full') {
    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert({
        learner_id: learnerId,
        class_id: classId,
        amount: amount,
        discount: discount,
        discount_code_id: discountCodeId,
        status: 'PENDING'
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);

    return invoice;
  }

  static async checkDiscountCodeUsed(learnerId: string, discountCodeId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .select('id')
      .eq('learner_id', learnerId)
      .eq('discount_code_id', discountCodeId)
      .neq('status', 'CANCELLED')
      .limit(1);

    if (error) throw new Error(error.message);
    return data && data.length > 0;
  }

  static async generateInstallments(invoiceId: string, amount: number) {
    const { data: invoiceData } = await supabaseAdmin
      .from('invoices')
      .select(`
        classes (
          courses (
            number_of_installments,
            allow_installments
          )
        )
      `)
      .eq('id', invoiceId)
      .single();

    // The typings for deep select in supabase-js can be tricky, so we use any
    const course = (invoiceData?.classes as any)?.courses;
    const numberOfInstallments = course?.number_of_installments || 3;
    const allowInstallments = course?.allow_installments;

    if (allowInstallments === false) {
      throw new Error("This course does not allow installment payments.");
    }

    const termAmount = Math.round(amount / numberOfInstallments);
    const firstTermAmount = amount - termAmount * (numberOfInstallments - 1);
    const now = new Date();

    const installmentsData = [];
    for (let i = 1; i <= numberOfInstallments; i++) {
      installmentsData.push({
        invoice_id: invoiceId,
        installment_number: i,
        amount: i === 1 ? firstTermAmount : termAmount,
        due_date: i === 1 ? now.toISOString() : new Date(now.getTime() + (i - 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'PENDING'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('invoice_installments')
      .insert(installmentsData)
      .select('*');

    if (error) {
      console.error("Failed to create installments:", error);
      throw new Error("Failed to create installments");
    }
    return data;
  }

  static async getInvoiceDetails(invoiceId: string) {
    let data;
    if (invoiceId.startsWith('IN')) {
      data = await supabaseAdmin.from('invoices').select(`*, classes(id, name, start_date, courses(id, title, band, sessions, format, price, allow_installments, number_of_installments)), account:learner_id(id, full_name, email, phone_number, account_code), invoice_installments(*), refund_requests(status)`).eq('invoice_code', invoiceId).single();
    } else {
      data = await supabaseAdmin.from('invoices').select(`*, classes(id, name, start_date, courses(id, title, band, sessions, format, price, allow_installments, number_of_installments)), account:learner_id(id, full_name, email, phone_number, account_code), invoice_installments(*), refund_requests(status)`).eq('id', invoiceId).single();
    }
    
    if (data.error) throw new Error(data.error.message);
    
    // Sort installments if they exist
    if (data.data.invoice_installments) {
      data.data.invoice_installments.sort((a: any, b: any) => a.installment_number - b.installment_number);
    }
    
    if (data.data.classes && !data.data.classes.start_date) {
        const firstSession = await supabaseAdmin.from('class_sessions').select('date').eq('class_id', data.data.class_id).order('date', { ascending: true }).limit(1).single();
        if (firstSession.data) {
            data.data.classes.start_date = firstSession.data.date;
        }
    }
    
    return data.data;
  }

  static async getMyInvoices(learnerId: string) {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .select(`
        *,
        classes (
          id,
          name,
          courses (
            id,
            title
          )
        ),
        invoice_installments(*),
        refund_requests(status)
      `)
      .eq('learner_id', learnerId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const expiredInvoices = data?.filter((inv: any) => inv.status === 'PENDING' && new Date(inv.created_at) < fifteenMinsAgo) || [];
    
    if (expiredInvoices.length > 0) {
      const expiredIds = expiredInvoices.map((inv: any) => inv.id);
      await supabaseAdmin.from('invoices').update({ status: 'CANCELLED' }).in('id', expiredIds);
      expiredInvoices.forEach((inv: any) => inv.status = 'CANCELLED');
    }

    return data;
  }

  static async getAllInvoices(page: number = 1, limit: number = 10, statusFilter?: string) {
    let query = supabaseAdmin
      .from('invoices')
      .select(`
        *,
        classes (
          id,
          name,
          courses (
            id,
            title
          )
        ),
        account:learner_id (
          id,
          full_name,
          email
        ),
        invoice_installments(*)
      `, { count: 'exact' });

    if (statusFilter && statusFilter !== 'All') {
      query = query.eq('status', statusFilter.toUpperCase());
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return { data, total: count || 0 };
  }

  static async cancelInvoice(invoiceId: string, learnerId: string) {
    const query = invoiceId.startsWith('IN') 
      ? { column: 'invoice_code', value: invoiceId }
      : { column: 'id', value: invoiceId };

    const { data: invoice, error: fetchError } = await supabaseAdmin
      .from('invoices')
      .select('id, status, learner_id, class_id')
      .eq(query.column, query.value)
      .single();

    if (fetchError) throw new Error(fetchError.message);
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.learner_id !== learnerId) throw new Error('Unauthorized to cancel this invoice');
    if (invoice.status !== 'PENDING' && invoice.status !== 'PARTIAL') throw new Error('Only pending or partially paid invoices can be cancelled');

    const { error: updateError } = await supabaseAdmin
      .from('invoices')
      .update({ status: 'CANCELLED' })
      .eq('id', invoice.id);
    
    // Cancel pending installments
    await supabaseAdmin
      .from('invoice_installments')
      .update({ status: 'CANCELLED' })
      .eq('invoice_id', invoice.id)
      .in('status', ['PENDING', 'OVERDUE']);
      
    if (updateError) throw new Error(updateError.message);
    return invoice;
  }
}
