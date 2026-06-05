import { supabase, supabaseAdmin } from '../../configs/supabase';
import { UserMetadata } from './auth.model';

export class AuthRepository {
  /**
   * Tạo user mới trên Supabase Auth
   */
  static async createUser(email: string, password: string, metadata: UserMetadata) {
    return await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata
    });
  }

  /**
   * Đăng nhập bằng email và password
   */
  static async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  /**
   * Tìm account ID theo email
   */
  static async getAccountByEmail(email: string) {
    return await supabaseAdmin
      .from('account')
      .select('id')
      .eq('email', email)
      .maybeSingle();
  }

  /**
   * Lưu mã OTP vào database
   */
  static async insertOtp(email: string, otp: string, expiresAt: string) {
    return await supabaseAdmin
      .from('otps')
      .insert({
        email,
        otp,
        expires_at: expiresAt,
      });
  }

  /**
   * Lấy mã OTP hợp lệ chưa sử dụng
   */
  static async getValidOtp(email: string, otp: string, currentTime: string) {
    return await supabaseAdmin
      .from('otps')
      .select('id')
      .eq('email', email)
      .eq('otp', otp)
      .eq('is_used', false)
      .gte('expires_at', currentTime)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
  }

  /**
   * Đánh dấu OTP đã sử dụng và gán reset token
   */
  static async markOtpAsUsed(id: string, resetToken: string) {
    return await supabaseAdmin
      .from('otps')
      .update({
        is_used: true,
        reset_token: resetToken
      })
      .eq('id', id);
  }

  /**
   * Lấy thông tin OTP dựa trên reset token
   */
  static async getOtpByResetToken(resetToken: string) {
    return await supabaseAdmin
      .from('otps')
      .select('id, email, expires_at')
      .eq('reset_token', resetToken)
      .maybeSingle();
  }

  /**
   * Cập nhật mật khẩu mới cho user trên Supabase Auth
   */
  static async updateUserPassword(userId: string, newPassword: string) {
    return await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });
  }

  /**
   * Xóa reset token sau khi đã đổi mật khẩu thành công
   */
  static async clearResetToken(id: string) {
    return await supabaseAdmin
      .from('otps')
      .update({ reset_token: null })
      .eq('id', id);
  }
}
