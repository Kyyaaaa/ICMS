import { Router } from 'express';
import { ConsultationRequestController } from './consultation-request.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/consultations:
 *   post:
 *     summary: Gửi form yêu cầu tư vấn (Public)
 *     tags: [Consultation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guest_name
 *               - guest_phone
 *               - inquiry_details
 *             properties:
 *               guest_name:
 *                 type: string
 *               guest_phone:
 *                 type: string
 *               guest_email:
 *                 type: string
 *               inquiry_details:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đã gửi yêu cầu thành công
 */
router.post('/', ConsultationRequestController.createConsultation);

/**
 * @swagger
 * /api/consultations/staff:
 *   get:
 *     summary: Xem danh sách yêu cầu tư vấn (Dành cho Staff/Admin)
 *     tags: [Consultation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng hiển thị
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/staff', verifyToken, requireRole(['STAFF', 'ADMIN']), ConsultationRequestController.getConsultations);

/**
 * @swagger
 * /api/consultations/staff/{id}:
 *   patch:
 *     summary: Cập nhật trạng thái và ghi chú cuộc gọi (Dành cho Staff)
 *     tags: [Consultation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID của yêu cầu tư vấn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               call_notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       409:
 *         description: Yêu cầu đã được nhân viên khác tiếp nhận
 */
router.patch('/staff/:id', verifyToken, requireRole(['STAFF', 'ADMIN']), ConsultationRequestController.updateConsultation);

export default router;
