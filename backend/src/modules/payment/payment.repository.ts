import { supabaseAdmin } from '../../configs/supabase';

export class PaymentRepository {
  static async recordPaymentAndEnroll(txnRef: string, amount: number, transactionNo: string) {
    let invoiceCode = txnRef;
    let installmentNumber: number | null = null;
    
    if (txnRef.includes('-')) {
      const parts = txnRef.split('-');
      invoiceCode = parts[0];
      installmentNumber = parseInt(parts[1], 10);
    }

    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .select('*, invoice_installments(*)')
      .eq('invoice_code', invoiceCode)
      .single();
      
    if (invoiceError || !invoice) throw new Error('Invoice not found');
    if (invoice.status === 'PAID') return invoice;

    // Handle installment payment
    if (installmentNumber !== null) {
      const installment = invoice.invoice_installments?.find((inst: any) => inst.installment_number === installmentNumber);
      if (!installment) throw new Error('Installment not found');
      if (installment.status === 'PAID') return invoice;

      // Mark installment as paid
      await supabaseAdmin
        .from('invoice_installments')
        .update({ status: 'PAID', paid_date: new Date().toISOString() })
        .eq('id', installment.id);

      // Add payment record linked to invoice
      await supabaseAdmin
        .from('payments')
        .insert({
          invoice_id: invoice.id,
          amount: amount,
          payment_method: 'VNPAY',
          transaction_no: transactionNo,
          status: 'SUCCESS'
        });

      // If it's the first installment, enroll the learner
      if (installmentNumber === 1 && invoice.status === 'PENDING') {
        await supabaseAdmin
          .from('invoices')
          .update({ status: 'PARTIAL' })
          .eq('id', invoice.id);

        await supabaseAdmin
          .from('enrollments')
          .insert({
            learner_id: invoice.learner_id,
            class_id: invoice.class_id,
            status: 'ACTIVE'
          });
      } else {
        // Check if all installments are paid
        const { data: allInsts } = await supabaseAdmin
          .from('invoice_installments')
          .select('status')
          .eq('invoice_id', invoice.id);
          
        const allPaid = allInsts?.every((i: any) => i.status === 'PAID');
        if (allPaid) {
          await supabaseAdmin
            .from('invoices')
            .update({ status: 'PAID' })
            .eq('id', invoice.id);
        }
      }
      return invoice;
    }

    // Handle full payment
    await supabaseAdmin
      .from('payments')
      .insert({
        invoice_id: invoice.id,
        amount: amount,
        payment_method: 'VNPAY',
        transaction_no: transactionNo,
        status: 'SUCCESS'
      });

    await supabaseAdmin
      .from('invoices')
      .update({ status: 'PAID' })
      .eq('id', invoice.id);

    if (invoice.status === 'PENDING') {
      await supabaseAdmin
        .from('enrollments')
        .insert({
          learner_id: invoice.learner_id,
          class_id: invoice.class_id,
          status: 'ACTIVE'
        });
    }

    return invoice;
  }
}
