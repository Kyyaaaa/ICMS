import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export class PaymentController {
  static async createUrl(req: Request, res: Response): Promise<void> {
    try {
      const { invoice_id, installment_id, payment_plan } = req.body;
      
      let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      if (Array.isArray(ipAddr)) ipAddr = ipAddr[0];

      const vnpUrl = await PaymentService.generateVnpayUrl(invoice_id, installment_id, payment_plan, ipAddr);
      res.status(200).json({ success: true, data: { paymentUrl: vnpUrl } });
    } catch (error: any) {
      if (error.message === 'Invoice not found' || error.message === 'Installment not found') {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  static async vnpayReturn(req: Request, res: Response): Promise<void> {
    try {
      const result = await PaymentService.verifyVnpayReturn(req.query);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, stack: error.stack });
    }
  }
}
