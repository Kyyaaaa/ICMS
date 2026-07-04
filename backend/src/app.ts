import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './configs/swagger';
import authRoutes from './modules/auth/auth.routes';
import learnerRoutes from './modules/learner/learner.routes';
import accountRoutes from './modules/account/account.routes';
import uploadRoutes from './modules/upload/upload.routes';
import certificateRoutes from './modules/certificate/certificate.routes';
import availableTimeSlotRoutes from './modules/available-time-slot/available-time-slot.routes';
import consultationRequestRoutes from './modules/consultation-request/consultation-request.routes';
import courseRoutes from './modules/course/course.routes';
import classroomRoutes from './modules/classroom/classroom.routes';
import classRoutes from './modules/class/class.routes';
import enrollmentRoutes from './modules/enrollment/enrollment.routes';
import sessionRoutes from './modules/session/session.routes';
import supportTicketRoutes from './modules/support-ticket/support-ticket.routes';
import announcementRoutes from './modules/announcement/announcement.routes';
import invoiceRoutes from './modules/invoice/invoice.routes';
import paymentRoutes from './modules/payment/payment.routes';
import tutorReviewRoutes from './modules/tutor-review/tutor-review.routes';
import adminTutorReviewRoutes from './modules/tutor-review/admin-tutor-review.routes';
import discountCodeRoutes from './modules/discount-code/discount-code.routes';
import publicDiscountCodeRoutes from './modules/discount-code/public-discount-code.routes';
import financeRoutes from './modules/finance/finance.routes';
import refundRoutes from './modules/refund/refund.routes';
import payrollRoutes from './modules/payroll/payroll.routes';
import tutorClassRoutes from './modules/tutor-class/tutor-class.routes';
import changeRequestRoutes from './modules/change-request/change-request.routes';

const app = express();

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Cho phép Client gọi API không bị lỗi Block CORS
app.use(express.json()); // Cho phép Server đọc dữ liệu JSON gửi lên từ Client

const skipRateLimit = process.env.NODE_ENV === 'test';

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => skipRateLimit
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs for auth routes
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  skip: () => skipRateLimit
});

// Apply global rate limiter
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/learners', learnerRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/available-time-slots', availableTimeSlotRoutes);
app.use('/api/consultations', consultationRequestRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/staff/classes', classRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/support-tickets', supportTicketRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/learner/classes', tutorReviewRoutes);
app.use('/api/admin/reviews', adminTutorReviewRoutes);
app.use('/api/admin/discount-codes', discountCodeRoutes);
app.use('/api/admin/finance', financeRoutes);
app.use('/api/public/discount-codes', publicDiscountCodeRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/payrolls', payrollRoutes);
app.use('/api/tutor/classes', tutorClassRoutes);
app.use('/api/change-requests', changeRequestRoutes);

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route kiểm tra trạng thái Server (Health Check)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'OK',
    message: 'NodeJS + TypeScript Server is running smoothly!' 
  });
});

export default app;
