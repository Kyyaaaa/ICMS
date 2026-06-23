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

/**
 * @swagger
 * /api/enrollments/{id}/cancel:
 *   patch:
 *     summary: Hủy ghi danh (Dành cho Staff/Admin)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.patch('/:id/cancel', verifyToken, requireRole(['STAFF', 'ADMIN']), EnrollmentController.cancelEnrollment);

/**
 * @swagger
 * /api/enrollments/manual:
 *   post:
 *     summary: Ghi danh thủ công học viên vào lớp học (Dành cho Staff/Admin)
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
 *               - learner_id
 *               - class_id
 *             properties:
 *               learner_id:
 *                 type: string
 *               class_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ghi danh thành công
 *       400:
 *         description: Lớp đã đầy, hoặc học viên đã có trong lớp
 *       404:
 *         description: Lớp học không tồn tại
 *       409:
 *         description: Học viên đã ghi danh
 *       500:
 *         description: Lỗi hệ thống
 */
router.post('/manual', verifyToken, requireRole(['STAFF', 'ADMIN']), EnrollmentController.manualEnrollment);

export default router;
