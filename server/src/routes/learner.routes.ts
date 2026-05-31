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
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal Server Error
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
 *               password: { type: string, description: "8-15 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char" }
 *               full_name: { type: string, description: "2-50 chars, letters and spaces only" }
 *               phone_number: { type: string, description: "Vietnamese phone number (optional, 10 digits starting with 03/05/07/08/09)" }
 *     responses:
 *       201:
 *         description: Learner created successfully
 *       400:
 *         description: Bad Request (Validation errors or creation failure)
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Unauthorized access
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
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Unauthorized access (Forbidden to access other learners' profiles)
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
 *               full_name: { type: string, description: "2-50 chars, letters and spaces only" }
 *               phone_number: { type: string, description: "Vietnamese phone number (optional, 10 digits starting with 03/05/07/08/09)" }
 *               status: { type: string, enum: [ACTIVE, INACTIVE, SUSPENDED] }
 *     responses:
 *       200:
 *         description: Update successful
 *       400:
 *         description: Bad Request (Validation errors)
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Unauthorized access
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
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Unauthorized access (Admin only)
 */

// Định tuyến
router.get('/', requireRole(['STAFF', 'ADMIN']), LearnerController.getAll);
router.get('/:id', requireRole(['LEARNER', 'STAFF', 'ADMIN']), LearnerController.getById);
router.post('/', requireRole(['STAFF', 'ADMIN']), LearnerController.create);
router.put('/:id', requireRole(['LEARNER', 'STAFF', 'ADMIN']), LearnerController.update);
router.delete('/:id', requireRole(['ADMIN']), LearnerController.delete);

export default router;
