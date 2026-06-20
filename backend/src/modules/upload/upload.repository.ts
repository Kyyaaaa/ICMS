import { supabaseAdmin } from '../../configs/supabase';

export class UploadRepository {
  static async uploadFile(filePath: string, fileData: Buffer, mimeType: string): Promise<string> {
    const { error } = await supabaseAdmin.storage
      .from('icms_uploads')
      .upload(filePath, fileData, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('icms_uploads')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
}
