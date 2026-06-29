import { Router } from 'express';
import { TutorClassController } from './tutor-class.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/:classId/gradebook', verifyToken, requireRole(['TUTOR', 'STAFF', 'ADMIN']), TutorClassController.getGradebook);
router.put('/:classId/gradebook/save', verifyToken, requireRole(['TUTOR', 'STAFF', 'ADMIN']), TutorClassController.saveGradebook);
router.post('/:classId/publish-grades', verifyToken, requireRole(['TUTOR', 'STAFF', 'ADMIN']), TutorClassController.publishGrades);

export default router;
