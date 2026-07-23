import { Upload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CertificatesService } from "../services/certificates.service";


import { getLocalDateString } from '@/utils/date';
import { validateFile } from '@/utils/file';

interface CertificateUploadProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const CertificateUpload = ({
  onCancel,
  onSuccess,
}: CertificateUploadProps) => {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expDate, setExpDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const todayString = getLocalDateString();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!name || !issuer || !issueDate || !file) {
      setError("Please fill all required fields and upload a file.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload file
      const fileUrl = await CertificatesService.uploadFile(file);

      // 2. Create Certificate
      await CertificatesService.addCertificate({
        name,
        issuer,
        issueDate,
        expDate: expDate || undefined,
        fileUrl,
      });

      onSuccess();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const errorObj = err as { error?: string, message?: string };
        const msg = errorObj?.error ? `${errorObj.message}: ${errorObj.error}` : errorObj?.message;
        setError(msg || "An error occurred during upload.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 animate-scale-in origin-top">
      <h2 className="text-lg font-bold text-[#002045] mb-4">
        Upload New Certificate
      </h2>
      <div className="mb-6 p-4 bg-[#e6f0fa] border border-[#c4c6cf] rounded-xl text-sm text-[#004d80]">
        <strong>Important Note:</strong> Please only upload valid English proficiency certificates (e.g., IELTS, TOEFL) or relevant teaching degrees/diplomas (e.g., TESOL, TEFL, CELTA). Do not upload unrelated personal documents. Inaccurate submissions will be rejected during verification.
      </div>
      {error && (
        <p className="text-rose-600 text-sm mb-4 bg-rose-50 p-3 rounded-lg border border-rose-200">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#43474e]">
              Certificate Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. IELTS Academic 8.0 / TESOL Certificate"
              className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#43474e]">
              Issuer / Institution <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. British Council / Cambridge Assessment"
              className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none text-sm"
            />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-[#43474e]">
                Issue Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                max={todayString}
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                onBlur={(e) => {
                  const val = e.target.value;
                  if (val && val > todayString) setIssueDate(todayString);
                  if (val && expDate && val >= expDate) setExpDate("");
                }}
                className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none text-sm text-[#181c1e]"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-[#43474e]">
                Expiration Date <span className="text-[#74777f] font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                min={issueDate ? new Date(new Date(issueDate).getTime() + 86400000).toISOString().split('T')[0] : undefined}
                max="2099-12-31"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                onBlur={(e) => {
                  const val = e.target.value;
                  const minDate = issueDate ? new Date(new Date(issueDate).getTime() + 86400000).toISOString().split('T')[0] : "";
                  if (val && minDate && val < minDate) setExpDate(minDate);
                  else if (val && val > "2099-12-31") setExpDate("2099-12-31");
                }}
                className="w-full h-11 px-4 rounded-lg border border-[#c4c6cf] focus:border-[#0061a5] focus:ring-1 focus:ring-[#0061a5] outline-none text-sm text-[#181c1e]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#43474e]">
            Upload Certificate Image / PDF{" "}
            <span className="text-rose-600">*</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
          />
          <div
            onClick={() => !file && fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed border-[#c4c6cf] rounded-xl flex flex-col items-center justify-center text-center transition-colors group relative overflow-hidden ${
                file ? "p-0 border-solid" : "p-6 cursor-pointer min-h-40 hover:bg-[#f8f9fa]"
            } ${file && file.type === "application/pdf" ? "min-h-150 h-150" : file && file.type.startsWith("image/") ? "min-h-75 h-full" : "h-full"}`}
          >
            {file ? (
              <>
                {file.type.startsWith("image/") ? (
                  <img
                    src={previewUrl!}
                    alt="Preview"
                    className="w-full h-full absolute inset-0 object-contain bg-black/5"
                  />
                ) : file.type === "application/pdf" ? (
                  <iframe
                    src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`}
                    className="w-full h-full absolute inset-0 border-0 bg-white"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center w-full h-full justify-center absolute inset-0">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#002045] mb-1 truncate max-w-50">
                      {file.name}
                    </p>
                    <p className="text-xs text-[#74777f]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-3 right-3 p-2 text-[#43474e] bg-white border border-[#e0e3e5] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-lg transition-all shadow-md z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-[#002045] mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-[#74777f]">
                  JPG, PNG, or PDF (Max. 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-6 mt-6 border-t border-[#e0e3e5] gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2.5 bg-white border border-[#c4c6cf] text-[#43474e] rounded-lg font-bold text-sm hover:bg-[#f1f4f6] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2.5 bg-[#0061a5] text-white rounded-lg font-bold text-sm hover:bg-[#004d80] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : null}
          {loading ? "Uploading..." : "Submit for Verification"}
        </button>
      </div>
    </div>
  );
};
