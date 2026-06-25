import { Request, Response } from 'express';
import { RefundService } from './refund.service';

export class RefundController {
  static async createRequest(req: Request, res: Response) {
    try {
      const learner_id = (req as any).user.id;
      const refundData = { ...req.body, learner_id };
      const data = await RefundService.createRefundRequest(refundData);
      res.status(201).json({ message: 'Refund request created successfully', data });
    } catch (error: any) {
      console.error('Error creating refund request:', error);
      res.status(500).json({ message: 'Error creating refund request', error: error.message });
    }
  }

  static async getLearnerRefunds(req: Request, res: Response) {
    try {
      const learner_id = (req as any).user.id;
      const data = await RefundService.getLearnerRefunds(learner_id);
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching learner refunds', error: error.message });
    }
  }

  static async getAllRefunds(req: Request, res: Response) {
    try {
      const data = await RefundService.getAllRefunds();
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching refunds', error: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status, admin_notes } = req.body;
      const data = await RefundService.updateRefundStatus(id, { status, admin_notes });
      res.json({ message: 'Refund status updated successfully', data });
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating refund status', error: error.message });
    }
  }
}
