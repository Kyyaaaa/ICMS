import { Request, Response } from 'express';
import { FinanceService } from './finance.service';

export class FinanceController {
  static async getAllTransactions(_req: Request, res: Response) {
    try {
      const transactions = await FinanceService.getAllTransactions();
      res.json({ data: transactions });
    } catch (error: any) {
      console.error('Get all transactions error:', error);
      res.status(500).json({ message: error.message });
    }
  }
}
