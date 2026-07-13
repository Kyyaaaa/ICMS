import { Router } from 'express';
import { CourseController } from './course.controller';
import { verifyToken, requireRole, optionalVerifyToken } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Lấy danh sách khóa học (Public trả về Active, Admin trả về toàn bộ)
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách khóa học thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/', optionalVerifyToken, CourseController.getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một khóa học
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID của khóa học
 *     responses:
 *       200:
 *         description: Lấy thông tin khóa học thành công
 *       404:
 *         description: Khóa học không tồn tại hoặc bị ẩn
 */
router.get('/:id', optionalVerifyToken, CourseController.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Tạo khóa học mới (Yêu cầu quyền Admin)
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - band
 *             properties:
 *               title:
 *                 type: string
 *               code:
 *                 type: string
 *               band:
 *                 type: string
 *               price:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', verifyToken, requireRole(['ADMIN']), CourseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Cập nhật thông tin khóa học (Yêu cầu quyền Admin)
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID của khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.put('/:id', verifyToken, requireRole(['ADMIN']), CourseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Xóa khóa học (Yêu cầu quyền Admin)
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID của khóa học
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete('/:id', verifyToken, requireRole(['ADMIN']), CourseController.deleteCourse);

export default router;
