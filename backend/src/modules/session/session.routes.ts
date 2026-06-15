import { Router } from 'express';
import { SessionController } from './session.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/sessions/{session_id}/attendance:
 *   get:
 *     summary: Lấy danh sách điểm danh của 1 buổi học (Dành cho Tutor/Staff)
 *     tags: [Session, Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get('/:session_id/attendance', verifyToken, requireRole(['TUTOR', 'STAFF', 'ADMIN']), SessionController.getAttendance);

/**
 * @swagger
 * /api/sessions/{session_id}/attendance:
 *   put:
 *     summary: Cập nhật danh sách điểm danh của 1 buổi học (Dành cho Tutor/Staff)
 *     tags: [Session, Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 learner_id:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [PRESENT, ABSENT_EXCUSED, ABSENT_UNEXCUSED]
 *                 notes:
 *                   type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:session_id/attendance', verifyToken, requireRole(['TUTOR', 'STAFF', 'ADMIN']), SessionController.updateAttendance);

export default router;
