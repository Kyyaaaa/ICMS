import { Router } from 'express';
import { InvoiceController } from './invoice.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken, requireRole(['LEARNER', 'learner', 'Learner']), InvoiceController.getMyInvoices);
router.post('/checkout', verifyToken, requireRole(['LEARNER', 'learner', 'Learner']), InvoiceController.checkout);
router.get('/:id', verifyToken, InvoiceController.getInvoice);
router.put('/:id/cancel', verifyToken, requireRole(['LEARNER', 'learner', 'Learner']), InvoiceController.cancel);

export default router;
