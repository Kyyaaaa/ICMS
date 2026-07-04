import { RefundRepository } from './refund.repository';
import { RefundRequest, RefundStatusUpdate } from './refund.model';

import { InvoiceRepository } from '../invoice/invoice.repository';
import { EnrollmentService } from '../enrollment/enrollment.service';

export class RefundService {
  static async createRefundRequest(refundData: RefundRequest) {
    if (!refundData.invoice_id) {
      throw new Error('invoice_id is required');
    }

    // 1. Verify invoice belongs to this learner and is PAID
    const invoice = await InvoiceRepository.getInvoiceById(refundData.invoice_id);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    if (invoice.learner_id !== refundData.learner_id) {
      const err: any = new Error('You do not have permission to request a refund for this invoice');
      err.status = 403;
      throw err;
    }
    
    if (invoice.status !== 'PAID') {
      const err: any = new Error('Only PAID invoices can be refunded');
      err.status = 400;
      throw err;
    }

    // 2. Generate REF number
    const lastRefund = await RefundRepository.getLatestRefund();
    let nextNum = 1;
    if (lastRefund && lastRefund.refund_code) {
      const match = lastRefund.refund_code.match(/^REF(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    refundData.refund_code = `REF${nextNum.toString().padStart(6, '0')}`;
    
    // 3. Create request
    return await RefundRepository.create(refundData);
  }

  static async getLearnerRefunds(learnerId: string) {
    return await RefundRepository.findByLearnerId(learnerId);
  }

  static async getAllRefunds() {
    return await RefundRepository.findAll();
  }

  static async updateRefundStatus(id: string, updateData: RefundStatusUpdate) {
    const refund = await RefundRepository.updateStatus(id, updateData);
    
    if (updateData.status === 'COMPLETED' && refund.invoice_id) {
        try {
            const invoice = await InvoiceRepository.getInvoiceById(refund.invoice_id);
            if (invoice && invoice.class_id) {
                await EnrollmentService.cancelEnrollmentByLearnerAndClass(refund.learner_id, invoice.class_id);
            }
        } catch (error) {
            console.error('Error cancelling enrollment after refund:', error);
        }
    }
    
    return refund;
  }
}
