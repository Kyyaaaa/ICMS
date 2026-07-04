import { Router } from 'express';
import { ClassroomController } from './classroom.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

// Public / Internal getters
router.get('/', ClassroomController.getAll);
router.get('/:id', ClassroomController.getById);

// Admin & Staff only routes
router.post('/', verifyToken, requireRole(['ADMIN', 'STAFF']), ClassroomController.create);
router.put('/:id', verifyToken, requireRole(['ADMIN', 'STAFF']), ClassroomController.update);
router.delete('/:id', verifyToken, requireRole(['ADMIN', 'STAFF']), ClassroomController.delete);

export default router;
