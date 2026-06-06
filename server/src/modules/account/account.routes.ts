import express from 'express';
import { AccountController } from './account.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = express.Router();

// Tất cả các route trong file này đều yêu cầu đăng nhập
router.use(verifyToken);

// Lấy danh sách tài khoản (có hỗ trợ filter, search, pagination)
router.get('/', requireRole(['ADMIN', 'STAFF']), AccountController.getAllAccounts);

// Lấy chi tiết 1 tài khoản
router.get('/:id', AccountController.getAccountById);

// Tạo tài khoản mới
router.post('/', requireRole(['ADMIN', 'STAFF']), AccountController.createAccount);

// Cập nhật thông tin tài khoản (tên, sđt, mật khẩu)
router.patch('/:id', AccountController.updateAccount);

// Thay đổi trạng thái tài khoản (Ban / Active)
router.patch('/:id/status', requireRole(['ADMIN', 'STAFF']), AccountController.updateAccountStatus);

export default router;
