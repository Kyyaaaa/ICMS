import express from 'express';
import { FinanceController } from './finance.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get('/transactions', verifyToken, requireRole(['ADMIN']), FinanceController.getAllTransactions);

export default router;
