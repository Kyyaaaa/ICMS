import { Request, Response, NextFunction } from 'express';
import { validateEmail, validatePassword, validateFullName, validatePhoneNumber, validateOtp, validateUUID } from '../../utils/validators';

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, full_name, phone_number } = req.body || {};

  if (!email || !password || !full_name) {
    return res.status(400).json({ success: false, message: 'Please provide email, password and full_name' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
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

  next();
};

export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid password. Must be 8-15 characters, including uppercase, lowercase, digit, and special character.'
    });
  }

  next();
};

export const validateRefreshTokenInput = (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body || {};

  if (!refresh_token) {
    return res.status(400).json({ success: false, message: 'Missing refresh_token' });
  }

  next();
};

export const validateForgotPasswordInput = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide email' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  next();
};

export const validateVerifyOtpInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Please provide email and otp' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!validateOtp(otp)) {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Must be 6 digits.' });
  }

  next();
};

export const validateResetPasswordInput = (req: Request, res: Response, next: NextFunction) => {
  const { reset_token, new_password } = req.body || {};

  if (!reset_token || !new_password) {
    return res.status(400).json({ success: false, message: 'Please provide reset_token and new_password' });
  }

  if (!validateUUID(reset_token)) {
    return res.status(400).json({ success: false, message: 'Invalid reset_token format. Must be a valid UUID.' });
  }

  if (!validatePassword(new_password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be 8-15 characters long, and include at least one lowercase letter, one uppercase letter, one number, and one special character'
    });
  }

  next();
};

export const validateGoogleSyncInput = (req: Request, res: Response, next: NextFunction) => {
  const { access_token } = req.body || {};

  if (!access_token) {
    return res.status(400).json({ success: false, message: 'Missing access token' });
  }

  next();
};
