import express from 'express';
import fileUpload from 'express-fileupload';
import { UploadController } from './upload.controller';
import { verifyToken } from '../../middlewares/auth.middleware';

const router = express.Router();

// Require authentication for uploads
router.use(verifyToken);

// Configure express-fileupload
router.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  limitHandler: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(413).json({
      success: false,
      message: 'File size limit exceeded. Maximum allowed size is 5MB.'
    });
  }
}));

// expects form-data with a field named "file" (and optionally "folder")
router.post('/image', UploadController.uploadImage);

// Error handling middleware specific to this router
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Upload Error:', err);
  res.status(500).json({
    success: false,
    message: 'Upload processing failed: ' + (err.message || err.toString()),
    error: err.stack
  });
});

export default router;
