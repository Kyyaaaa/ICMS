import { Router } from 'express';
import { ClassController } from './class.controller';

const router = Router();

/**
 * @swagger
 * /api/staff/classes:
 *   get:
 *     summary: Lấy danh sách các lớp học
 *     tags: [Class]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái lớp học (UPCOMING, ONGOING, COMPLETED, CANCELED)
 *       - in: query
 *         name: course_id
 *         schema:
 *           type: string
 *         description: Lọc theo khóa học
 *       - in: query
 *         name: tutor_id
 *         schema:
 *           type: string
 *         description: Lọc theo gia sư
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', ClassController.getClasses);

/**
 * @swagger
 * /api/staff/classes/{id}:
 *   get:
 *     summary: Lấy chi tiết một lớp học kèm danh sách buổi học
 *     tags: [Class]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', ClassController.getClassById);

/**
 * @swagger
 * /api/staff/classes:
 *   post:
 *     summary: Khởi tạo lớp học mới
 *     tags: [Class]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               course_id:
 *                 type: string
 *               tutor_id:
 *                 type: string
 *               classroom_id:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               capacity:
 *                 type: integer
 *               sessions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     session_number:
 *                       type: integer
 *                     date:
 *                       type: string
 *                       format: date
 *                     slot:
 *                       type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict
 */
router.post('/', ClassController.createClass);

/**
 * @swagger
 * /api/staff/classes/{id}:
 *   patch:
 *     summary: Cập nhật thông tin chung của lớp học
 *     tags: [Class]
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
 *               tutor_id:
 *                 type: string
 *               classroom_id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.patch('/:id', ClassController.updateClass);

/**
 * @swagger
 * /api/staff/classes/{class_id}/sessions/{session_id}:
 *   patch:
 *     summary: Cập nhật lịch học của một buổi cụ thể
 *     tags: [Class]
 *     parameters:
 *       - in: path
 *         name: class_id
 *         required: true
 *         schema:
 *           type: string
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
 *             type: object
 *             properties:
 *               tutor_id:
 *                 type: string
 *               classroom_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               slot:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       409:
 *         description: Conflict Schedule
 */
router.patch('/:class_id/sessions/:session_id', ClassController.updateClassSession);

/**
 * @swagger
 * /api/staff/classes/{id}/students:
 *   get:
 *     summary: Lấy danh sách học viên của lớp học
 *     tags: [Class]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id/students', ClassController.getClassStudents);

export default router;
