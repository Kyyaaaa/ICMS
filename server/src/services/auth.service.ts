import { supabase } from '../config/supabase';

export class AuthService {
  /**
   * Đăng ký tài khoản Learner mới
   * @param email Email đăng ký
   * @param password Mật khẩu
   * @param fullName Họ và tên
   * @param phoneNumber Số điện thoại
   */
  static async registerLearner(email: string, password: string, fullName: string, phoneNumber: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
          role: 'LEARNER' // Trigger DB sẽ đọc role này để lưu
        }
      }
    });

    if (error) {
      throw error;
    }

    return data;
  }
}
