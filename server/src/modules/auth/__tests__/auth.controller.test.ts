import request from 'supertest';
import app from '../../../app';
import { AuthService } from '../auth.service';

// Mock AuthService
jest.mock('../auth.service');

describe('AuthController API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockResult = { id: 'user-123', email: 'test@example.com' };
      (AuthService.registerLearner as jest.Mock).mockResolvedValue({ user: mockResult });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password@123',
          full_name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult);
      expect(AuthService.registerLearner).toHaveBeenCalled();
    });

    it('should return 400 if missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // missing password, full_name
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return tokens', async () => {
      const mockLoginResult = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        user: { id: 'user-123', email: 'test@example.com', role: 'LEARNER' }
      };
      
      (AuthService.login as jest.Mock).mockResolvedValue({
        session: { access_token: 'access-token', refresh_token: 'refresh-token' },
        user: mockLoginResult.user
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password@123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.access_token).toBeDefined();
      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'Password@123');
    });

    it('should return 401 for invalid credentials', async () => {
      (AuthService.login as jest.Mock).mockRejectedValue(new Error('Invalid login credentials'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send OTP to email', async () => {
      (AuthService.forgotPassword as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(AuthService.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('should verify OTP and return reset_token', async () => {
      (AuthService.verifyOtp as jest.Mock).mockResolvedValue({ reset_token: 'valid-reset-token' });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({
          email: 'test@example.com',
          otp: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.reset_token).toBe('valid-reset-token');
      expect(AuthService.verifyOtp).toHaveBeenCalledWith('test@example.com', '123456');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password successfully', async () => {
      (AuthService.resetPassword as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          reset_token: 'valid-reset-token',
          new_password: 'NewPassword@123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(AuthService.resetPassword).toHaveBeenCalledWith('valid-reset-token', 'NewPassword@123');
    });
  });

  describe('POST /api/auth/google-sync', () => {
    it('should sync google user', async () => {
      const mockUser = { id: 'user-123', email: 'google@example.com' };
      (AuthService.syncGoogleUser as jest.Mock).mockResolvedValue({ user: mockUser });

      const response = await request(app)
        .post('/api/auth/google-sync')
        .send({ access_token: 'google-access-token' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({
        access_token: 'google-access-token',
        refresh_token: null,
        user: mockUser
      });
    });
  });
});
