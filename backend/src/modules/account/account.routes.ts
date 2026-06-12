import express from 'express';
import { AccountController } from './account.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = express.Router();

// Tất cả các route trong file này đều yêu cầu đăng nhập
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
 * /api/accounts:
 *   get:
 *     summary: Get all accounts (with pagination, filtering, search)
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *       - in: query
 *         name: filterRole
 *         schema:
 *           type: string
 *         description: Filter by role (e.g., ADMIN, STAFF, TUTOR, LEARNER)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by email or full name
 *     responses:
 *       200:
 *         description: A list of accounts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 * 
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role, full_name]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               role: { type: string, enum: [ADMIN, STAFF, TUTOR, LEARNER] }
 *               full_name: { type: string }
 *               phone_number: { type: string }
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 * 
 * /api/accounts/{id}:
 *   get:
 *     summary: Get account details by ID
 *     tags: [Accounts]
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
 *         description: Account details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Account not found
 * 
 *   patch:
 *     summary: Update account information
 *     tags: [Accounts]
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
 *               password: { type: string, format: password }
 *               role: { type: string, enum: [ADMIN, STAFF, TUTOR, LEARNER] }
 *               date_of_birth: { type: string, format: date }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER] }
 *               avatar_url: { type: string }
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Account not found
 * 
 * /api/accounts/{id}/status:
 *   patch:
 *     summary: Update account status (Ban/Active)
 *     tags: [Accounts]
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [ACTIVE, INACTIVE, SUSPENDED] }
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Account not found
 */

import { validateGetAllAccountsInput, validateAccountIdParam, validateCreateAccountInput, validateUpdateAccountInput, validateUpdateAccountStatusInput } from '../../middlewares/validators/account.validator';

// Lấy danh sách tài khoản (có hỗ trợ filter, search, pagination)
router.get('/', requireRole(['ADMIN', 'STAFF']), validateGetAllAccountsInput, AccountController.getAllAccounts);

// Lấy chi tiết 1 tài khoản
router.get('/:id', validateAccountIdParam, AccountController.getAccountById);

// Tạo tài khoản mới
router.post('/', requireRole(['ADMIN', 'STAFF']), validateCreateAccountInput, AccountController.createAccount);

// Cập nhật thông tin tài khoản (tên, sđt, mật khẩu)
router.patch('/:id', validateAccountIdParam, validateUpdateAccountInput, AccountController.updateAccount);

// Thay đổi trạng thái tài khoản (Ban / Active)
router.patch('/:id/status', requireRole(['ADMIN', 'STAFF']), validateAccountIdParam, validateUpdateAccountStatusInput, AccountController.updateAccountStatus);

export default router;
