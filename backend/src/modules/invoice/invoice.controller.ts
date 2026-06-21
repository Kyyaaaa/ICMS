import { Request, Response } from 'express';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceService } from './invoice.service';

export class InvoiceController {
  static async checkout(req: Request, res: Response): Promise<void> {
    try {
      const { class_id, payment_plan = 'full' } = req.body;
      const learner_id = (req as any).user?.id;

      if (!class_id || !learner_id) {
        res.status(400).json({ success: false, message: 'class_id and learner_id are required' });
        return;
      }

      const result = await InvoiceService.checkout(learner_id, class_id, payment_plan);
      
      if (result.isExisting) {
        res.status(200).json({ success: true, data: result.invoice, message: 'Returned existing pending invoice' });
      } else {
        res.status(201).json({ success: true, data: result.invoice });
      }
    } catch (error: any) {
      if (error.message === 'Class or Course not found') {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  static async getInvoice(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const invoice = await InvoiceRepository.getInvoiceDetails(id);
      if (!invoice) {
        res.status(404).json({ success: false, message: 'Invoice not found' });
        return;
      }
      res.status(200).json({ success: true, data: invoice });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMyInvoices(req: Request, res: Response): Promise<void> {
    try {
      const learner_id = (req as any).user?.id;
      if (!learner_id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const invoices = await InvoiceRepository.getMyInvoices(learner_id);
      res.status(200).json({ success: true, data: invoices });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = await InvoiceRepository.getAllInvoices();
      res.status(200).json({ success: true, data: invoices });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async cancel(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const learner_id = (req as any).user?.id;
      if (!learner_id) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      await InvoiceService.cancelInvoice(id, learner_id);
      res.status(200).json({ success: true, message: 'Invoice cancelled successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
