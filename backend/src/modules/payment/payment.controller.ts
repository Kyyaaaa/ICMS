import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

export class PaymentController {
  static async createUrl(req: Request, res: Response): Promise<void> {
    try {
      const { invoice_id, installment_id, payment_plan } = req.body;
      const learnerId = (req as any).user?.id;
      
      let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      if (Array.isArray(ipAddr)) ipAddr = ipAddr[0];

      const vnpUrl = await PaymentService.generateVnpayUrl(invoice_id, installment_id, payment_plan, ipAddr, learnerId);
      res.status(200).json({ success: true, data: { paymentUrl: vnpUrl } });
    } catch (error: any) {
      if (error.message === 'Invoice not found' || error.message === 'Installment not found') {
        res.status(404).json({ success: false, message: error.message });
      } else if (error.message.startsWith('Forbidden')) {
        res.status(403).json({ success: false, message: error.message });
      } else if (error.message === 'Invoice is not payable' || error.message === 'VNPay is not configured') {
        res.status(400).json({ success: false, message: error.message });
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
      res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
  }

  static async vnpayIpn(req: Request, res: Response): Promise<void> {
    try {
      const result = await PaymentService.verifyVnpayReturn(req.query);
      if (result.success) {
        res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
        return;
      }

      res.status(200).json({
        RspCode: result.code === '97' ? '97' : '00',
        Message: result.message
      });
    } catch (error: any) {
      const message = error?.message || 'Payment verification failed';
      const rspCode = message === 'Invoice not found'
        ? '01'
        : message.includes('amount')
          ? '04'
          : message.includes('not payable') || message.includes('Duplicate')
            ? '02'
            : '99';
      res.status(200).json({ RspCode: rspCode, Message: message });
    }
  }
}
