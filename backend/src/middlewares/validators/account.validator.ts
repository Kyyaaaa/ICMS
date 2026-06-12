import { Request, Response, NextFunction } from 'express';
import { validateEmail, validatePassword, validatePhoneNumber, validateFullName, validateRole, validateDate, validateGender, validateUrl, validateUUID } from '../../utils/validators';

export const validateGetAllAccountsInput = (req: Request, res: Response, next: NextFunction) => {
  const { role, page, limit } = req.query;

  if (role && !validateRole(role as string)) {
    return res.status(400).json({ success: false, message: 'Invalid role filter. Allowed roles are: ADMIN, STAFF, TUTOR, LEARNER' });
  }

  if (page) {
    const p = parseInt(page as string);
    if (isNaN(p) || p < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page number. Must be >= 1' });
    }
  }

  if (limit) {
    const l = parseInt(limit as string);
    if (isNaN(l) || l < 1 || l > 100) {
      return res.status(400).json({ success: false, message: 'Invalid limit number. Must be between 1 and 100' });
    }
  }

  next();
};

export const validateAccountIdParam = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  if (!validateUUID(id)) {
    return res.status(400).json({ success: false, message: 'Invalid account ID format. Must be a valid UUID.' });
  }

  next();
};

export const validateCreateAccountInput = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role, full_name, phone_number } = req.body || {};

  if (!email || !password || !role || !full_name) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: email, password, role, full_name'
    });
  }

  if (!validateRole(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Allowed roles are: ADMIN, STAFF, TUTOR, LEARNER'
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
      message: 'Invalid full name. Only letters and spaces allowed, 2-50 characters.'
    });
  }

  if (phone_number && !validatePhoneNumber(phone_number)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number. Must be 10 digits starting with 03, 05, 07, 08, or 09.'
    });
  }

  next();
};

export const validateUpdateAccountInput = (req: Request, res: Response, next: NextFunction) => {
  const { full_name, email, phone_number, password, date_of_birth, gender, avatar_url, status } = req.body || {};

  if (email !== undefined && !validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (status !== undefined && status !== 'ACTIVE' && status !== 'BANNED') {
    return res.status(400).json({ success: false, message: 'Invalid status. Allowed values are: ACTIVE, BANNED' });
  }

  if (full_name !== undefined && !validateFullName(full_name)) {
    return res.status(400).json({ success: false, message: 'Invalid full name. Only letters and spaces allowed, 2-50 characters.' });
  }

  if (phone_number !== undefined && phone_number !== null && !validatePhoneNumber(phone_number)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number. Must be 10 digits starting with 03, 05, 07, 08, or 09.' });
  }

  if (date_of_birth !== undefined && date_of_birth !== null && !validateDate(date_of_birth)) {
    return res.status(400).json({ success: false, message: 'Invalid date_of_birth. Must be a valid ISO 8601 date (e.g. YYYY-MM-DD).' });
  }

  if (gender !== undefined && gender !== null && !validateGender(gender)) {
    return res.status(400).json({ success: false, message: 'Invalid gender. Allowed values: MALE, FEMALE, OTHER.' });
  }

  if (avatar_url !== undefined && avatar_url !== null && !validateUrl(avatar_url)) {
    return res.status(400).json({ success: false, message: 'Invalid avatar_url. Must be a valid URL.' });
  }

  if (password !== undefined && password !== '' && !validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid new password. Must be 8-15 characters, including uppercase, lowercase, digit, and special character.'
    });
  }

  next();
};

export const validateUpdateAccountStatusInput = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body || {};

  if (status !== 'ACTIVE' && status !== 'BANNED') {
    return res.status(400).json({
      success: false,
      message: 'Missing or invalid required field: status (ACTIVE or BANNED)'
    });
  }

  next();
};
