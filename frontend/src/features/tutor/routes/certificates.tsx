import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Certificate } from '../types/certificate';
import { CertificatesService } from '../services/certificates.service';
import { CertificateUpload } from '../components/CertificateUpload';
import { CertificateList } from '../components/CertificateList';
import { CertificateModals } from '../components/CertificateModals';

const TutorCertificates = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [Certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const data = await CertificatesService.getMyCertificates();
            const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setCertificates(sortedData);
        } catch (error) {
            console.error("Failed to fetch Certificates", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const initFetch = async () => {
            try {
                const data = await CertificatesService.getMyCertificates();
                const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setCertificates(sortedData);
            } catch (error) {
                console.error("Failed to fetch Certificates", error);
            }
            setLoading(false);
        };
        initFetch();
    }, []);

    // Modal States
    const [viewQual, setViewQual] = useState<Certificate | null>(null);
    const [editQual, setEditQual] = useState<Certificate | null>(null);
    const [deleteQual, setDeleteQual] = useState<Certificate | null>(null);

    // Handlers
    const handleDelete = async () => {
        if (deleteQual) {
            try {
                await CertificatesService.deleteCertificate(deleteQual.id.toString());
                setCertificates(Certificates.filter(q => q.id !== deleteQual.id));
                setDeleteQual(null);
            } catch (error) {
                console.error("Failed to delete Certificate", error);
            }
        }
    };

    const handleEditSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Since edit modal has its own form state and needs to do its own API call,
        // we'll update the modal component to do the API call and just call fetchCertificates() here.
        fetchCertificates();
        setEditQual(null);
    };

    const handleUploadSuccess = () => {
        setIsUploading(false);
        fetchCertificates();
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">My Certificates</h1>
                    <p className="text-[#43474e] text-sm">Upload and manage your certificates and diplomas.</p>
                </div>
                {!isUploading && (
                    <button 
                        onClick={() => setIsUploading(true)}
                        className="px-6 py-2.5 bg-[#0061a5] text-white rounded-lg font-bold text-sm hover:bg-[#004d80] transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add New
                    </button>
                )}
            </div>

            {isUploading && (
                <CertificateUpload 
                    onCancel={() => setIsUploading(false)} 
                    onSuccess={handleUploadSuccess} 
                />
            )}

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-xl bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <CertificateList 
                    Certificates={Certificates} 
                    onView={setViewQual} 
                    onEdit={setEditQual} 
                    onDelete={setDeleteQual} 
                />
            )}

            <CertificateModals 
                viewQual={viewQual} setViewQual={setViewQual}
                editQual={editQual} setEditQual={setEditQual} handleEditSave={handleEditSave}
                deleteQual={deleteQual} setDeleteQual={setDeleteQual} handleDelete={handleDelete}
            />
        </div>
    );
};

export default TutorCertificates;
