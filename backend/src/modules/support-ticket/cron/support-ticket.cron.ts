import cron from 'node-cron';
import { supabaseAdmin as supabase } from '../../../configs/supabase';

export const initSupportTicketCron = () => {
  // Chạy mỗi phút (every minute)
  cron.schedule('* * * * *', async () => {
    // Bỏ qua nếu chạy trong test environment
    if (process.env.NODE_ENV === 'test') return;

    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    try {
      // Tự động chuyển các vé In Progress thành Resolved nếu không có tương tác > 15 phút
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ status: 'Resolved' })
        .in('status', ['In Progress'])
        .lt('updated_at', fifteenMinsAgo)
        .select('id');

      if (error) {
        console.error('[Cron Job] Error auto-resolving support tickets:', error.message);
      } else if (data && data.length > 0) {
        console.log(`[Cron Job] Successfully auto-resolved ${data.length} inactive support tickets.`);
      }
    } catch (error) {
      console.error('[Cron Job] Unknown error in support ticket cron:', error);
    }
  });

  console.log('[Cron Job] Support Ticket Auto-Resolver has been initialized.');
};
