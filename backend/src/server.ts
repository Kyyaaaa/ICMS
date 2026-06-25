process.env.TZ = 'Asia/Ho_Chi_Minh';
import dotenv from 'dotenv';
import { connectDB } from './configs/database';
import app from './app';


// Cấu hình dotenv để đọc được file .env
dotenv.config();

import { initCycleLockingCron } from './modules/available-time-slot/cron/cycle-locking.cron';
import { initClassStatusCron } from './modules/class/cron/class-status.cron';
import { initSupportTicketCron } from './modules/support-ticket/cron/support-ticket.cron';
import { initDiscountStatusCron } from './modules/discount-code/cron/discount-status.cron';

// Khởi tạo kết nối tới database
connectDB();

// Khởi tạo cron jobs
initCycleLockingCron();
initClassStatusCron();
initSupportTicketCron();
initDiscountStatusCron();

const PORT = process.env.PORT || 5000;

// Bật Server lắng nghe các request
app.listen(PORT, () => {
  console.log(`[Server]: Running at http://localhost:${PORT}`);
});
