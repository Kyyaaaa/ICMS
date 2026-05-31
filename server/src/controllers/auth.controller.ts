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
          message: 'Vui lòng cung cấp đầy đủ email, password và full_name' 
        });
      }

      // Gọi service xử lý đăng ký
      const result = await AuthService.registerLearner(email, password, full_name, phone_number || '');

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công',
        data: result.user
      });
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi đăng ký tài khoản'
      });
    }
  }
}
