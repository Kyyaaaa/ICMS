import { RefundRepository } from './refund.repository';
import { RefundRequest, RefundStatusUpdate } from './refund.model';

import { InvoiceRepository } from '../invoice/invoice.repository';

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

    const invoiceAmount = Number(invoice.amount);
    const requestedAmount = Number(refundData.amount);
    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0 || requestedAmount !== invoiceAmount) {
      const err: any = new Error('Refund amount must equal the fully paid invoice amount');
      err.status = 400;
      throw err;
    }

    if (!refundData.reason?.trim() || !refundData.bank_name?.trim() || !refundData.bank_account_name?.trim() || !refundData.bank_account_number?.trim()) {
      const err: any = new Error('Refund reason and bank account details are required');
      err.status = 400;
      throw err;
    }

    refundData.amount = invoiceAmount;

    // The repository allocates the refund code under an advisory lock.
    return await RefundRepository.create(refundData);
  }

  static async getLearnerRefunds(learnerId: string) {
    return await RefundRepository.findByLearnerId(learnerId);
  }

  static async getAllRefunds() {
    return await RefundRepository.findAll();
  }

  static async updateRefundStatus(id: string, updateData: RefundStatusUpdate) {
    if (!['APPROVED', 'COMPLETED', 'REJECTED'].includes(updateData.status)) {
      const err: any = new Error('Invalid refund status');
      err.status = 400;
      throw err;
    }
    return await RefundRepository.updateStatus(id, updateData);
  }
}
