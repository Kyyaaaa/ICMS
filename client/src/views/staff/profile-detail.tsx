import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Award, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';

const ProfileDetail = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = useParams();
    const [status, setStatus] = useState<'Pending' | 'Verified' | 'Rejected'>('Pending');

    const handleApprove = () => setStatus('Verified');
    const handleReject = () => setStatus('Rejected');

    return (
        <div className="space-y-[24px] animate-fade-in-up pb-[40px] max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/staff/profiles" className="p-2 bg-white border border-[#e0e3e5] rounded-lg text-[#43474e] hover:bg-[#f1f4f6] transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-[28px] font-extrabold text-[#002045]">Tutor Verification</h1>
                            {status === 'Pending' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[13px] font-bold">Pending Review</span>}
                            {status === 'Verified' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Verified</span>}
                            {status === 'Rejected' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1"><XCircle className="w-4 h-4"/> Rejected</span>}
                        </div>
                        <p className="text-[#43474e] text-[15px] mt-1">Review applicant information and verify qualifications.</p>
                    </div>
                </div>

                {status === 'Pending' && (
                    <div className="flex gap-3">
                        <button onClick={handleReject} className="px-5 py-2.5 bg-white border border-[#ba1a1a] text-[#ba1a1a] rounded-xl font-bold hover:bg-[#ffdad6] transition-colors flex items-center gap-2">
                            <XCircle className="w-5 h-5" /> Reject
                        </button>
                        <button onClick={handleApprove} className="px-5 py-2.5 bg-[#0061a5] text-white rounded-xl font-bold hover:bg-[#004d80] transition-colors flex items-center gap-2 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" /> Approve Tutor
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
                {/* Left Column: Personal Info */}
                <div className="lg:col-span-1 space-y-[24px]">
                    <div className="bg-white p-[24px] rounded-3xl shadow-sm border border-[#e0e3e5] text-center">
                        <div className="w-32 h-32 mx-auto rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold text-[48px] mb-4">
                            EM
                        </div>
                        <h2 className="text-[22px] font-extrabold text-[#002045]">Elena Martinez</h2>
                        <p className="text-[#43474e] font-medium mt-1 mb-6">Applied for: IELTS & English Tutor</p>

                        <div className="space-y-4 text-left border-t border-[#e0e3e5] pt-6">
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-[#74777f] mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider">Email Address</div>
                                    <div className="text-[15px] font-medium text-[#181c1e]">elena.martinez@example.com</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-[#74777f] mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider">Phone Number</div>
                                    <div className="text-[15px] font-medium text-[#181c1e]">+84 987 654 321</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-[#74777f] mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider">Date of Birth</div>
                                    <div className="text-[15px] font-medium text-[#181c1e]">15 Mar 1995</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#74777f] mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-[12px] font-bold text-[#74777f] uppercase tracking-wider">Location</div>
                                    <div className="text-[15px] font-medium text-[#181c1e]">Ho Chi Minh City, Vietnam</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#002045] p-[24px] rounded-3xl shadow-sm text-white">
                        <div className="flex items-center gap-2 font-bold mb-4">
                            <Award className="w-5 h-5 text-[#adc7f7]" /> Self-Reported Skills
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-white/10 px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-white/20">IELTS Academic 8.5</span>
                            <span className="bg-white/10 px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-white/20">TESOL</span>
                            <span className="bg-white/10 px-3 py-1.5 rounded-lg text-[13px] font-semibold border border-white/20">Business English</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Qualifications & Documents */}
                <div className="lg:col-span-2 space-y-[24px]">

                    <div className="bg-white p-[32px] rounded-3xl shadow-sm border border-[#e0e3e5]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[20px] font-bold text-[#002045] flex items-center gap-2">
                                <Award className="w-6 h-6 text-[#0061a5]" /> Professional Qualifications
                            </h2>
                            <span className="text-[14px] text-[#74777f] font-medium">Please review carefully</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Certificate 1 */}
                            <div className="group relative rounded-2xl border border-[#c4c6cf] overflow-hidden bg-[#f8f9fa]">
                                <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                        alt="Bachelor's Degree"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="bg-white text-[#002045] px-4 py-2 rounded-lg font-bold text-[14px]">View Full Size</button>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border-t border-[#c4c6cf]">
                                    <h3 className="font-bold text-[#181c1e] text-[15px]">Bachelor's Degree</h3>
                                    <p className="text-[13px] text-[#74777f]">English Linguistics - XYZ University</p>
                                </div>
                            </div>

                            {/* Certificate 2 */}
                            <div className="group relative rounded-2xl border border-[#c4c6cf] overflow-hidden bg-[#f8f9fa]">
                                <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                        alt="IELTS Certificate"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="bg-white text-[#002045] px-4 py-2 rounded-lg font-bold text-[14px]">View Full Size</button>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border-t border-[#c4c6cf]">
                                    <h3 className="font-bold text-[#181c1e] text-[15px]">IELTS Test Report Form</h3>
                                    <p className="text-[13px] text-[#74777f]">Overall Band Score: 8.5</p>
                                </div>
                            </div>
                            
                            {/* Certificate 3 */}
                            <div className="group relative rounded-2xl border border-[#c4c6cf] overflow-hidden bg-[#f8f9fa]">
                                <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                        alt="TESOL Certificate"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="bg-white text-[#002045] px-4 py-2 rounded-lg font-bold text-[14px]">View Full Size</button>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border-t border-[#c4c6cf]">
                                    <h3 className="font-bold text-[#181c1e] text-[15px]">TESOL Certificate</h3>
                                    <p className="text-[13px] text-[#74777f]">120-hour certification</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetail;