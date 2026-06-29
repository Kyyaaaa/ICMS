import express from 'express';
import { validateDiscountCode } from './discount-code.controller';

const router = express.Router();

router.get('/validate/:code', validateDiscountCode);

export default router;
