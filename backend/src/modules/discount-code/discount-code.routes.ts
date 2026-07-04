import express from 'express';
import { getDiscountCodes, createDiscountCode, updateDiscountCode, deleteDiscountCode } from './discount-code.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get('/', verifyToken, requireRole(['ADMIN', 'STAFF']), getDiscountCodes);
router.post('/', verifyToken, requireRole(['ADMIN', 'STAFF']), createDiscountCode);
router.put('/:id', verifyToken, requireRole(['ADMIN', 'STAFF']), updateDiscountCode);
router.delete('/:id', verifyToken, requireRole(['ADMIN', 'STAFF']), deleteDiscountCode);

export default router;
