import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/vnpay/create-url', verifyToken, requireRole(['LEARNER', 'learner', 'Learner']), PaymentController.createUrl);
router.get('/vnpay/vnpay-return', PaymentController.vnpayReturn); // Open for VNPay to call

export default router;
