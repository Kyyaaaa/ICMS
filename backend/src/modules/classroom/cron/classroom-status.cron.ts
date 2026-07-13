import cron from 'node-cron';
import { supabaseAdmin as supabase } from '../../../configs/supabase';

export const initClassroomStatusCron = () => {
  // Chạy mỗi phút (every minute)
  cron.schedule('* * * * *', async () => {
    // Bỏ qua nếu chạy trong test environment
    if (process.env.NODE_ENV === 'test') return;

    try {
      // 1. Fetch tất cả các phòng đang trong bảng maintenance
      const { data: maintenances, error: fetchError } = await supabase
        .from('classroom_maintenance')
        .select('*');

      if (fetchError) {
        console.error('[Cron Job] Lỗi khi lấy danh sách bảo trì:', fetchError.message);
        return;
      }

      if (!maintenances || maintenances.length === 0) {
        return;
      }

      const now = new Date();
      
      const finishedMaintenances = maintenances.filter((maint) => {
        if (!maint.maintenance_date || !maint.end_time) return false;
        
        // maintenance_date: YYYY-MM-DD
        // end_time: HH:mm (hoặc HH:mm:ss)
        // Ghép lại thành chuỗi ISO hợp lệ.
        
        const dateStr = maint.maintenance_date.split('T')[0]; // Đề phòng có T
        const timeStr = maint.end_time.length === 5 ? `${maint.end_time}:00` : maint.end_time;
        
        const endDateTime = new Date(`${dateStr}T${timeStr}+07:00`); // Assuming Asia/Ho_Chi_Minh (+07:00)
        
        return now.getTime() >= endDateTime.getTime();
      });

      if (finishedMaintenances.length === 0) {
        return;
      }

      

      // 2. Cập nhật lại status và xóa maintenance record
      for (const maint of finishedMaintenances) {
        const classroomId = maint.classroom_id;

        // Xóa record maintenance trước
        const { error: delError } = await supabase
          .from('classroom_maintenance')
          .delete()
          .eq('id', maint.id);
          
        if (delError) {
           console.error(`[Cron Job] Lỗi khi xóa maintenance cho classroom ${classroomId}:`, delError.message);
           continue;
        }

        // Cập nhật status thành AVAILABLE
        const { error: updateError } = await supabase
          .from('classroom')
          .update({ status: 'AVAILABLE', updated_at: new Date().toISOString() })
          .eq('id', classroomId);

        if (updateError) {
           console.error(`[Cron Job] Lỗi khi cập nhật AVAILABLE cho classroom ${classroomId}:`, updateError.message);
        } else {
           
        }
      }

    } catch (error) {
      console.error('[Cron Job] Lỗi không xác định trong classroom status cron:', error);
    }
  }, { timezone: 'Asia/Ho_Chi_Minh' });

  
};
