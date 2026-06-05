import request from 'supertest';
import app from '../app';
import { AuthService } from '../modules/auth/auth.service';

// Mock toàn bộ AuthService để các test không thực sự gọi lên Supabase (tiết kiệm thời gian và tránh tạo rác DB)
jest.mock('../modules/auth/auth.service');

describe('Auth Controller - POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Nhóm 1: Test validation (Dữ liệu đầu vào sai)
  describe('Validation Error Handling', () => {
    it('should return 400 if missing required fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        // Cố tình thiếu password và full_name
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Please provide email, password and full_name');
    });

    it('should return 400 if missing required fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: '123123123@As',
        // Cố tình thiếu full_name
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Please provide email, password and full_name');
    });

    it('should return 400 if missing required fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        full_name: 'Hoang Pham Minh'
        // Cố tình thiếu password
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Please provide email, password and full_name');
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'invalid-email',
        password: 'Password123!',
        full_name: 'John Doe'
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid email format');
    });

    it('should return 400 if password does not meet requirements', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'weak', // quá ngắn, không có chữ hoa, không số, không ký tự đặc biệt
        full_name: 'John Doe'
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Password must be 8-15 characters long');
    });

    it('should return 400 if phone_number is provided but invalid', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password123!',
        full_name: 'John Doe',
        phone_number: '12345' // Không hợp lệ
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid phone_number');
    });
  });

  // Nhóm 2: Test Luồng thành công (Happy Paths)
  describe('Successful Registration', () => {
    it('should return 201 if all fields are valid', async () => {
      // Giả lập AuthService.registerLearner trả về thành công
      (AuthService.registerLearner as jest.Mock).mockResolvedValue({
        user: { id: 'mock-uuid', email: 'test@example.com' }
      });

      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password123!',
        full_name: 'John Doe',
        phone_number: '0987654321'
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
      // Đảm bảo hàm service đã được gọi với đúng tham số
      expect(AuthService.registerLearner).toHaveBeenCalledWith(
        'test@example.com', 'Password123!', 'John Doe', '0987654321'
      );
    });

    it('should return 201 if phone_number is not provided (should pass null to service)', async () => {
      (AuthService.registerLearner as jest.Mock).mockResolvedValue({
        user: { id: 'mock-uuid', email: 'test@example.com' }
      });

      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password123!',
        full_name: 'John Doe'
      });

      expect(res.status).toBe(201);
      // Đảm bảo tham số phone_number là null khi gọi service (Fix lỗi Unique rỗng)
      expect(AuthService.registerLearner).toHaveBeenCalledWith(
        'test@example.com', 'Password123!', 'John Doe', null
      );
    });
  });

  // Nhóm 3: Test lỗi từ Database / Supabase ném ra
  describe('Service/Supabase Errors', () => {
    it('should return 400 if user already exists (Supabase throws error)', async () => {
      // Giả lập AuthService ném lỗi trùng lặp (giống khi gọi supabaseAdmin ném lỗi)
      (AuthService.registerLearner as jest.Mock).mockRejectedValue(new Error('User already exists'));

      const res = await request(app).post('/api/auth/register').send({
        email: 'duplicate@example.com',
        password: 'Password123!',
        full_name: 'John Doe'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User already exists');
    });
  });
});

describe('Auth Controller - POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation Error Handling', () => {
    it('should return 400 if missing password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com' // Thiếu password
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Please provide email and password');
    });

    it('should return 400 if missing email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        password: "123123123@As"
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Please provide email and password');
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'invalid-email',
        password: 'Password123!'
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email format');
    });
  });

  describe('Successful Login', () => {
    it('should return 200 and auth tokens if credentials are correct', async () => {
      // Giả lập login thành công
      (AuthService.login as jest.Mock).mockResolvedValue({
        session: { access_token: 'mock-access', refresh_token: 'mock-refresh' },
        user: {
          id: 'mock-uuid',
          email: 'test@example.com',
          user_metadata: { role: 'LEARNER', full_name: 'John Doe' }
        }
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'Password123!'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.access_token).toBe('mock-access');
      expect(res.body.data.user.id).toBe('mock-uuid');
      expect(res.body.data.user.role).toBe('LEARNER');

      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'Password123!');
    });
  });

  describe('Login Errors', () => {
    it('should return 401 if wrong credentials', async () => {
      // Giả lập AuthService báo lỗi Invalid login credentials
      (AuthService.login as jest.Mock).mockRejectedValue(new Error('Invalid login credentials'));

      const res = await request(app).post('/api/auth/login').send({
        email: 'wrong@example.com',
        password: 'WrongPassword'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid login credentials');
    });
  });
});

describe('Auth Controller - POST /api/auth/forgot-password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide email');
  });

  it('should return 400 if email is not found in our system', async () => {
    (AuthService.forgotPassword as jest.Mock).mockRejectedValue(new Error('Email not found in our system'));
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'unknown@example.com' });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email not found in our system');
  });

  it('should return 200 and send OTP if email is provided', async () => {
    (AuthService.forgotPassword as jest.Mock).mockResolvedValue({});
    const res = await request(app).post('/api/auth/forgot-password').send({ email: 'test@example.com' });
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('OTP has been sent to your email');
    expect(AuthService.forgotPassword).toHaveBeenCalledWith('test@example.com');
  });
});

describe('Auth Controller - POST /api/auth/verify-otp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or otp is missing', async () => {
    const res = await request(app).post('/api/auth/verify-otp').send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide email and otp');
  });

  it('should return 400 if otp is not 6 digits', async () => {
    const res = await request(app).post('/api/auth/verify-otp').send({ email: 'test@example.com', otp: '123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('OTP must be 6 digits');
  });

  it('should return 200 and reset_token if otp is valid', async () => {
    (AuthService.verifyOtp as jest.Mock).mockResolvedValue({
      reset_token: 'valid-reset-token'
    });
    const res = await request(app).post('/api/auth/verify-otp').send({ email: 'test@example.com', otp: '123456' });
    
    expect(res.status).toBe(200);
    expect(res.body.data.reset_token).toBe('valid-reset-token');
    expect(AuthService.verifyOtp).toHaveBeenCalledWith('test@example.com', '123456');
  });
});

describe('Auth Controller - POST /api/auth/reset-password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if reset_token or new_password is missing', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({ reset_token: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide reset_token and new_password');
  });

  it('should return 400 if new_password does not meet requirements', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      reset_token: 'valid-token',
      new_password: 'weak'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Password must be 8-15 characters long');
  });

  it('should return 200 if password reset is successful', async () => {
    (AuthService.resetPassword as jest.Mock).mockResolvedValue({});
    const res = await request(app).post('/api/auth/reset-password').send({
      reset_token: 'valid-token',
      new_password: 'Password123!'
    });
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password reset successfully');
    expect(AuthService.resetPassword).toHaveBeenCalledWith('valid-token', 'Password123!');
  });
});
