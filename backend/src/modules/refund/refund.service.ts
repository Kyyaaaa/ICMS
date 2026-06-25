import { RefundRepository } from './refund.repository';
import { RefundRequest, RefundStatusUpdate } from './refund.model';

export class RefundService {
  static async createRefundRequest(refundData: RefundRequest) {
    const lastRefund = await RefundRepository.getLatestRefund();
    let nextNum = 1;
    if (lastRefund && lastRefund.refund_code) {
      const match = lastRefund.refund_code.match(/^REF(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    refundData.refund_code = `REF${nextNum.toString().padStart(6, '0')}`;
    
    return await RefundRepository.create(refundData);
  }

  static async getLearnerRefunds(learnerId: string) {
    return await RefundRepository.findByLearnerId(learnerId);
  }

  static async getAllRefunds() {
    return await RefundRepository.findAll();
  }

  static async updateRefundStatus(id: string, updateData: RefundStatusUpdate) {
    return await RefundRepository.updateStatus(id, updateData);
  }
}
