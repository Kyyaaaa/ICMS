import { Request, Response } from 'express';
import cloudinary from '../../configs/cloudinary';
import fs from 'fs';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const file = req.files.file as any;

      // Convert buffer to base64
      const b64 = Buffer.from(file.data).toString('base64');
      let dataURI = 'data:' + file.mimetype + ';base64,' + b64;

      // Ensure directory organization on Cloudinary
      let folder = 'icms_uploads';
      if (req.body.folder) {
        // e.g. "avatars", "certificates"
        folder = `icms_${req.body.folder}`;
      }

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: folder,
        resource_type: 'auto',
      });

      return res.status(200).json({
        success: true,
        url: result.secure_url,
        message: 'Image uploaded successfully'
      });
    } catch (error: any) {
      console.error('Cloudinary Upload Error:', error);
      return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
  }
}
