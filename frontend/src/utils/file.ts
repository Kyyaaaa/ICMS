export const validateFile = (selectedFile: File, maxSizeMB: number = 5): string | null => {
    const MAX_FILE_SIZE = maxSizeMB * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
    const FILENAME_REGEX = /^[a-zA-Z0-9\s._-]+$/;

    if (selectedFile.size > MAX_FILE_SIZE) {
        return `File size exceeds ${maxSizeMB}MB limit.`;
    }
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
        return "Invalid file format. Only JPG, PNG, and PDF are allowed.";
    }
    if (!FILENAME_REGEX.test(selectedFile.name)) {
        return "Filename contains invalid characters. Please use only letters, numbers, spaces, dashes, and underscores.";
    }
    return null;
};

export const handleDownload = async (url: string) => {
    try {
        const secureUrl = url.replace(/^http:\/\//i, 'https://');
        
        // Fetch as blob and trigger download
        const response = await fetch(secureUrl, {
            method: 'GET',
            headers: { 'Accept': '*/*' }
        });
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        let filename = secureUrl.split('/').pop()?.split('?')[0] || 'document';
        if (!filename.includes('.')) {
            if (blob.type.includes('png')) filename += '.png';
            else if (blob.type.includes('jpeg') || blob.type.includes('jpg')) filename += '.jpg';
            else if (blob.type.includes('pdf')) filename += '.pdf';
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};
