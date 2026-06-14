import dotenv from 'dotenv';
import { connectDB } from './configs/database';
import app from './app';
import './cron/classStatusCron';

// Cấu hình dotenv để đọc được file .env
dotenv.config();

// Khởi tạo kết nối tới database
connectDB();

const PORT = process.env.PORT || 5000;

// Bật Server lắng nghe các request
app.listen(PORT, () => {
  console.log(`[Server]: Running at http://localhost:${PORT}`);
});
