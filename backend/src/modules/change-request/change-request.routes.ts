import { Router } from 'express';
import { ChangeRequestController } from './change-request.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/my-requests', verifyToken, ChangeRequestController.getMyRequests);
router.get('/', ChangeRequestController.getAll);
router.get('/tutor/:tutorId', ChangeRequestController.getByTutorId);
router.post('/', ChangeRequestController.create);
router.patch('/:id/status', ChangeRequestController.updateStatus);

export default router;
