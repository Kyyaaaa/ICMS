import { ConsultationRequestRepository } from './consultation-request.repository';
import { CreateConsultationDTO, UpdateConsultationDTO } from './consultation-request.model';

export class ConsultationRequestService {
  static async createRequest(data: CreateConsultationDTO) {
    // Basic validation can be done here or in controller
    const payload: any = { ...data, status: 'Pending' };
    if (!payload.guest_email || payload.guest_email.trim() === '') {
      payload.guest_email = null;
    }
    return await ConsultationRequestRepository.createRequest(payload);
  }

  static async listRequests(statusFilter?: string, page: number = 1, limit: number = 50) {
    return await ConsultationRequestRepository.listRequests(statusFilter, page, limit);
  }

  static async updateRequest(id: string, staffId: string, updates: UpdateConsultationDTO) {
    const request = await ConsultationRequestRepository.getRequestById(id);

    // Race condition logic (BE-21):
    // "Kiểm tra xem yêu cầu này có đang được nhân viên khác tiếp nhận không (dựa trên handled_by_staff_id khác null và khác ID người đang thao tác). Nếu có nhân viên khác đã/đang xử lý, ném ra lỗi HTTP 409 Conflict"
    if (request.handled_by_staff_id !== null && request.handled_by_staff_id !== staffId) {
      const error: any = new Error('Yêu cầu đã được nhân viên khác tiếp nhận');
      error.status = 409;
      throw error;
    }

    const payload: any = { ...updates };
    
    // Tự động gán handled_by_staff_id bằng ID của Staff hiện tại nếu chưa có
    if (request.handled_by_staff_id === null) {
      payload.handled_by_staff_id = staffId;
    }

    return await ConsultationRequestRepository.updateRequest(id, payload);
  }
}
