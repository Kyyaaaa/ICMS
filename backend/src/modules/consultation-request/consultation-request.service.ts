import { ConsultationRequestRepository } from './consultation-request.repository';
import { CreateConsultationDTO, UpdateConsultationDTO } from './consultation-request.model';
import { validateUUID } from '../../utils/validators';

export class ConsultationRequestService {
  static async createRequest(data: CreateConsultationDTO) {
    if (!data.guest_name || !data.guest_phone || !data.inquiry_details) {
      const err: any = new Error('Missing required fields: guest_name, guest_phone, inquiry_details');
      err.status = 400;
      throw err;
    }

    const payload: any = { ...data, status: 'Pending' };
    if (!payload.guest_email || payload.guest_email.trim() === '') {
      payload.guest_email = null;
    }
    return await ConsultationRequestRepository.createRequest(payload);
  }

  static async listRequests(statusFilter?: string, page: number = 1, limit: number = 50) {
    if (isNaN(page) || page < 1) {
      const err: any = new Error('Invalid page number. Must be >= 1');
      err.status = 400;
      throw err;
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      const err: any = new Error('Invalid limit number. Must be between 1 and 100');
      err.status = 400;
      throw err;
    }

    return await ConsultationRequestRepository.listRequests(statusFilter, page, limit);
  }

  static async updateRequest(id: string, staffId: string, updates: UpdateConsultationDTO) {
    if (!validateUUID(id)) {
      const err: any = new Error('Invalid request ID format. Must be a valid UUID.');
      err.status = 400;
      throw err;
    }

    if (updates.status && !['Pending', 'Contacted', 'Converted', 'Canceled'].includes(updates.status)) {
      const err: any = new Error('Invalid status. Allowed values are: Pending, Contacted, Converted, Canceled');
      err.status = 400;
      throw err;
    }

    const request = await ConsultationRequestRepository.getRequestById(id);

    // Logic xử lý Race Condition (BE-21)
    if (request.handled_by_staff_id !== null && request.handled_by_staff_id !== staffId) {
      const error: any = new Error('Conflict: Request handled by another staff');
      error.status = 409;
      throw error;
    }

    const payload: any = { ...updates };
    
    if (request.handled_by_staff_id === null) {
      payload.handled_by_staff_id = staffId;
    }

    return await ConsultationRequestRepository.updateRequest(id, payload);
  }
}
