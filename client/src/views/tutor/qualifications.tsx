import React from 'react';
import { FileBadge } from 'lucide-react';

const TutorQualifications = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0061a5]">
                    <FileBadge className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-[28px] font-bold text-[#181c1e] tracking-tight">My Qualifications</h1>
                    <p className="text-[#43474e] text-[15px]">Upload and manage your CV, certificates, and diplomas.</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-12 text-center text-[#74777f]">
                Qualifications list and upload form will go here.
            </div>
        </div>
    );
};

export default TutorQualifications;
