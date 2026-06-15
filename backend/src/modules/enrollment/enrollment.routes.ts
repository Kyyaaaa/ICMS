import { Router } from 'express';
import { EnrollmentController } from './enrollment.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Ghi danh vào lớp học (Dành cho Learner)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - class_id
 *             properties:
 *               class_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lớp đã đầy hoặc đang không mở đăng ký
 */
router.post('/', verifyToken, requireRole(['LEARNER']), EnrollmentController.createEnrollment);

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Lấy danh sách lớp đang học (Dành cho Learner)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', verifyToken, requireRole(['LEARNER']), EnrollmentController.getMyEnrollments);

export default router;
