import { Router } from 'express';
import { getConfigs, updateConfig, getPayrolls, generatePayroll, updatePayroll, getMyHistory } from './payroll.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/my-history', verifyToken, getMyHistory);

router.get('/configs', getConfigs);
router.put('/configs/:accountId', updateConfig);

router.get('/', getPayrolls);
router.post('/generate', generatePayroll);
router.put('/:id', updatePayroll);

export default router;
