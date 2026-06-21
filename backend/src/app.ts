import express, { Request, Response } from 'express';
import cors from 'cors';
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

const app = express();

// Middlewares toàn cục
app.use(cors()); // Cho phép Client gọi API không bị lỗi Block CORS
app.use(express.json()); // Cho phép Server đọc dữ liệu JSON gửi lên từ Client

// Routes
app.use('/api/auth', authRoutes);
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
