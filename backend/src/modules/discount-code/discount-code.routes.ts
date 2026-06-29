import express from 'express';
import { getDiscountCodes, createDiscountCode, updateDiscountCode, deleteDiscountCode } from './discount-code.controller';

const router = express.Router();

router.get('/', getDiscountCodes);
router.post('/', createDiscountCode);
router.put('/:id', updateDiscountCode);
router.delete('/:id', deleteDiscountCode);

export default router;
