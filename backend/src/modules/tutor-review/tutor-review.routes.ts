import { Router } from 'express';
import { TutorReviewController } from './tutor-review.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/learner/classes/{classId}/tutor-review:
 *   get:
 *     summary: Get tutor review for a specific class
 *     tags: [Tutor Review]
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
router.get('/:classId/tutor-review', verifyToken, requireRole(['LEARNER']), TutorReviewController.getReview);

/**
 * @swagger
 * /api/learner/classes/{classId}/tutor-review:
 *   post:
 *     summary: Submit or update tutor review
 *     tags: [Tutor Review]
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
 *               tutor_id:
 *                 type: string
 *               rating:
 *                 type: number
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/:classId/tutor-review', verifyToken, requireRole(['LEARNER']), TutorReviewController.upsertReview);

export default router;
