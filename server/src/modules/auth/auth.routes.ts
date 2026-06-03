import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new Learner account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registration email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password (8-15 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
 *               full_name:
 *                 type: string
 *                 description: Full name (2-50 chars, letters and spaces only)
 *               phone_number:
 *                 type: string
 *                 description: Vietnamese phone number (optional, 10 digits starting with 03/05/07/08/09)
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid input data or system error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: System login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Login email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password
 *     responses:
 *       200:
 *         description: Login successful, returns Access Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *                     user:
 *                       type: object
 *       400:
 *         description: Missing input data
 *       401:
 *         description: Invalid login credentials
 */
router.post('/login', AuthController.login);

export default router;
