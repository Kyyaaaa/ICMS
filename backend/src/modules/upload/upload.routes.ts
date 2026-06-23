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

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload an image file to Supabase Storage
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload (Max 5MB)
 *               folder:
 *                 type: string
 *                 description: Optional subfolder path (e.g., 'avatars', 'courses')
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     publicUrl:
 *                       type: string
 *                       example: https://xyz.supabase.co/storage/v1/object/public/uploads/avatars/123.png
 *       400:
 *         description: No file uploaded or unsupported file format
 *       413:
 *         description: File size limit exceeded (5MB max)
 *       401:
 *         description: Unauthorized
 */
import { validateFileUploadInput } from '../../middlewares/validators/upload.validator';

// expects form-data with a field named "file" (and optionally "folder")
router.post('/image', validateFileUploadInput, UploadController.uploadImage);

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
