import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Qualification } from '../types/qualification';
import { QualificationsService } from '../services/qualifications.service';
import { QualificationUpload } from '../components/QualificationUpload';
import { QualificationList } from '../components/QualificationList';
import { QualificationModals } from '../components/QualificationModals';

const TutorQualifications = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQualifications = async () => {
            setLoading(true);
            const data = await QualificationsService.getMyQualifications();
            setQualifications(data);
            setLoading(false);
        };
        fetchQualifications();
    }, []);

    // Modal States
    const [viewQual, setViewQual] = useState<Qualification | null>(null);
    const [editQual, setEditQual] = useState<Qualification | null>(null);
    const [deleteQual, setDeleteQual] = useState<Qualification | null>(null);

    // Handlers
    const handleDelete = () => {
        if (deleteQual) {
            setQualifications(qualifications.filter(q => q.id !== deleteQual.id));
            setDeleteQual(null);
        }
    };

    const handleEditSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editQual) {
            setQualifications(qualifications.map(q => q.id === editQual.id ? editQual : q));
            setEditQual(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">My Qualifications</h1>
                    <p className="text-[#43474e] text-[14px]">Upload and manage your certificates and diplomas.</p>
                </div>
                <button 
                    onClick={() => setIsUploading(!isUploading)}
                    className="px-6 py-2.5 bg-[#0061a5] text-white rounded-lg font-bold text-[14px] hover:bg-[#004d80] transition-colors flex items-center gap-2"
                >
                    {isUploading ? 'Cancel' : <><Plus className="w-5 h-5" /> Add New</>}
                </button>
            </div>

            {isUploading && (
                <QualificationUpload 
                    onCancel={() => setIsUploading(false)} 
                    onSubmit={() => setIsUploading(false)} 
                />
            )}

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] rounded-[12px] bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <QualificationList 
                    qualifications={qualifications} 
                    onView={setViewQual} 
                    onEdit={setEditQual} 
                    onDelete={setDeleteQual} 
                />
            )}

            <QualificationModals 
                viewQual={viewQual} setViewQual={setViewQual}
                editQual={editQual} setEditQual={setEditQual} handleEditSave={handleEditSave}
                deleteQual={deleteQual} setDeleteQual={setDeleteQual} handleDelete={handleDelete}
            />
        </div>
    );
};

export default TutorQualifications;
