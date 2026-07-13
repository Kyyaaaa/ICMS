import { Request, Response } from 'express';
import { DiscountCodeService } from './discount-code.service';

const service = new DiscountCodeService();

export const getDiscountCodes = async (_req: Request, res: Response) => {
    try {
        const codes = await service.getAllDiscountCodes();
        res.status(200).json({
            message: 'Success',
            data: codes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createDiscountCode = async (req: Request, res: Response) => {
    try {
        const data = await service.createDiscountCode(req.body);
        res.status(201).json({
            message: 'Created',
            data
        });
    } catch (error: any) {
        console.error(error);
        if (error.code === '23505') { // unique violation
            res.status(400).json({ message: 'Code already exists' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const updateDiscountCode = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = await service.updateDiscountCode(id, req.body);
        res.status(200).json({
            message: 'Updated',
            data
        });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Discount code not found') {
            res.status(404).json({ message: error.message });
        } else if (error.code === '23505') {
            res.status(400).json({ message: 'Code already exists' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const deleteDiscountCode = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await service.deleteDiscountCode(id);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Discount code not found') {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export const validateDiscountCode = async (req: Request, res: Response) => {
    try {
        const code = req.params.code as string;
        const discount = await service.validateDiscountCode(code);
        
        res.status(200).json({
            message: 'Valid discount code',
            data: discount
        });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Discount code not found') {
            res.status(404).json({ message: 'Invalid discount code' });
        } else if (error.message.includes('inactive') || error.message.includes('not yet valid') || error.message.includes('expired')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};
