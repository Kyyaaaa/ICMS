import { AuthRepository } from "./auth.repository";
import { UserMetadata } from "./auth.model";
import { sendOtpEmail } from "../../utils/mailer";
import crypto from "crypto";

export class AuthService {
  /**
   * Đăng ký tài khoản Learner mới
   * @param email Email đăng ký
   * @param password Mật khẩu
   * @param fullName Họ và tên
   * @param phoneNumber Số điện thoại
   */
  static async registerLearner(
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string | null,
  ) {
    // Đóng gói dữ liệu metadata
    const metadata: UserMetadata = {
      full_name: fullName,
      phone_number: phoneNumber,
      role: "LEARNER", // Trigger DB sẽ đọc role này để lưu
    };

    try {
      const _userAccount = await AuthRepository.getAccountByEmail(email);
    } catch (error) {
      throw new Error("Error checking existing email: " + error);
    }

    // Ra lệnh cho Repository gọi DB
    const result = await AuthRepository.createUser(email, password, metadata);

    return result;
  }

  /**
   * Đăng nhập
   * @param email Email đăng nhập
   * @param password Mật khẩu
   */
  static async login(email: string, password: string) {
    // 1. Lấy thông tin user từ DB nội bộ trước để kiểm tra trạng thái ban
    const { data: account, error: accError } =
      await AuthRepository.getAccountByEmail(email);

    if (!accError && account) {
      // Check ban status from internal DB
      if (account.status === "BANNED") {
        throw new Error(
          "This account has been banned. Please contact the administrator.",
        );
      }
    }

    // 2. Ra lệnh cho Repository xác thực
    const { data, error } = await AuthRepository.signIn(email, password);

    if (error) {
      throw error;
    }

    if (accError || !account) {
      throw new Error("User not found in internal database");
    }

    // Map role back to string for frontend compatibility
    if (account.roles && account.roles.name) {
      account.role = account.roles.name;
    }

    return {
      session: data.session,
      user: account,
    };
  }

  /**
   * Đổi token mới bằng refresh token
   * @param refreshToken Refresh token cũ
   */
  static async refreshToken(refreshToken: string) {
    const { data, error } = await AuthRepository.refreshSession(refreshToken);

    if (error || !data.session) {
      throw new Error("Refresh token invalid or expired. Please login again.");
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }

  /**
   * Gửi OTP Quên mật khẩu
   * @param email Email của user
   */
  static async forgotPassword(email: string) {
    // 1. Kiểm tra email có tồn tại không
    const { data: userAccount, error: checkError } =
      await AuthRepository.getAccountByEmail(email);

    if (checkError) throw checkError;
    if (!userAccount) {
      return { message: "If the email exists, an OTP has been sent" };
    }

    // 1.5. Vô hiệu hóa tất cả OTP cũ chưa sử dụng
    await AuthRepository.invalidateOldOtps(email);

    // 2. Tạo mã OTP 6 số ngẫu nhiên
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 phút

    // 3. Ra lệnh Repository lưu OTP
    const { error: insertError } = await AuthRepository.insertOtp(
      email,
      otpHash,
      expiresAt,
    );

    if (insertError) throw insertError;

    // 4. Gửi email qua Nodemailer
    await sendOtpEmail(email, otp);

    return { message: "OTP sent" };
  }

  /**
   * Xác thực mã OTP
   * @param email Email của user
   * @param otp Mã OTP 6 số
   */
  static async verifyOtp(email: string, otp: string) {
    // 1. Tìm OTP hợp lệ
    const currentTime = new Date().toISOString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const { data, error } = await AuthRepository.getValidOtp(
      email,
      otpHash,
      currentTime,
    );

    if (error) throw error;
    if (!data) {
      throw new Error("Invalid or expired OTP");
    }

    // 2. Tạo reset_token và đánh dấu OTP đã sử dụng
    const resetToken = crypto.randomUUID();
    const { error: updateError } = await AuthRepository.markOtpAsUsed(
      data.id,
      resetToken,
    );

    if (updateError) throw updateError;

    return { reset_token: resetToken };
  }

  /**
   * Cập nhật mật khẩu mới sử dụng reset_token
   * @param resetToken Token trả về từ verifyOtp
   * @param newPassword Mật khẩu mới
   */
  static async resetPassword(resetToken: string, newPassword: string) {
    // 1. Tìm token
    const { data: otpData, error: otpError } =
      await AuthRepository.getOtpByResetToken(resetToken);

    if (otpError) throw otpError;
    if (!otpData) {
      throw new Error("Invalid or expired reset token");
    }

    // 1.5. Kiểm tra mật khẩu mới có trùng với mật khẩu hiện tại không
    // Bằng cách thử đăng nhập với mật khẩu mới. Nếu thành công -> trùng pass cũ.
    const { data: signInData, error: signInError } =
      await AuthRepository.signIn(otpData.email, newPassword);
    if (!signInError && signInData?.session) {
      throw new Error(
        "New password cannot be the same as the current password",
      );
    }

    // 2. Tìm user ID
    const { data: userAccount, error: accountError } =
      await AuthRepository.getAccountByEmail(otpData.email);

    if (accountError || !userAccount) {
      throw new Error("User not found");
    }

    const { data: consumedToken, error: consumeError } =
      await AuthRepository.consumeResetToken(resetToken, new Date().toISOString());
    if (consumeError || !consumedToken) {
      throw new Error("Invalid or expired reset token");
    }

    // 3. Cập nhật mật khẩu
    const { data, error } = await AuthRepository.updateUserPassword(
      userAccount.id,
      newPassword,
    );

    if (error) {
      await AuthRepository.restoreResetToken(consumedToken.id, resetToken);
      throw error;
    }

    // 4. Xóa reset_token
    return data;
  }

  /**
   * Đồng bộ Google User và trả về chuẩn Token của hệ thống
   */
  static async syncGoogleUser(accessToken: string) {
    // 1. Lấy thông tin user từ token Supabase bằng cách gọi auth API
    const { data, error } = await AuthRepository.getUserByToken(accessToken);
    if (error || !data?.user) {
      throw new Error("Invalid or expired Google access token");
    }

    const user = data.user;
    const email = user.email || "";
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Google User";
    const avatarUrl =
      user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

    // 2. Đồng bộ vào DB nội bộ (Merge hoặc Tạo mới)
    const { data: account, error: syncError } =
      await AuthRepository.syncGoogleAccount(
        user.id,
        email,
        fullName,
        avatarUrl,
      );

    if (syncError) {
      throw syncError;
    }

    // Map role back to string for frontend compatibility
    if (account.roles && account.roles.name) {
      account.role = account.roles.name;
    }

    // 3. Trả về Account record chuẩn
    return {
      user: account,
    };
  }
  /**
   * Khởi tạo luồng đăng nhập Google bằng OAuth
   */
  static async getGoogleLoginUrl(redirectTo: string) {
    const { data, error } = await AuthRepository.signInWithGoogle(redirectTo);
    if (error) throw error;
    if (!data.url) throw new Error("Could not generate Google Login URL");
    return data.url;
  }
}
