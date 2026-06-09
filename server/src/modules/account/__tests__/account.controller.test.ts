import request from 'supertest';
import app from '../../../app';
import { AccountService } from '../account.service';

// Mock các middlewares
jest.mock('../../../middlewares/auth.middleware', () => ({
  verifyToken: (req: any, res: any, next: any) => {
    // Giả lập user đã đăng nhập
    req.user = { id: 'user-id-123', role: 'ADMIN' };
    next();
  },
  requireRole: (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      // Giả lập pass quyền
      next();
    };
  }
}));

// Mock AccountService
jest.mock('../account.service');

describe('AccountController API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/accounts', () => {
    it('should return a list of accounts', async () => {
      const mockAccounts = {
        data: [{ id: '1', email: 'test@test.com' }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
      };

      (AccountService.listAccounts as jest.Mock).mockResolvedValue(mockAccounts);

      const response = await request(app).get('/api/accounts');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockAccounts);
      expect(AccountService.listAccounts).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      (AccountService.listAccounts as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await request(app).get('/api/accounts');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('DB Error');
    });
  });

  describe('GET /api/accounts/:id', () => {
    it('should return a specific account', async () => {
      const mockAccount = { id: '1', email: 'test@test.com' };
      (AccountService.getAccount as jest.Mock).mockResolvedValue(mockAccount);

      const response = await request(app).get('/api/accounts/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockAccount);
      expect(AccountService.getAccount).toHaveBeenCalled();
    });
  });

  describe('POST /api/accounts', () => {
    it('should create a new account', async () => {
      const mockResult = { id: '1', email: 'new@test.com' };
      (AccountService.createAccount as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/accounts')
        .send({
          email: 'new@test.com',
          password: 'Password@123',
          role: 'LEARNER',
          full_name: 'New User'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('PATCH /api/accounts/:id', () => {
    it('should update an account', async () => {
      const mockResult = { id: '1', full_name: 'Updated Name' };
      (AccountService.updateAccount as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .patch('/api/accounts/1')
        .send({ full_name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult);
    });
  });

  describe('PATCH /api/accounts/:id/status', () => {
    it('should update account status', async () => {
      const mockResult = { id: '1', status: 'BANNED' };
      (AccountService.setAccountStatus as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .patch('/api/accounts/1/status')
        .send({ status: 'BANNED' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
