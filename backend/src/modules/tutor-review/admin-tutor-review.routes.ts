import { Router } from 'express';
import { AdminTutorReviewController } from './admin-tutor-review.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/admin/reviews/tutors:
 *   get:
 *     summary: Get all tutors with their average ratings and active classes count
 *     tags: [Admin Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/tutors', verifyToken, requireRole(['ADMIN']), AdminTutorReviewController.getAllTutorRatings);

/**
 * @swagger
 * /api/admin/reviews/tutors/{id}:
 *   get:
 *     summary: Get detailed review info for a specific tutor
 *     tags: [Admin Reviews]
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
 *         description: Success
 */
router.get('/tutors/:id', verifyToken, requireRole(['ADMIN']), AdminTutorReviewController.getTutorReviewDetail);

export default router;
