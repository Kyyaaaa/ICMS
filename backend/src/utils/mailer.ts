import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Khởi tạo transporter sử dụng Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
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
    subject: "Password Reset Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 1px; }
          .content { padding: 40px 40px 20px; color: #374151; line-height: 1.6; }
          .content p { margin: 0 0 15px; font-size: 16px; }
          .otp-wrapper { background-color: #f8fafc; border: 2px dashed #93c5fd; border-radius: 10px; text-align: center; padding: 30px 20px; margin: 35px 0; }
          .otp-code { font-size: 42px; font-weight: 800; color: #1e3a8a; letter-spacing: 12px; margin: 0; font-family: monospace; }
          .otp-label { font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; font-weight: 600; }
          .warning { color: #dc2626; font-size: 14px; font-weight: 500; text-align: center; margin-top: 15px; display: block; }
          .divider { height: 1px; background-color: #e5e7eb; margin: 30px 0; }
          .footer { background-color: #f9fafb; padding: 25px 40px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ICMS</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset the password for your ICMS account. Please use the verification code below to securely change your password.</p>
            
            <div class="otp-wrapper">
              <div class="otp-label">Your Verification Code</div>
              <p class="otp-code">${otp}</p>
            </div>
            
            <div class="warning">
              This code is valid for 10 minutes.
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #6b7280;">If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from the ICMS. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} ICMS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email. Please check your config.");
  }
};
