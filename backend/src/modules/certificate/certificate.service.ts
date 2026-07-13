import { CertificateRepository } from './certificate.repository';
import type { Certificate,UpdateCertificateInput } from './certificate.model';

export class CertificateService {
  static async listCertificates(callerRole: string, callerId: string, tutorId: string) {
    // Access control:
    // Tutors can only see their own Certificates.
    // Admin and Staff can see anyone's.
    // Learners might need to see them if they are public on the tutor's profile,
    // but for now, let's assume this endpoint is for the tutor dashboard or admin panel.
    if (callerRole === 'TUTOR' && callerId !== tutorId) {
      throw new Error('Forbidden: You can only view your own Certificates.');
    }
    
    // Note: If learners need to view verified Certificates, we would add logic here:
    // if (callerRole === 'LEARNER') return Certificates.filter(q => q.status === 'Verified');

    return await CertificateRepository.findAllByTutorId(tutorId);
  }

  static async getAllCertificates(callerRole: string, status?: string) {
    if (callerRole !== 'ADMIN' && callerRole !== 'STAFF') {
      throw new Error('Forbidden: Only admins or staff can view all Certificates.');
    }

    return await CertificateRepository.findAllWithTutorInfo(status);
  }

  static async getCertificate(callerRole: string, callerId: string, CertificateId: string) {
    const qual = await CertificateRepository.findById(CertificateId);
    
    if (!qual) {
      throw new Error('Certificate not found');
    }

    if (callerRole === 'TUTOR' && callerId !== qual.tutor_id) {
      throw new Error('Forbidden: You can only access your own Certificate');
    }

    return qual;
  }

  static async addCertificate(
    tutorId: string, 
    name: string, 
    issuer: string, 
    issue_date: string, 
    expiration_date: string | null, 
    file_url: string
  ) {
    const CertificateData: Omit<Certificate, 'id' | 'created_at' | 'updated_at'> = {
      tutor_id: tutorId,
      name,
      issuer,
      issue_date,
      expiration_date: expiration_date || null,
      status: 'Pending Verification',
      file_url,
      rejection_reason: null
    };

    return await CertificateRepository.create(CertificateData);
  }

  static async editCertificate(
    callerRole: string,
    callerId: string,
    CertificateId: string,
    updateData: UpdateCertificateInput
  ) {
    // 1. Verify existence and ownership
    const existingQual = await CertificateRepository.findById(CertificateId);
    if (!existingQual) {
      throw new Error('Certificate not found');
    }

    if (callerRole === 'TUTOR' && callerId !== existingQual.tutor_id) {
      throw new Error('Forbidden: You can only edit your own Certificate');
    }

    // 2. Build the update payload
    const payload: Partial<Certificate> = {};
    if (updateData.name !== undefined) payload.name = updateData.name;
    if (updateData.issuer !== undefined) payload.issuer = updateData.issuer;
    if (updateData.issue_date !== undefined) payload.issue_date = updateData.issue_date;
    if (updateData.expiration_date !== undefined) payload.expiration_date = updateData.expiration_date;
    if (updateData.file_url !== undefined) payload.file_url = updateData.file_url;

    // 3. Any edit resets status to 'Pending Verification' unless done by an Admin/Staff
    if (callerRole === 'TUTOR') {
      payload.status = 'Pending Verification';
      payload.rejection_reason = null;
      payload.created_at = new Date().toISOString(); // Reset submission time to bump to top
    }

    payload.updated_at = new Date().toISOString();

    return await CertificateRepository.updateById(CertificateId, payload);
  }

  static async changeStatus(callerRole: string, CertificateId: string, status: 'Pending Verification' | 'Verified' | 'Rejected', reject_reason?: string) {
    if (callerRole !== 'ADMIN' && callerRole !== 'STAFF') {
      throw new Error('Forbidden: Only admins or staff can verify Certificates.');
    }

    const payload: Partial<Certificate> = {
      status, rejection_reason: reject_reason || null,
      updated_at: new Date().toISOString()
    };

    return await CertificateRepository.updateById(CertificateId, payload);
  }

  static async removeCertificate(callerRole: string, callerId: string, CertificateId: string) {
    const existingQual = await CertificateRepository.findById(CertificateId);
    
    if (!existingQual) {
      throw new Error('Certificate not found');
    }

    if (callerRole === 'TUTOR' && callerId !== existingQual.tutor_id) {
      throw new Error('Forbidden: You can only delete your own Certificate');
    }

    return await CertificateRepository.deleteById(CertificateId);
  }
}
