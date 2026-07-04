import cron from "node-cron";
import pool from "../../../configs/database";

export const initDiscountStatusCron = () => {
  // Chạy mỗi phút (every minute)
  cron.schedule("* * * * *", async () => {
    try {
      // Find codes that are expired but still have status 'Active'
      const updateResult = await pool.query(`
        UPDATE discount_codes 
        SET status = 'Expired', updated_at = CURRENT_TIMESTAMP
        WHERE status = 'Active' AND valid_until <= CURRENT_TIMESTAMP
      `);

      if (updateResult.rowCount && updateResult.rowCount > 0) {
        
      }

      // We could also do valid_from logic to set them from disabled/pending to Active,
      // but the requirement is "sau khi hết thời gian hiệu lực thì tự chuyển thành hết hạn" (after valid time ends, auto change to expired).
    } catch (error) {
      console.error(
        "[Cron Job Error] Failed to update discount code status:",
        error,
      );
    }
  }, { timezone: 'Asia/Ho_Chi_Minh' });

  
};
