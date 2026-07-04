import { formatDate, formatDateTime } from "../../../shared/utils/date";
import { useState, useEffect } from "react";
import { Eye, Search, CheckCircle, XCircle, X, ShieldAlert, ShieldCheck, ShieldX, Download } from "lucide-react";
import { StaffCertificatesService } from "../services/certificates.service";
import type { StaffCertificate } from "../services/certificates.service";
import { Pagination } from '@/shared/components/common/Pagination';
const StaffCertificates = () => {
  const [Certificates, setCertificates] = useState<StaffCertificate[]>([]);
  const [selectedQual, setSelectedQual] = useState<StaffCertificate | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // We no longer need to fetch PDFs as blobs because Supabase Storage allows direct embedding.
  // The iframe can directly load the Supabase public URL.

  const handleDownload = async (url: string) => {
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
      console.error("Error triggering download:", error);
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const data = await StaffCertificatesService.getAllCertificates();
        setCertificates(data);
      } catch (error: any) {
        console.error("Failed to fetch Certificates", error);
        setFetchError(error.message || JSON.stringify(error));
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      await StaffCertificatesService.changeStatus(id, "Verified");
      setCertificates(
        Certificates.map((q) =>
          q.id === id ? { ...q, status: "Verified" } : q
        )
      );
      setSelectedQual(null);
    } catch (error) {
      console.error("Failed to verify", error);
    }
  };

  const handleRejectSubmit = async (id: string) => {
    if (!rejectReason.trim()) {
      setRejectError("Please provide a reason for rejection.");
      setShakeKey((prev) => prev + 1);
      return;
    }
    try {
      await StaffCertificatesService.changeStatus(id, "Rejected", rejectReason);
      setCertificates(
        Certificates.map((q) =>
          q.id === id ? { ...q, status: "Rejected" } : q
        )
      );
      setSelectedQual(null);
      setShowRejectInput(false);
      setRejectReason("");
      setRejectError(null);
      setFetchError(null);
    } catch (error) {
      console.error("Failed to reject", error);
    }
  };

  const pendingCount = Certificates.filter((q) => q.status === "Pending Verification").length;
  const verifiedCount = Certificates.filter((q) => q.status === "Verified").length;
  const rejectedCount = Certificates.filter((q) => q.status === "Rejected").length;

  const filteredQuals = Certificates.filter((q) => {
    const matchesSearch =
      q.account.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());



  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#002045]">
          Tutor Certificates
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tutor or cert..."
              className="pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg w-75 focus:ring-2 focus:ring-[#0061a5] focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061a5] font-medium bg-white text-[#181c1e]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Pending Verification
            </p>
            <p className="text-2xl font-bold text-[#002045]">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Verified Certificates
            </p>
            <p className="text-2xl font-bold text-[#002045]">{verifiedCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
            <ShieldX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Rejected Certificates
            </p>
            <p className="text-2xl font-bold text-[#002045]">{rejectedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
            <tr>
              <th className="p-4 font-semibold text-[#43474e]">Tutor Name</th>
              <th className="p-4 font-semibold text-[#43474e]">
                Certificate Name
              </th>
              <th className="p-4 font-semibold text-[#43474e]">Issuer</th>
              <th className="p-4 font-semibold text-[#43474e]">Submitted</th>
              <th className="p-4 font-semibold text-[#43474e]">Status</th>
              <th className="p-4 font-semibold text-[#43474e] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#74777f]">
                  Loading...
                </td>
              </tr>
            ) : filteredQuals.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#74777f]">
                  No Certificates found.
                  {fetchError && (
                    <>
                      <br />
                      <span className="text-xs text-red-500">
                        Error: {fetchError}
                      </span>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filteredQuals.slice((currentPage - 1) * limit, currentPage * limit).map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#e0e3e5] hover:bg-gray-50"
                >
                  <td className="p-4">
                    <p className="font-bold text-[#002045]">
                      {item.account.full_name}
                    </p>
                    <p className="text-xs text-[#74777f]">
                      {item.account.email}
                    </p>
                  </td>
                  <td className="p-4 font-bold text-[#181c1e]">{item.name}</td>
                  <td className="p-4 text-[#43474e]">{item.issuer}</td>
                  <td className="p-4 text-[#43474e]">
                    <p className="text-xs font-medium">
                      {formatDateTime(item.created_at)}
                    </p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "Pending Verification"
                          ? "bg-amber-100 text-amber-700"
                          : item.status === "Verified"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedQual(item)}
                      className="text-[#0061a5] hover:bg-[#f0f7ff] px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-end gap-1 ml-auto"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
          currentPage={currentPage}
          totalItems={filteredQuals.length}
          itemsPerPage={limit}
          onPageChange={setCurrentPage}
          itemName="certificates"
      />

      {selectedQual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] animate-scale-in">
            {/* Document View - Left Side */}
            <div className="flex-1 bg-[#f8f9fa] overflow-y-hidden border-r border-[#e0e3e5] relative flex flex-col p-4">
              {selectedQual.file_url.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={`${selectedQual.file_url}#toolbar=0`}
                  className="w-full h-full flex-1 border rounded-lg"
                  title="Certificate Preview"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center h-full overflow-y-auto custom-scrollbar">
                  <img 
                    src={selectedQual.file_url} 
                    alt="Certificate Preview" 
                    className="max-w-full rounded-lg border object-contain max-h-full"
                  />
                </div>
              )}
            </div>

            {/* Details & Actions - Right Side */}
            <div className="w-full md:w-90 bg-white p-5 flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-bold text-[#002045] text-xl">
                  Review Certificate
                </h3>
                <button
                  onClick={() => {
                    setSelectedQual(null);
                    setShowRejectInput(false);
                    setRejectReason("");
                    setFetchError(null);
                    setRejectError(null);
                  }}
                  className="p-1.5 hover:bg-[#f1f4f6] rounded-full transition-colors text-[#43474e]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                <div>
                  <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1">
                    Tutor
                  </p>
                  <p className="font-bold text-[#181c1e] text-sm">
                    {selectedQual.account.full_name}
                  </p>
                  <p className="text-[#43474e] text-xs">
                    {selectedQual.account.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1">
                    Certificate Name
                  </p>
                  <p className="font-bold text-[#0061a5] text-sm">
                    {selectedQual.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1">
                    Issuer / Institution
                  </p>
                  <p className="font-semibold text-[#181c1e] text-sm">
                    {selectedQual.issuer}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1">
                      Issue Date
                    </p>
                    <p className="font-medium text-[#181c1e] text-sm">
                      {formatDate(selectedQual.issue_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1">
                      Expiration
                    </p>
                    <p className="font-medium text-[#181c1e] text-sm">
                      {formatDate(selectedQual.expiration_date)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1">
                    Submitted On
                  </p>
                  <p className="font-medium text-[#181c1e] text-sm">
                    {formatDateTime(selectedQual.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#74777f] uppercase tracking-wider mb-1">
                    Current Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      selectedQual.status === "Pending Verification"
                        ? "bg-amber-100 text-amber-700"
                        : selectedQual.status === "Verified"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {selectedQual.status}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-[#e0e3e5]">
                  <button
                    onClick={() => handleDownload(selectedQual.file_url)}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-[#f8f9fa] hover:bg-[#e0e3e5] text-[#0061a5] font-bold rounded-lg transition-colors border border-[#c4c6cf] text-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Document
                  </button>
                </div>
              </div>

              {selectedQual.status === "Pending Verification" &&
                !showRejectInput && (
                  <div className="mt-4 pt-4 border-t border-[#e0e3e5] shrink-0 flex items-center gap-3">
                    <button
                      onClick={() => setShowRejectInput(true)}
                      className="flex-1 py-2.5 bg-white border-2 border-rose-100 text-rose-600 rounded-xl font-bold hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(selectedQual.id)}
                      className="flex-1 py-2.5 bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004d80] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Verify
                    </button>
                  </div>
                )}

              {selectedQual.status === "Pending Verification" &&
                showRejectInput && (
                  <div className="mt-4 pt-4 border-t border-[#e0e3e5] shrink-0 flex flex-col gap-3">
                    <div key={shakeKey} className="space-y-1">
                      <textarea
                        placeholder="Provide reason for rejection (required)..."
                        className={`w-full p-3 border rounded-xl outline-none text-sm min-h-20 transition-all ${
                          rejectError
                            ? "border-rose-500 bg-rose-50 animate-shake focus:ring-1 focus:ring-rose-500"
                            : "border-[#c4c6cf] focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                        }`}
                        value={rejectReason}
                        onChange={(e) => {
                          setRejectReason(e.target.value);
                          setRejectError(null);
                        }}
                      />
                      {rejectError && (
                        <p className="text-rose-600 text-xs font-bold ml-1">
                          {rejectError}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setShowRejectInput(false);
                          setRejectReason("");
                          setRejectError(null);
                        }}
                        className="flex-1 py-2.5 bg-[#f1f4f6] text-[#43474e] rounded-xl font-bold hover:bg-[#e0e3e5] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRejectSubmit(selectedQual.id)}
                        className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-sm hover:shadow transition-all"
                      >
                        Confirm Reject
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffCertificates;
