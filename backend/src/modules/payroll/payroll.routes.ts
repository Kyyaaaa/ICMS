import { Router } from 'express';
import { getConfigs, updateConfig, getPayrolls, generatePayroll, updatePayroll, getMyHistory } from './payroll.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/my-history', verifyToken, getMyHistory);

router.get('/configs', verifyToken, requireRole(['ADMIN']), getConfigs);
router.put('/configs/:accountId', verifyToken, requireRole(['ADMIN']), updateConfig);

router.get('/', verifyToken, requireRole(['ADMIN']), getPayrolls);
router.post('/generate', verifyToken, requireRole(['ADMIN']), generatePayroll);
router.put('/:id', verifyToken, requireRole(['ADMIN']), updatePayroll);

export default router;
