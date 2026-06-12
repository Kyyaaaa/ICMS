import { Request, Response, NextFunction } from 'express';

export const validateFileUploadInput = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  next();
};
