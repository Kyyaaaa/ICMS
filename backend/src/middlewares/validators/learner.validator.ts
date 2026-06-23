import { Request, Response, NextFunction } from 'express';
import { validateEmail, validatePassword, validateFullName, validatePhoneNumber } from '../../utils/validators';

export const validateCreateLearnerInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, full_name, phone_number } = req.body || {};

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

  next();
};

export const validateUpdateLearnerInput = (req: Request, res: Response, next: NextFunction) => {
  const { full_name, phone_number } = req.body || {};

  if (full_name !== undefined && !validateFullName(full_name)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid full_name. Must be 2-50 characters and contain only letters and spaces'
    });
  }

  if (phone_number !== undefined && !validatePhoneNumber(phone_number)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone_number. Must be a valid Vietnamese 10-digit phone number starting with 0'
    });
  }

  next();
};
