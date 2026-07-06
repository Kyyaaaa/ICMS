import { Request, Response } from 'express';
import { UploadService } from './upload.service';
import { UploadResponse } from './upload.model';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      const file = req.files!.file as any;
      const folderName = req.body && req.body.folder ? req.body.folder : undefined;

      const publicUrl = await UploadService.uploadFile(file, folderName);

      const response: UploadResponse = {
        success: true,
        url: publicUrl,
        message: 'File uploaded successfully'
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error('Supabase Upload Error:', error);
      const errorResponse: UploadResponse = { 
        success: false, 
        message: 'Upload failed: ' + error.message 
      };
      return res.status(500).json(errorResponse);
    }
  }
}
