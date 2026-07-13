import { Router } from 'express';
import { ChangeRequestController } from './change-request.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/check-availability', verifyToken, ChangeRequestController.checkAvailability);
router.get('/my-requests', verifyToken, ChangeRequestController.getMyRequests);
router.get('/', verifyToken, requireRole(['STAFF', 'ADMIN']), ChangeRequestController.getAll);
router.get('/tutor/:tutorId', verifyToken, requireRole(['STAFF', 'ADMIN', 'TUTOR']), ChangeRequestController.getByTutorId);
router.post('/', verifyToken, requireRole(['TUTOR']), ChangeRequestController.create);
router.patch('/:id/status', verifyToken, requireRole(['STAFF', 'ADMIN']), ChangeRequestController.updateStatus);

export default router;
