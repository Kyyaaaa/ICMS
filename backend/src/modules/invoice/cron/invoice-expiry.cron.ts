import cron from 'node-cron';
import { supabaseAdmin as supabase } from '../../../configs/supabase';
import { EnrollmentService } from '../../enrollment/enrollment.service';

export const initInvoiceExpiryCron = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    if (process.env.NODE_ENV === 'test') return;

    try {
      // Find invoices that have been pending for more than 15 minutes
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      
      const { data: expiredInvoices, error } = await supabase
        .from('invoices')
        .select('id, learner_id, class_id')
        .eq('status', 'PENDING')
        .lt('created_at', fifteenMinutesAgo);

      if (error) {
        console.error('[Invoice Expiry Cron] Error fetching expired invoices:', error.message);
        return;
      }

      if (!expiredInvoices || expiredInvoices.length === 0) {
        return;
      }

      

      for (const invoice of expiredInvoices) {
        try {
          // 1. Update invoice status to CANCELLED
          await supabase
            .from('invoices')
            .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
            .eq('id', invoice.id);

          // 2. Update all associated pending/overdue installments to CANCELLED
          await supabase
            .from('invoice_installments')
            .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
            .eq('invoice_id', invoice.id)
            .in('status', ['PENDING', 'OVERDUE']);

          // 3. Cancel the enrollment to free up the class slot
          if (invoice.learner_id && invoice.class_id) {
            await EnrollmentService.cancelEnrollmentByLearnerAndClass(invoice.learner_id, invoice.class_id);
          }
          
          
        } catch (err) {
          console.error(`[Invoice Expiry Cron] Failed to process invoice ${invoice.id}:`, err);
        }
      }
    } catch (err) {
      console.error('[Invoice Expiry Cron] Unexpected error:', err);
    }
  });
};
