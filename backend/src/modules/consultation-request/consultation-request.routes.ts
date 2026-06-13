import { Router } from 'express';
import { ConsultationRequestController } from './consultation-request.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

// BE-19: API Khách gửi yêu cầu (Public)
router.post('/', ConsultationRequestController.createConsultation);

// BE-20: API Lấy danh sách yêu cầu (Private, Staff)
router.get('/staff', verifyToken, requireRole(['STAFF', 'ADMIN']), ConsultationRequestController.getConsultations);

// BE-21: API Xử lý yêu cầu (Private, Staff)
router.patch('/staff/:id', verifyToken, requireRole(['STAFF', 'ADMIN']), ConsultationRequestController.updateConsultation);

export default router;
