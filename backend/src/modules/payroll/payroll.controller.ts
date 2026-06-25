import { Request, Response } from 'express';
import { payrollService } from './payroll.service';

export const getConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await payrollService.getSalaryConfigs();
        res.json(configs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateConfig = async (req: Request, res: Response) => {
    try {
        const accountId = req.params.accountId as string;
        const result = await payrollService.updateSalaryConfig(accountId, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPayrolls = async (req: Request, res: Response) => {
    try {
        const payrolls = await payrollService.getPayrolls();
        res.json(payrolls);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyHistory = async (req: Request, res: Response) => {
    try {
        // Assume req.user is set by authMiddleware
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const history = await payrollService.getMyHistory(userId);
        res.json(history);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const generatePayroll = async (req: Request, res: Response) => {
    try {
        const result = await payrollService.generatePayroll(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updatePayroll = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const result = await payrollService.updatePayroll(id, req.body);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
