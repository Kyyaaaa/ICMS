import { Request, Response, NextFunction } from 'express';
import path from 'path';

export const validateFileUploadInput = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const file = req.files.file as any;
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];

  const fileExtension = path.extname(file.name).toLowerCase();

  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(fileExtension)) {
    return res.status(415).json({
      success: false,
      message: 'Unsupported file type. Only JPEG, PNG, WEBP, GIF, and PDF are allowed.'
    });
  }

  next();
};
