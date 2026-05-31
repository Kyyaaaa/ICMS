import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import learnerRoutes from './routes/learner.routes';

// Cấu hình dotenv để đọc được file .env
dotenv.config();

// Khởi tạo kết nối tới database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares toàn cục
app.use(cors()); // Cho phép Client gọi API không bị lỗi Block CORS
app.use(express.json()); // Cho phép Server đọc dữ liệu JSON gửi lên từ Client

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/learners', learnerRoutes);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route kiểm tra trạng thái Server (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK',
    message: 'Server NodeJS + TypeScript đang chạy mượt mà!' 
  });
});

// Bật Server lắng nghe các request
app.listen(PORT, () => {
  console.log(`[Server]: Đang chạy tại giao lộ http://localhost:${PORT}`);
});