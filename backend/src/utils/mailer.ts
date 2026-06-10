import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Khởi tạo transporter sử dụng Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Mật khẩu ứng dụng (App Password)
  },
});

/**
 * Hàm gửi OTP xác nhận đặt lại mật khẩu
 * @param toEmail Email người nhận
 * @param otp Mã OTP 6 số
 */
export const sendOtpEmail = async (toEmail: string, otp: string) => {
  const mailOptions = {
    from: `"ICMS Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #007bff; text-align: center;">Password Reset</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your account. Below is your 6-digit OTP verification code:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #fff; background-color: #007bff; border-radius: 5px; letter-spacing: 5px;">
            ${otp}
          </span>
        </div>
        <p style="color: red; text-align: center;">This code will expire in 10 minutes.</p>
        <p>If you did not make this request, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">Best regards, <br />ICMS Management System</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email. Please check your config.');
  }
};
