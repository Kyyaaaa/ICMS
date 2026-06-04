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
