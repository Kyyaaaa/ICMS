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
        // Suppress generic network fetch errors so they don't look like server crashes
        if (error.message && error.message.includes('fetch failed')) {
          // Silent network fail
        } else {
          console.error('[Cron Job] Error auto-resolving support tickets:', error.message);
        }
      } else if (data && data.length > 0) {
        
      }
    } catch (error) {
      console.error('[Cron Job] Unknown error in support ticket cron:', error);
    }
  }, { timezone: 'Asia/Ho_Chi_Minh' });

  
};
