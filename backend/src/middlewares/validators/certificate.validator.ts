import { Request, Response, NextFunction } from 'express';
import { validateDate, validateUrl, validateUUID } from '../../utils/validators';

export const validateCertificateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  if (!validateUUID(id)) {
    return res.status(400).json({ success: false, message: 'Invalid Certificate ID format. Must be a valid UUID.' });
  }

  next();
};

export const validateCreateCertificateInput = (req: Request, res: Response, next: NextFunction) => {
  const { name, issuer, issue_date, expiration_date, file_url } = req.body || {};

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Missing required field: name' });
  }

  if (!issuer || issuer.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Missing required field: issuer' });
  }

  if (!issue_date || !validateDate(issue_date)) {
    return res.status(400).json({ success: false, message: 'Invalid or missing issue_date. Must be a valid ISO 8601 date (e.g. YYYY-MM-DD).' });
  }

  if (expiration_date !== undefined && expiration_date !== null && expiration_date !== '') {
    if (!validateDate(expiration_date)) {
      return res.status(400).json({ success: false, message: 'Invalid expiration_date. Must be a valid ISO 8601 date (e.g. YYYY-MM-DD).' });
    }
    
    if (new Date(issue_date) > new Date(expiration_date)) {
      return res.status(400).json({ success: false, message: 'issue_date cannot be after expiration_date.' });
    }
  }

  if (!file_url || !validateUrl(file_url)) {
    return res.status(400).json({ success: false, message: 'Invalid or missing file_url. Must be a valid URL.' });
  }

  next();
};

export const validateUpdateCertificateInput = (req: Request, res: Response, next: NextFunction) => {
  const { name, issuer, issue_date, expiration_date, file_url } = req.body || {};

  if (name !== undefined && name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'name cannot be empty' });
  }

  if (issuer !== undefined && issuer.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'issuer cannot be empty' });
  }

  if (issue_date !== undefined) {
    if (!validateDate(issue_date)) {
      return res.status(400).json({ success: false, message: 'Invalid issue_date. Must be a valid ISO 8601 date (e.g. YYYY-MM-DD).' });
    }
  }

  if (expiration_date !== undefined && expiration_date !== null && expiration_date !== '') {
    if (!validateDate(expiration_date)) {
      return res.status(400).json({ success: false, message: 'Invalid expiration_date. Must be a valid ISO 8601 date (e.g. YYYY-MM-DD).' });
    }
    
    // If both dates are provided in the request, validate them against each other
    if (issue_date && validateDate(issue_date)) {
      if (new Date(issue_date) > new Date(expiration_date)) {
        return res.status(400).json({ success: false, message: 'issue_date cannot be after expiration_date.' });
      }
    }
  }

  if (file_url !== undefined && !validateUrl(file_url)) {
    return res.status(400).json({ success: false, message: 'Invalid file_url. Must be a valid URL.' });
  }

  next();
};
