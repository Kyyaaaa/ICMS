import cron from 'node-cron';
import { supabaseAdmin as supabase } from '../../../configs/supabase';

const SLOT_TIMES: Record<string, { start: string, end: string }> = {
  'slot1': { start: '07:30', end: '09:30' },
  'slot2': { start: '09:30', end: '11:30' },
  'slot3': { start: '13:30', end: '15:30' },
  'slot4': { start: '15:30', end: '17:30' },
  'slot5': { start: '18:00', end: '20:00' },
  'slot6': { start: '20:00', end: '22:00' }
};

const updateClassStatuses = async () => {
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA');
  
  try {
    // 1. Chuyển UPCOMING -> ONGOING
    const { data: upcomingClasses, error: err1 } = await supabase
      .from('classes')
      .select('id, start_date, class_sessions(date, slot)')
      .eq('status', 'UPCOMING');

    if (err1) {
      console.error('[Cron Job] Error fetching UPCOMING classes:', err1.message);
    } else if (upcomingClasses) {
      for (const cls of upcomingClasses) {
        let shouldTransition = false;
        
        if (cls.class_sessions && cls.class_sessions.length > 0) {
          // Lấy session đầu tiên
          const firstSession = cls.class_sessions.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
          const slotConfig = SLOT_TIMES[firstSession.slot?.toLowerCase()];
          
          if (slotConfig) {
            const startDateTime = new Date(`${firstSession.date}T${slotConfig.start}:00+07:00`);
            if (now.getTime() >= startDateTime.getTime()) {
              shouldTransition = true;
            }
          }
        } else {
          // Fallback nếu không có session
          if (cls.start_date && cls.start_date <= todayStr) {
            shouldTransition = true;
          }
        }

        if (shouldTransition) {
          await supabase.from('classes').update({ status: 'ONGOING' }).eq('id', cls.id);
          
        }
      }
    }

    // 2. Chuyển ONGOING -> COMPLETED
    const { data: ongoingClasses, error: err2 } = await supabase
      .from('classes')
      .select('id, end_date, class_sessions(date, slot)')
      .eq('status', 'ONGOING');

    if (err2) {
      console.error('[Cron Job] Error fetching ONGOING classes:', err2.message);
    } else if (ongoingClasses) {
      for (const cls of ongoingClasses) {
        let shouldTransition = false;
        
        if (cls.class_sessions && cls.class_sessions.length > 0) {
          // Lấy session cuối cùng
          const lastSession = cls.class_sessions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          const slotConfig = SLOT_TIMES[lastSession.slot?.toLowerCase()];
          
          if (slotConfig) {
            const endDateTime = new Date(`${lastSession.date}T${slotConfig.end}:00+07:00`);
            if (now.getTime() > endDateTime.getTime()) {
              shouldTransition = true;
            }
          }
        } else {
          // Fallback nếu không có session
          if (cls.end_date && cls.end_date < todayStr) {
            shouldTransition = true;
          }
        }

        if (shouldTransition) {
          await supabase.from('classes').update({ status: 'COMPLETED' }).eq('id', cls.id);
          
        }
      }
    }
  } catch (error) {
    console.error('[Cron Job] Unknown error:', error);
  }
};

export const initClassStatusCron = () => {
  // Chạy mỗi phút
  cron.schedule('* * * * *', async () => {
    await updateClassStatuses();
  }, { timezone: 'Asia/Ho_Chi_Minh' });

  
};
