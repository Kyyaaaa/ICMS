import { Request, Response } from 'express';
import { supabaseAdmin } from '../../configs/supabase';

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      const file = req.files!.file as any;

      // Ensure directory organization
      let folder = '';
      if (req.body && req.body.folder) {
        folder = `${req.body.folder}/`;
      }

      // Bulletproof PDF detection: Check file buffer signature "%PDF"
      const isActuallyPdf = file.data && file.data.length >= 4 && file.data.slice(0, 4).toString() === '%PDF';
      const isPdf = file.mimetype === 'application/pdf' || isActuallyPdf;
      
      const filename = file.name || (isPdf ? 'document.pdf' : 'file');
      const baseName = filename.includes('.') ? filename.substring(0, filename.lastIndexOf('.')) : filename;
      const extension = filename.includes('.') ? filename.substring(filename.lastIndexOf('.')) : (isPdf ? '.pdf' : '');
      
      // Clean baseName to avoid spaces and special chars in URL
      const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueId = `${cleanBaseName}_${Date.now()}${extension}`;
      const filePath = `${folder}${uniqueId}`;

      const { data, error } = await supabaseAdmin.storage
        .from('icms_uploads')
        .upload(filePath, file.data, {
          contentType: file.mimetype || (isPdf ? 'application/pdf' : 'application/octet-stream'),
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('icms_uploads')
        .getPublicUrl(filePath);

      return res.status(200).json({
        success: true,
        url: publicUrlData.publicUrl,
        message: 'File uploaded successfully'
      });
    } catch (error: any) {
      console.error('Supabase Upload Error:', error);
      return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
  }
}
