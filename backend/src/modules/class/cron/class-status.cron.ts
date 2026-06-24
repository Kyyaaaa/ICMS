import cron from 'node-cron';
import { supabaseAdmin as supabase } from '../../../configs/supabase';

const updateClassStatuses = async () => {
  console.log('[Cron Job] Starting class status update...');
  const today = new Date().toLocaleDateString('en-CA');

  try {
    // 1. Chuyển UPCOMING -> ONGOING (start_date <= today)
    const { data: upcomingClasses, error: err1 } = await supabase
      .from('classes')
      .update({ status: 'ONGOING' })
      .eq('status', 'UPCOMING')
      .lte('start_date', today)
      .select('id');

    if (err1) {
      console.error('[Cron Job] Error updating UPCOMING -> ONGOING:', err1.message);
    } else {
      console.log(`[Cron Job] Successfully transitioned ${upcomingClasses?.length || 0} classes from UPCOMING to ONGOING.`);
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
      console.error('[Cron Job] Error updating ONGOING -> COMPLETED:', err2.message);
    } else {
      console.log(`[Cron Job] Successfully transitioned ${ongoingClasses?.length || 0} classes from ONGOING to COMPLETED.`);
    }
  } catch (error) {
    console.error('[Cron Job] Unknown error:', error);
  }
};

export const initClassStatusCron = () => {
  // Chạy vào 00:00 mỗi ngày
  cron.schedule('0 0 * * *', async () => {
    await updateClassStatuses();
  }, { timezone: 'Asia/Ho_Chi_Minh' });

  console.log('[Cron Job] Class Status Updater has been initialized.');
};
