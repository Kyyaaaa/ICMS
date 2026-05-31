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
 *     summary: Get a list of all learners
 *     tags: [Learners]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of learners
 *       403:
 *         description: Unauthorized access
 * 
 *   post:
 *     summary: Create a new learner manually (For Staff/Admin)
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
 *         description: Learner created successfully
 * 
 * /api/learners/{id}:
 *   get:
 *     summary: Get details of a learner by Account ID
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
 *         description: Learner details
 *       404:
 *         description: Learner not found
 * 
 *   put:
 *     summary: Update learner information
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
 *         description: Update successful
 * 
 *   delete:
 *     summary: Permanently delete a learner from the system (Admin only)
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
 *         description: Successfully deleted
 */

// Định tuyến
router.get('/', requireRole(['STAFF', 'ADMIN']), LearnerController.getAll);
router.get('/:id', requireRole(['LEARNER', 'STAFF', 'ADMIN']), LearnerController.getById);
router.post('/', requireRole(['STAFF', 'ADMIN']), LearnerController.create);
router.put('/:id', requireRole(['LEARNER', 'STAFF', 'ADMIN']), LearnerController.update);
router.delete('/:id', requireRole(['ADMIN']), LearnerController.delete);

export default router;
