import { Router } from 'express';
import { LearnerController } from '../controllers/learner.controller';
import { verifyToken, requireRole } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Mọi request đều phải đi qua chốt kiểm tra Token
 */
router.use(verifyToken);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /api/learners:
 *   get:
 *     summary: Lấy danh sách tất cả học viên
 *     tags: [Learners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách học viên
 *       403:
 *         description: Không có quyền truy cập
 * 
 *   post:
 *     summary: Tạo mới học viên thủ công (Dành cho Staff/Admin)
 *     tags: [Learners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, full_name]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               full_name: { type: string }
 *               phone_number: { type: string }
 *     responses:
 *       201:
 *         description: Tạo học viên thành công
 * 
 * /api/learners/{id}:
 *   get:
 *     summary: Lấy chi tiết 1 học viên theo Account ID
 *     tags: [Learners]
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
 *         description: Chi tiết học viên
 *       404:
 *         description: Không tìm thấy học viên
 * 
 *   put:
 *     summary: Cập nhật thông tin học viên
 *     tags: [Learners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name: { type: string }
 *               phone_number: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE, SUSPENDED] }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 * 
 *   delete:
 *     summary: Xóa hoàn toàn học viên khỏi hệ thống (Chỉ Admin)
 *     tags: [Learners]
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
 *         description: Đã xóa thành công
 */

// Định tuyến
router.get('/', requireRole(['STAFF', 'ADMIN']), LearnerController.getAll);
router.get('/:id', requireRole(['LEARNER', 'STAFF', 'ADMIN']), LearnerController.getById);
router.post('/', requireRole(['STAFF', 'ADMIN']), LearnerController.create);
router.put('/:id', requireRole(['LEARNER', 'STAFF', 'ADMIN']), LearnerController.update);
router.delete('/:id', requireRole(['ADMIN']), LearnerController.delete);

export default router;
