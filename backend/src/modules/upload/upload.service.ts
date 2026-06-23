import { UploadRepository } from './upload.repository';

export class UploadService {
  static async uploadFile(file: any, folderName?: string): Promise<string> {
    // Ensure directory organization
    let folder = '';
    if (folderName) {
      folder = `${folderName}/`;
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
    const mimeType = file.mimetype || (isPdf ? 'application/pdf' : 'application/octet-stream');

    return await UploadRepository.uploadFile(filePath, file.data, mimeType);
  }
}
