import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { validateEmail, validatePassword, validateFullName, validatePhoneNumber } from '../../utils/validators';
import { supabaseAdmin } from '../../configs/supabase';

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

      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message: 'Password must be 8-15 characters long, and include at least one lowercase letter, one uppercase letter, one number, and one special character'
        });
      }

      if (!validateFullName(full_name)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid full_name. Must be 2-50 characters and contain only letters and spaces'
        });
      }

      if (phone_number && !validatePhoneNumber(phone_number)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid phone_number. Must be a valid Vietnamese 10-digit phone number starting with 0'
        });
      }

      // Gọi service xử lý đăng ký
      const result = await AuthService.registerLearner(email, password, full_name, phone_number || null);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: result.user
      });
    } catch (error: any) {
      console.error('Error during registration:', error);
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

      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
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
            role: result.user.role,
            full_name: result.user.full_name,
            avatar_url: result.user.avatar_url,
          }
        }
      });
    } catch (error: any) {
      console.error('Error during login:', error);
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid email or password'
      });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Please provide email' });
      }

      await AuthService.forgotPassword(email);

      return res.status(200).json({
        success: true,
        message: 'OTP has been sent to your email'
      });
    } catch (error: any) {
      console.error('Error during forgotPassword:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to send OTP'
      });
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide email and otp' });
      }

      if (otp.length !== 6) {
        return res.status(400).json({ success: false, message: 'OTP must be 6 digits' });
      }

      const result = await AuthService.verifyOtp(email, otp);

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        data: {
          reset_token: result.reset_token
        }
      });
    } catch (error: any) {
      console.error('Error during verifyOtp:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Invalid OTP'
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { reset_token, new_password } = req.body;

      if (!reset_token || !new_password) {
        return res.status(400).json({ success: false, message: 'Please provide reset_token and new_password' });
      }

      // We can reuse the validatePassword function here if it's imported. Wait, I should import it.
      // I'll assume validatePassword is automatically accessible or I will import it if it's not. 
      // Let's use the same validatePassword as in register.
      if (!validatePassword(new_password)) {
        return res.status(400).json({
          success: false,
          message: 'Password must be 8-15 characters long, and include at least one lowercase letter, one uppercase letter, one number, and one special character'
        });
      }

      await AuthService.resetPassword(reset_token, new_password);

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error: any) {
      console.error('Error during resetPassword:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to reset password'
      });
    }
  }

  static async googleLogin(req: Request, res: Response) {
    try {
      const { data, error } = await supabaseAdmin.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Trỏ về trang auth-callback của Frontend React để hứng Token
          redirectTo: 'http://localhost:5173/auth/callback'
        }
      });

      if (error) throw error;
      
      // Chuyển hướng trình duyệt đến trang đăng nhập của Google
      if (data.url) {
        return res.redirect(data.url);
      } else {
        return res.status(400).json({ success: false, message: 'Could not generate Google Login URL' });
      }
    } catch (error: any) {
      console.error('Error generating Google OAuth URL:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Xử lý bước cuối cùng: Nhận Token từ Frontend, lưu DB và trả dữ liệu về Frontend
  static async syncGoogle(req: Request, res: Response) {
    try {
      const { access_token, refresh_token } = req.body;

      if (!access_token) {
        return res.status(400).json({ success: false, message: 'Missing access token' });
      }

      const result = await AuthService.syncGoogleUser(access_token);
      
      return res.status(200).json({
        success: true,
        message: 'Google login synced successfully',
        data: {
          access_token: access_token,
          refresh_token: refresh_token || null,
          user: {
            id: result.user.id,
            email: result.user.email,
            role: result.user.role,
            full_name: result.user.full_name,
            avatar_url: result.user.avatar_url
          }
        }
      });
    } catch (error: any) {
      console.error('Google Auth Sync Error:', error);
      return res.status(500).json({ success: false, message: 'Failed to sync Google user', error: error.message });
    }
  }
}
