import { supabase, supabaseAdmin } from '../../configs/supabase';
import { sendOtpEmail } from '../../utils/mailer';
import crypto from 'crypto';

export class AuthService {
  /**
   * Đăng ký tài khoản Learner mới
   * @param email Email đăng ký
   * @param password Mật khẩu
   * @param fullName Họ và tên
   * @param phoneNumber Số điện thoại
   */
  static async registerLearner(email: string, password: string, fullName: string, phoneNumber: string | null) {

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone_number: phoneNumber,
        role: 'LEARNER' // Trigger DB sẽ đọc role này để lưu
      }
    });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Đăng nhập
   * @param email Email đăng nhập
   * @param password Mật khẩu
   */
  static async login(email: string, password: string) {
    // Gọi Supabase xác thực mật khẩu
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // (Tuỳ chọn) Bạn có thể truy vấn thêm thông tin từ public.account
    // const { data: accountData } = await supabase
    //   .from('account')
    //   .select('role, status')
    //   .eq('id', data.user.id)
    //   .single();

    return {
      session: data.session,
      user: data.user,
      // account: accountData
    };
  }

  /**
   * Gửi OTP Quên mật khẩu
   * @param email Email của user
   */
  static async forgotPassword(email: string) {
    // 1. Kiểm tra email có tồn tại trong hệ thống không (từ bảng account)
    const { data: userAccount, error: checkError } = await supabaseAdmin
      .from('account')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (!userAccount) {
      throw new Error('Email not found in our system');
    }

    // 2. Tạo mã OTP 6 số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 phút

    // 3. Lưu OTP vào bảng otps
    const { error: insertError } = await supabaseAdmin
      .from('otps')
      .insert({
        email,
        otp,
        expires_at: expiresAt,
      });

    if (insertError) {
      throw insertError;
    }

    // 4. Gửi email qua Nodemailer
    await sendOtpEmail(email, otp);

    return { message: 'OTP sent' };
  }

  /**
   * Xác thực mã OTP
   * @param email Email của user
   * @param otp Mã OTP 6 số
   */
  static async verifyOtp(email: string, otp: string) {
    // 1. Tìm OTP chưa sử dụng, chưa hết hạn
    const { data, error } = await supabaseAdmin
      .from('otps')
      .select('id')
      .eq('email', email)
      .eq('otp', otp)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Invalid or expired OTP');
    }

    // 2. Tạo reset_token và đánh dấu OTP đã sử dụng
    const resetToken = crypto.randomUUID();
    
    const { error: updateError } = await supabaseAdmin
      .from('otps')
      .update({
        is_used: true,
        reset_token: resetToken
      })
      .eq('id', data.id);

    if (updateError) {
      throw updateError;
    }

    return { reset_token: resetToken };
  }

  /**
   * Cập nhật mật khẩu mới sử dụng reset_token
   * @param resetToken Token trả về từ verifyOtp
   * @param newPassword Mật khẩu mới
   */
  static async resetPassword(resetToken: string, newPassword: string) {
    // 1. Tìm token
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from('otps')
      .select('id, email, expires_at')
      .eq('reset_token', resetToken)
      .maybeSingle();

    if (otpError) {
      throw otpError;
    }

    if (!otpData) {
      throw new Error('Invalid reset token');
    }

    // 2. Tìm user ID dựa vào email
    const { data: userAccount, error: accountError } = await supabaseAdmin
      .from('account')
      .select('id')
      .eq('email', otpData.email)
      .maybeSingle();

    if (accountError || !userAccount) {
      throw new Error('User not found');
    }

    const userId = userAccount.id;

    // 3. Sử dụng quyền Admin để cập nhật mật khẩu của user
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (error) {
      throw error;
    }

    // 4. Xóa reset_token để không dùng lại được
    await supabaseAdmin
      .from('otps')
      .update({ reset_token: null })
      .eq('id', otpData.id);

    return data;
  }
}
