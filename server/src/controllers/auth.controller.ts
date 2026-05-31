import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const body = req.body || {};
      const { email, password, full_name, phone_number } = body;

      // Validate input cơ bản
      if (!email || !password || !full_name) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide email, password and full_name' 
        });
      }

      // Gọi service xử lý đăng ký
      const result = await AuthService.registerLearner(email, password, full_name, phone_number || '');

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: result.user
      });
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'An error occurred during registration'
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const body = req.body || {};
      const { email, password } = body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      const result = await AuthService.login(email, password);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          access_token: result.session?.access_token,
          refresh_token: result.session?.refresh_token,
          user: {
            id: result.user.id,
            email: result.user.email,
            role: result.user.user_metadata?.role,
            full_name: result.user.user_metadata?.full_name,
          }
        }
      });
    } catch (error: any) {
      console.error('Lỗi khi đăng nhập:', error);
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid email or password'
      });
    }
  }
}
