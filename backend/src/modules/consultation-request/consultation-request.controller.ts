import { Request, Response } from 'express';
import { ConsultationRequestService } from './consultation-request.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { validateUUID } from '../../utils/validators';

export class ConsultationRequestController {
  
  // Public API: Guest gửi yêu cầu
  static async createConsultation(req: Request, res: Response) {
    try {
      const { guest_name, guest_phone, guest_email, inquiry_details } = req.body;

      if (!guest_name || !guest_phone || !inquiry_details) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: guest_name, guest_phone, inquiry_details'
        });
      }

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
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Private API: Staff lấy danh sách yêu cầu
  static async getConsultations(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, page, limit } = req.query;

      const p = page ? parseInt(page as string) : 1;
      const l = limit ? parseInt(limit as string) : 50;

      if (isNaN(p) || p < 1) {
        return res.status(400).json({ success: false, message: 'Invalid page number. Must be >= 1' });
      }

      if (isNaN(l) || l < 1 || l > 100) {
        return res.status(400).json({ success: false, message: 'Invalid limit number. Must be between 1 and 100' });
      }

      const result = await ConsultationRequestService.listRequests(status as string, p, l);

      return res.status(200).json({
        success: true,
        data: result.data,
        total: result.total,
        message: 'Consultation requests retrieved successfully'
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Private API: Staff xử lý yêu cầu
  static async updateConsultation(req: AuthenticatedRequest, res: Response) {
    try {
      const staffId = req.user.id as string;
      const id = req.params.id as string;

      if (!validateUUID(id)) {
        return res.status(400).json({ success: false, message: 'Invalid request ID format. Must be a valid UUID.' });
      }

      const { status, call_notes } = req.body;

      // Validate status if provided
      if (status && !['Pending', 'Contacted', 'Converted', 'Canceled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Allowed values are: Pending, Contacted, Converted, Canceled'
        });
      }

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
      if (error.status === 409) {
        return res.status(409).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
