import { Router } from 'express';
import { AuthController } from './auth.controller';
import { verifyToken } from '../../middlewares/auth.middleware';
import {
  validateRegisterInput,
  validateLoginInput,
  validateRefreshTokenInput,
  validateForgotPasswordInput,
  validateVerifyOtpInput,
  validateResetPasswordInput,
  validateGoogleSyncInput
} from '../../middlewares/validators/auth.validator';

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
router.post('/register', validateRegisterInput, AuthController.register);

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
router.post('/login', validateLoginInput, AuthController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Valid refresh token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Missing refresh token
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', validateRefreshTokenInput, AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify if current access token is still valid
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token is invalid or expired
 */
router.get('/verify', verifyToken, (_req: any, res: any) => {
    return res.status(200).json({ success: true, message: 'Token is valid' });
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP for password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: Error sending OTP
 */
router.post('/forgot-password', validateForgotPasswordInput, AuthController.forgotPassword);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify 6-digit OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 description: 6 digit code
 *     responses:
 *       200:
 *         description: OTP verified, returns reset_token
 *       400:
 *         description: Invalid OTP
 */
router.post('/verify-otp', validateVerifyOtpInput, AuthController.verifyOtp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using reset_token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reset_token
 *               - new_password
 *             properties:
 *               reset_token:
 *                 type: string
 *               new_password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Failed to reset password
 */
router.post('/reset-password', validateResetPasswordInput, AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 */
router.get('/google', AuthController.googleLogin);

/**
 * @swagger
 * /api/auth/google-sync:
 *   post:
 *     summary: Sync Google user with internal DB
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - access_token
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: Supabase access token obtained after Google login
 *               refresh_token:
 *                 type: string
 *                 description: Supabase refresh token
 *     responses:
 *       200:
 *         description: Sync successful, returns standardized user data
 *       400:
 *         description: Missing access token
 *       401:
 *         description: Invalid or expired token
 */
router.post('/google-sync', validateGoogleSyncInput, AuthController.syncGoogle);

export default router;
