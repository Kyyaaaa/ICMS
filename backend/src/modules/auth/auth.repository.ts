import { supabase, supabaseAdmin } from "../../configs/supabase";
import { UserMetadata } from "./auth.model";

export class AuthRepository {
  /**
   * Tạo user mới trên Supabase Auth
   */
  static async createUser(
    email: string,
    password: string,
    metadata: UserMetadata,
  ) {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata,
      });

    if (authError) throw authError;

    // Fetch the account that was auto-created by the DB trigger
    const { data: accountData, error: accountError } = await supabaseAdmin
      .from("account")
      .select("*, roles(name)")
      .eq("id", authData.user.id)
      .single();

    if (accountError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw accountError;
    }

    // Map role name for backward compatibility
    if (accountData.roles && (accountData.roles as any).name) {
      accountData.role = (accountData.roles as any).name;
    }

    return { user: accountData };
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
   * Khởi tạo luồng đăng nhập Google bằng OAuth
   */
  static async signInWithGoogle(redirectTo: string) {
    return await supabaseAdmin.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    });
  }

  /**
   * Xin cấp lại Access Token bằng Refresh Token
   */
  static async refreshSession(refreshToken: string) {
    return await supabase.auth.refreshSession({ refresh_token: refreshToken });
  }

  /**
   * Lấy thông tin User từ Access Token (dùng cho Google Sync)
   */
  static async getUserByToken(accessToken: string) {
    return await supabase.auth.getUser(accessToken);
  }

  /**
   * Tìm account theo email
   */
  static async getAccountByEmail(email: string) {
    return await supabaseAdmin
      .from("account")
      .select("*, roles(name)")
      .eq("email", email)
      .maybeSingle();
  }

  /**
   * Vô hiệu hóa tất cả các OTP cũ chưa sử dụng của user
   */
  static async invalidateOldOtps(email: string) {
    return await supabaseAdmin
      .from("otps")
      .update({ is_used: true })
      .eq("email", email)
      .eq("is_used", false);
  }

  /**
   * Lưu mã OTP vào database
   */
  static async insertOtp(email: string, otp: string, expiresAt: string) {
    return await supabaseAdmin.from("otps").insert({
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
      .from("otps")
      .select("id")
      .eq("email", email)
      .eq("otp", otp)
      .eq("is_used", false)
      .gte("expires_at", currentTime)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
  }

  /**
   * Đánh dấu OTP đã sử dụng và gán reset token
   */
  static async markOtpAsUsed(id: string, resetToken: string) {
    return await supabaseAdmin
      .from("otps")
      .update({
        is_used: true,
        reset_token: resetToken,
      })
      .eq("id", id);
  }

  /**
   * Lấy thông tin OTP dựa trên reset token
   */
  static async getOtpByResetToken(resetToken: string) {
    return await supabaseAdmin
      .from("otps")
      .select("id, email, expires_at")
      .eq("reset_token", resetToken)
      .maybeSingle();
  }

  /**
   * Cập nhật mật khẩu mới cho user trên Supabase Auth
   */
  static async updateUserPassword(userId: string, newPassword: string) {
    return await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
  }

  /**
   * Xóa reset token sau khi đã đổi mật khẩu thành công
   */
  static async clearResetToken(id: string) {
    return await supabaseAdmin
      .from("otps")
      .update({ reset_token: null })
      .eq("id", id);
  }

  /**
   * Đồng bộ tài khoản Google vào bảng account (Chiến lược Merge)
   */
  static async syncGoogleAccount(
    userId: string,
    email: string,
    fullName: string,
    avatarUrl: string,
  ) {
    const { data: existingAcc } = await supabaseAdmin
      .from("account")
      .select("*, roles(name)")
      .eq("email", email)
      .maybeSingle();

    if (existingAcc) {
      const updateData: any = {
        avatar_url: avatarUrl || existingAcc.avatar_url,
      };

      if (!existingAcc.role_id) {
        const { data: roleData } = await supabaseAdmin
          .from("roles")
          .select("id")
          .eq("name", "LEARNER")
          .single();
        
        if (roleData) {
          updateData.role_id = roleData.id;
        }
      }

      // Merge account: update avatar (and role if missing)
      await supabaseAdmin
        .from("account")
        .update(updateData)
        .eq("id", existingAcc.id);

      // Re-fetch with roles join
      return await supabaseAdmin
        .from("account")
        .select("*, roles(name)")
        .eq("id", existingAcc.id)
        .single();
    } else {
      // Look up LEARNER role_id
      const { data: roleData } = await supabaseAdmin
        .from("roles")
        .select("id")
        .eq("name", "LEARNER")
        .single();

      // Nếu chưa có, tạo mới
      const { data, error } = await supabaseAdmin
        .from("account")
        .insert({
          id: userId,
          email: email,
          full_name: fullName,
          avatar_url: avatarUrl,
          role_id: roleData?.id,
        })
        .select("*, roles(name)")
        .single();

      return { data, error };
    }
  }
}
