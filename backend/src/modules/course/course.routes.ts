import { Router } from 'express';
import { CourseController } from './course.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

// Các route công khai (không yêu cầu đăng nhập)
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

// Các route chỉ dành riêng cho quyền Admin
router.post('/', verifyToken, requireRole(['ADMIN']), CourseController.createCourse);
router.put('/:id', verifyToken, requireRole(['ADMIN']), CourseController.updateCourse);
router.delete('/:id', verifyToken, requireRole(['ADMIN']), CourseController.deleteCourse);

export default router;
