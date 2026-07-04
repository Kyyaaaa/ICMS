import request from 'supertest';
import app from '../../../app';
import { ConsultationRequestService } from '../consultation-request.service';
import { supabase } from '../../../configs/supabase';
import { } from '@supabase/supabase-js';

// Mock dependencies
jest.mock('../consultation-request.service');
jest.mock('../../../configs/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
  supabaseAdmin: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

describe('ConsultationRequestController API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('QA-17: POST /api/consultations', () => {
    it('should return 400 if missing mandatory fields', async () => {
      const err: any = new Error('Missing required fields: guest_name, guest_phone, inquiry_details');
      err.status = 400;
      (ConsultationRequestService.createRequest as jest.Mock).mockRejectedValueOnce(err);

      const response = await request(app)
        .post('/api/consultations')
        .send({
          guest_name: 'Nguyễn Văn B',
          // missing guest_phone
          inquiry_details: 'Tư vấn NodeJS'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should return 201 when all required fields are provided', async () => {
      (ConsultationRequestService.createRequest as jest.Mock).mockResolvedValue({
        id: '123',
        guest_name: 'Nguyễn Văn A',
        guest_phone: '0987654321',
        inquiry_details: 'Tư vấn ReactJS',
        status: 'Pending'
      });

      const response = await request(app)
        .post('/api/consultations')
        .send({
          guest_name: 'Nguyễn Văn A',
          guest_phone: '0987654321',
          inquiry_details: 'Tư vấn ReactJS'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('123');
    });
  });

  describe('QA-18: GET /api/staff/consultations', () => {
    it('should return 403 Forbidden if Learner tries to access Staff API', async () => {
      // Mock verifyToken to succeed
      const mockAuthUser = { id: 'learner-id', email: 'learner@example.com' };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockAuthUser },
        error: null,
      });

      // Mock User role as LEARNER
      const { supabaseAdmin } = require('../../../configs/supabase');
      (supabaseAdmin.single as jest.Mock).mockResolvedValue({
        data: { id: 'learner-id', status: 'ACTIVE', roles: { name: 'LEARNER' } },
        error: null,
      });

      const response = await request(app)
        .get('/api/consultations/staff')
        .set('Authorization', 'Bearer dummy-token');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Forbidden');
    });
  });

  describe('QA-19: PATCH /api/staff/consultations/:id', () => {
    it('should return 409 Conflict if request is handled by another staff', async () => {
      // Mock verifyToken to succeed as Staff
      const mockAuthUser = { id: 'staff-2-id', email: 'staff2@example.com' };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockAuthUser },
        error: null,
      });

      // Mock User role as STAFF
      const { supabaseAdmin } = require('../../../configs/supabase');
      (supabaseAdmin.single as jest.Mock).mockResolvedValue({
        data: { id: 'staff-2-id', status: 'ACTIVE', roles: { name: 'STAFF' } },
        error: null,
      });

      // Mock the service to throw a 409 conflict error
      const conflictError: any = new Error('Conflict: Request handled by another staff');
      conflictError.status = 409;
      (ConsultationRequestService.updateRequest as jest.Mock).mockRejectedValue(conflictError);

      const response = await request(app)
        .patch('/api/consultations/staff/f47ac10b-58cc-4372-a567-0e02b2c3d479')
        .set('Authorization', 'Bearer dummy-token')
        .send({
          status: 'Contacted',
          call_notes: 'Update notes'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Conflict: Request handled by another staff');
    });
  });
});
