import cron from 'node-cron';
import { supabase } from '../configs/supabase';

// Chạy vào 00:00 mỗi ngày
cron.schedule('0 0 * * *', async () => {
  console.log('[Cron Job] Bắt đầu cập nhật trạng thái các lớp học...');
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Chuyển UPCOMING -> ONGOING (start_date <= today)
    const { data: upcomingClasses, error: err1 } = await supabase
      .from('classes')
      .update({ status: 'ONGOING' })
      .eq('status', 'UPCOMING')
      .lte('start_date', today)
      .select('id');

    if (err1) {
      console.error('[Cron Job] Lỗi khi cập nhật UPCOMING -> ONGOING:', err1.message);
    } else {
      console.log(`[Cron Job] Đã chuyển ${upcomingClasses?.length || 0} lớp từ UPCOMING sang ONGOING.`);
    }

    // 2. Chuyển ONGOING -> COMPLETED (end_date < today)
    // Nếu end_date là 10/10, thì sang 11/10 mới là COMPLETED
    const { data: ongoingClasses, error: err2 } = await supabase
      .from('classes')
      .update({ status: 'COMPLETED' })
      .eq('status', 'ONGOING')
      .lt('end_date', today)
      .select('id');

    if (err2) {
      console.error('[Cron Job] Lỗi khi cập nhật ONGOING -> COMPLETED:', err2.message);
    } else {
      console.log(`[Cron Job] Đã chuyển ${ongoingClasses?.length || 0} lớp từ ONGOING sang COMPLETED.`);
    }
  } catch (error) {
    console.error('[Cron Job] Lỗi không xác định:', error);
  }
});

console.log('[Cron Job] Class Status Updater đã được khởi động.');
