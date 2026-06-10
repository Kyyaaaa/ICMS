import request from 'supertest';
import app from '../../../app';
import { AccountService } from '../account.service';
import { AuthService } from '../../auth/auth.service';

// Mock các middlewares
jest.mock('../../../middlewares/auth.middleware', () => ({
  verifyToken: (req: any, res: any, next: any) => {
    // Giả lập user đã đăng nhập
    req.user = { id: '123e4567-e89b-12d3-a456-426614174000', role: 'ADMIN' };
    next();
  },
  requireRole: (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      next();
    };
  }
}));

// Mock Services
jest.mock('../account.service');
jest.mock('../../auth/auth.service');

const validUUID = '123e4567-e89b-12d3-a456-426614174000';
const otherUUID = '987fcdeb-51a2-43d7-9012-3456789abcde';

describe('AccountController API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/accounts', () => {
    it('should return a list of accounts successfully', async () => {
      const mockAccounts = { data: [], meta: { total: 0 } };
      (AccountService.listAccounts as jest.Mock).mockResolvedValue(mockAccounts);

      const response = await request(app).get('/api/accounts?page=1&limit=10&role=LEARNER');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(AccountService.listAccounts).toHaveBeenCalledWith('ADMIN', 'LEARNER', undefined, 1, 10);
    });

    it('should return 400 for invalid role', async () => {
      const response = await request(app).get('/api/accounts?role=INVALID');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid role filter');
    });

    it('should return 400 for invalid page', async () => {
      const response = await request(app).get('/api/accounts?page=-1');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid page number');
    });

    it('should return 400 for invalid limit', async () => {
      const response = await request(app).get('/api/accounts?limit=200');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid limit number');
    });
  });

  describe('GET /api/accounts/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      const response = await request(app).get('/api/accounts/invalid-id');
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid account ID format');
    });

    it('should return account details for valid UUID', async () => {
      const mockAccount = { id: validUUID, email: 'test@test.com' };
      (AccountService.getAccount as jest.Mock).mockResolvedValue(mockAccount);

      const response = await request(app).get(`/api/accounts/${validUUID}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(AccountService.getAccount).toHaveBeenCalledWith('ADMIN', validUUID, validUUID);
    });

    it('should return 403 if forbidden error is thrown', async () => {
      (AccountService.getAccount as jest.Mock).mockRejectedValue(new Error('Forbidden: Not allowed'));

      const response = await request(app).get(`/api/accounts/${validUUID}`);
      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/accounts', () => {
    const validPayload = {
      email: 'new@test.com',
      password: 'Password@123',
      role: 'LEARNER',
      full_name: 'New User'
    };

    it('should return 400 if missing required fields', async () => {
      const response = await request(app).post('/api/accounts').send({ email: 'new@test.com' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app).post('/api/accounts').send({ ...validPayload, email: 'invalid' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 for invalid password format', async () => {
      const response = await request(app).post('/api/accounts').send({ ...validPayload, password: 'weak' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password must be');
    });

    it('should return 400 for invalid role', async () => {
      const response = await request(app).post('/api/accounts').send({ ...validPayload, role: 'UNKNOWN' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid role');
    });

    it('should return 400 for invalid full name', async () => {
      const response = await request(app).post('/api/accounts').send({ ...validPayload, full_name: 'A' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid full name');
    });

    it('should create account successfully', async () => {
      (AccountService.createAccount as jest.Mock).mockResolvedValue({ id: validUUID });

      const response = await request(app).post('/api/accounts').send(validPayload);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('PATCH /api/accounts/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      const response = await request(app).patch('/api/accounts/invalid').send({});
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid account ID format');
    });

    it('should return 400 for invalid phone number', async () => {
      const response = await request(app).patch(`/api/accounts/${validUUID}`).send({ phone_number: '999' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid phone number');
    });

    it('should return 400 for invalid date_of_birth', async () => {
      const response = await request(app).patch(`/api/accounts/${validUUID}`).send({ date_of_birth: 'invalid-date' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid date_of_birth');
    });

    it('should return 400 for invalid gender', async () => {
      const response = await request(app).patch(`/api/accounts/${validUUID}`).send({ gender: 'ALIEN' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid gender');
    });

    it('should return 400 for invalid avatar_url', async () => {
      const response = await request(app).patch(`/api/accounts/${validUUID}`).send({ avatar_url: 'not-a-link' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid avatar_url');
    });

    it('should require old password when changing own password', async () => {
      const response = await request(app).patch(`/api/accounts/${validUUID}`).send({ password: 'NewPassword@123' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Please enter your current password to confirm');
    });

    it('should update successfully when fields are valid', async () => {
      (AccountService.updateAccount as jest.Mock).mockResolvedValue({ id: validUUID, full_name: 'Valid Name' });

      const response = await request(app).patch(`/api/accounts/${validUUID}`).send({ full_name: 'Valid Name' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('PATCH /api/accounts/:id/status', () => {
    it('should return 400 for invalid UUID', async () => {
      const response = await request(app).patch('/api/accounts/invalid/status').send({ status: 'BANNED' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid account ID format');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app).patch(`/api/accounts/${validUUID}/status`).send({ status: 'UNKNOWN' });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing or invalid required field');
    });

    it('should update status successfully', async () => {
      (AccountService.setAccountStatus as jest.Mock).mockResolvedValue({ id: validUUID, status: 'BANNED' });

      const response = await request(app).patch(`/api/accounts/${validUUID}/status`).send({ status: 'BANNED' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
