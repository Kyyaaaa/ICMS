import { Response } from 'express';
import { CertificateService } from './certificate.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class CertificateController {
  
  static async getMyCertificates(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role;
      const callerId = req.user.id;

      // This endpoint is specifically for the logged-in tutor to get their own
      const Certificates = await CertificateService.listCertificates(callerRole, callerId, callerId);

      return res.status(200).json({
        success: true,
        data: Certificates,
        message: 'Certificates retrieved successfully'
      });
    } catch (error) {
      const err = error as Error;
      if (err.message && err.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
  }

  static async getAllCertificates(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role;
      const { status } = req.query;

      const Certificates = await CertificateService.getAllCertificates(callerRole, status as string | undefined);

      return res.status(200).json({
        success: true,
        data: Certificates,
        message: 'All Certificates retrieved successfully'
      });
    } catch (error) {
      const err = error as Error;
      if (err.message && err.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
  }


  static async createCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const tutorId = req.user.id; // Usually the person creating is the tutor themselves
      const { name, issuer, issue_date, expiration_date, file_url } = req.body;

      const newQual = await CertificateService.addCertificate(
        tutorId,
        name,
        issuer,
        issue_date,
        expiration_date,
        file_url
      );

      return res.status(201).json({
        success: true,
        data: newQual,
        message: 'Certificate created successfully'
      });
    } catch (error) {
      const err = error as Error;
      return res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
  }

  static async updateCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role as string;
      const callerId = req.user.id;
      const { id } = req.params;

      const updateData = req.body; // already filtered by validator

      const updatedQual = await CertificateService.editCertificate(
        callerRole,
        callerId,
        id as string,
        updateData
      );

      return res.status(200).json({
        success: true,
        data: updatedQual,
        message: 'Certificate updated successfully'
      });
    } catch (error) {
      const err = error as Error;
      if (err.message && err.message.includes('not found')) {
        return res.status(404).json({ success: false, message: err.message });
      }
      if (err.message && err.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
  }

  static async changeStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role as string;
      const { id } = req.params;
      const { status, reject_reason } = req.body;

      // Status could be 'Verified' or 'Rejected'
      if (status !== 'Verified' && status !== 'Rejected' && status !== 'Pending Verification') {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Allowed values: Verified, Rejected, Pending Verification'
        });
      }

      const updatedQual = await CertificateService.changeStatus(callerRole, id as string, status, reject_reason);

      return res.status(200).json({
        success: true,
        data: updatedQual,
        message: 'Certificate status updated successfully'
      });
    } catch (error) {
      const err = error as Error;
      if (err.message && err.message.includes('not found')) {
        return res.status(404).json({ success: false, message: err.message });
      }
      if (err.message && err.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
  }

  static async deleteCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const callerRole = req.user.role as string;
      const callerId = req.user.id;
      const { id } = req.params;

      await CertificateService.removeCertificate(callerRole, callerId, id as string);

      return res.status(200).json({
        success: true,
        message: 'Certificate deleted successfully'
      });
    } catch (error) {
      const err = error as Error;
      if (err.message && err.message.includes('not found')) {
        return res.status(404).json({ success: false, message: err.message });
      }
      if (err.message && err.message.includes('Forbidden')) {
        return res.status(403).json({ success: false, message: err.message });
      }
      return res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
  }
}
