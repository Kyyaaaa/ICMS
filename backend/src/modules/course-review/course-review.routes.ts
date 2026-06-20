import { Router } from 'express';
import { CourseReviewController } from './course-review.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/learner/classes/{classId}/course-review:
 *   get:
 *     summary: Get course review for a specific class
 *     tags: [Course Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:classId/course-review', verifyToken, requireRole(['LEARNER']), CourseReviewController.getReview);

/**
 * @swagger
 * /api/learner/classes/{classId}/course-review:
 *   post:
 *     summary: Submit or update course review
 *     tags: [Course Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
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
 *               course_id:
 *                 type: string
 *               rating:
 *                 type: number
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/:classId/course-review', verifyToken, requireRole(['LEARNER']), CourseReviewController.upsertReview);

export default router;
