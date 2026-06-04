import { supabase, supabaseAdmin } from '../../configs/supabase';

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
}
