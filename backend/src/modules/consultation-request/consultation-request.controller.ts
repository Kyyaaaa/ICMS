import { Request, Response } from 'express';
import { ConsultationRequestService } from './consultation-request.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class ConsultationRequestController {
  
  // Public API: Guest gửi yêu cầu
  static async createConsultation(req: Request, res: Response) {
    try {
      const { guest_name, guest_phone, guest_email, inquiry_details } = req.body;
      const newRequest = await ConsultationRequestService.createRequest({
        guest_name,
        guest_phone,
        guest_email,
        inquiry_details
      });

      return res.status(201).json({
        success: true,
        data: newRequest,
        message: 'Consultation request submitted successfully'
      });
    } catch (error: any) {
      const status = error.status || 500;
      return res.status(status).json({ success: false, message: error.message });
    }
  }

  // Private API: Staff lấy danh sách yêu cầu
  static async getConsultations(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, page, limit } = req.query;

      const p = page ? parseInt(page as string) : 1;
      const l = limit ? parseInt(limit as string) : 50;

      const result = await ConsultationRequestService.listRequests(status as string, p, l);

      return res.status(200).json({
        success: true,
        data: result.data,
        total: result.total,
        message: 'Consultation requests retrieved successfully'
      });
    } catch (error: any) {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  // Private API: Staff xử lý yêu cầu
  static async updateConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      const staffId = req.user.id as string;
      const id = req.params.id as string;
      const { status, call_notes } = req.body;

      const updatedRequest = await ConsultationRequestService.updateRequest(id, staffId, {
        status,
        call_notes
      });

      return res.status(200).json({
        success: true,
        data: updatedRequest,
        message: 'Consultation request updated successfully'
      });
    } catch (error: any) {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({ success: false, message: error.message });
    }
  }
}
