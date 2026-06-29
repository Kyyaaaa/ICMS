import { Router } from 'express';
import { RefundController } from './refund.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

// Learner routes
router.post('/learner', verifyToken, requireRole(['LEARNER']), RefundController.createRequest);
router.get('/learner', verifyToken, requireRole(['LEARNER']), RefundController.getLearnerRefunds);

// Admin routes
router.get('/admin', verifyToken, requireRole(['ADMIN']), RefundController.getAllRefunds);
router.patch('/admin/:id/status', verifyToken, requireRole(['ADMIN']), RefundController.updateStatus);

export default router;
