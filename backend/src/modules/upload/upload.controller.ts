import { Request, Response } from 'express';
import { UploadService } from './upload.service';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      const file = req.files!.file as any;
      const folderName = req.body && req.body.folder ? req.body.folder : undefined;

      const publicUrl = await UploadService.uploadFile(file, folderName);

      return res.status(200).json({
        success: true,
        url: publicUrl,
        message: 'File uploaded successfully'
      });
    } catch (error: any) {
      console.error('Supabase Upload Error:', error);
      return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
  }
}
