import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './configs/swagger';
import authRoutes from './modules/auth/auth.routes';
import learnerRoutes from './modules/learner/learner.routes';
import accountRoutes from './modules/account/account.routes';
import uploadRoutes from './modules/upload/upload.routes';

const app = express();

// Middlewares toàn cục
app.use(cors()); // Cho phép Client gọi API không bị lỗi Block CORS
app.use(express.json()); // Cho phép Server đọc dữ liệu JSON gửi lên từ Client

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/learners', learnerRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/upload', uploadRoutes);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route kiểm tra trạng thái Server (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK',
    message: 'NodeJS + TypeScript Server is running smoothly!' 
  });
});

export default app;
