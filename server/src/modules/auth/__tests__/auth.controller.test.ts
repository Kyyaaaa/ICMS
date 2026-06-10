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
    const validPayload = {
      email: 'test@example.com',
      password: 'Password@123',
      full_name: 'Test User'
    };

    it('should register a new user successfully', async () => {
      const mockResult = { id: 'user-123', email: 'test@example.com' };
      (AuthService.registerLearner as jest.Mock).mockResolvedValue({ user: mockResult });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockResult);
      expect(AuthService.registerLearner).toHaveBeenCalledWith(
        validPayload.email,
        validPayload.password,
        validPayload.full_name,
        null
      );
    });

    it('should return 400 if missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Please provide email, password and full_name');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validPayload, email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 for invalid password format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validPayload, password: 'weak' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password must be 8-15 characters long');
    });

    it('should return 400 for invalid full_name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validPayload, full_name: 'A' }); // Too short

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid full_name');
    });

    it('should return 400 for invalid phone_number', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validPayload, phone_number: '123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid phone_number');
    });

    it('should return 400 if business logic throws an error (e.g. User already exists)', async () => {
      (AuthService.registerLearner as jest.Mock).mockRejectedValue(new Error('User already exists'));

      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    const validLogin = { email: 'test@example.com', password: 'Password@123' };

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
        .send(validLogin);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.access_token).toBeDefined();
      expect(AuthService.login).toHaveBeenCalledWith(validLogin.email, validLogin.password);
    });

    it('should return 400 if missing email or password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Please provide email and password');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid-email', password: 'Password@123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 for invalid password format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'weak' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid password');
    });

    it('should return 401 for invalid credentials (business logic error)', async () => {
      (AuthService.login as jest.Mock).mockRejectedValue(new Error('Invalid login credentials'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'Password@123' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid login credentials');
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

    it('should return 400 if missing email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Please provide email');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 if email not found (business logic error)', async () => {
      (AuthService.forgotPassword as jest.Mock).mockRejectedValue(new Error('Email not found in our system'));

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email not found in our system');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    const validPayload = { email: 'test@example.com', otp: '123456' };

    it('should verify OTP and return reset_token', async () => {
      (AuthService.verifyOtp as jest.Mock).mockResolvedValue({ reset_token: 'valid-reset-token' });

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send(validPayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.reset_token).toBe('valid-reset-token');
      expect(AuthService.verifyOtp).toHaveBeenCalledWith(validPayload.email, validPayload.otp);
    });

    it('should return 400 if missing email or otp', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Please provide email and otp');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'invalid-email', otp: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 for invalid OTP format', async () => {
      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'test@example.com', otp: '123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid OTP. Must be 6 digits.');
    });

    it('should return 400 if OTP is incorrect or expired (business logic error)', async () => {
      (AuthService.verifyOtp as jest.Mock).mockRejectedValue(new Error('Invalid or expired OTP'));

      const response = await request(app)
        .post('/api/auth/verify-otp')
        .send(validPayload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid or expired OTP');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    const validPayload = { reset_token: '123e4567-e89b-12d3-a456-426614174000', new_password: 'NewPassword@123' };

    it('should reset password successfully', async () => {
      (AuthService.resetPassword as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(validPayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(AuthService.resetPassword).toHaveBeenCalledWith(validPayload.reset_token, validPayload.new_password);
    });

    it('should return 400 if missing reset_token or new_password', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ reset_token: '123e4567-e89b-12d3-a456-426614174000' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Please provide reset_token and new_password');
    });

    it('should return 400 for invalid reset_token format', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ reset_token: 'invalid-token', new_password: 'NewPassword@123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid reset_token format. Must be a valid UUID.');
    });

    it('should return 400 for invalid new_password format', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ reset_token: '123e4567-e89b-12d3-a456-426614174000', new_password: 'weak' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password must be 8-15 characters long');
    });

    it('should return 400 if reset_token is invalid (business logic error)', async () => {
      (AuthService.resetPassword as jest.Mock).mockRejectedValue(new Error('Invalid or expired reset token'));

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(validPayload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid or expired reset token');
    });
  });

  describe('POST /api/auth/google-sync', () => {
    it('should sync google user successfully', async () => {
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

    it('should return 400 if missing access_token', async () => {
      const response = await request(app)
        .post('/api/auth/google-sync')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing access token');
    });

    it('should return 500 if google sync fails (business logic error)', async () => {
      (AuthService.syncGoogleUser as jest.Mock).mockRejectedValue(new Error('Invalid Google Token'));

      const response = await request(app)
        .post('/api/auth/google-sync')
        .send({ access_token: 'invalid-google-token' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to sync Google user');
      expect(response.body.error).toBe('Invalid Google Token');
    });
  });
});
