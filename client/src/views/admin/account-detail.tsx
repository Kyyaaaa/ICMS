import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';

const AdminAccountDetail = () => {
    const { id } = useParams();

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/accounts" className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Account Profile</h1>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#0061a5] to-[#004d80]"></div>
                <div className="px-6 pb-6 md:px-10 md:pb-10 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-8">
                        <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-md">
                            <div className="w-full h-full rounded-xl bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                                <User size={48} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[28px] font-bold text-[#181c1e]">John Doe</h2>
                            <p className="text-[#43474e] text-[16px] font-medium flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-[#e8def8] text-[#6750a4] text-[12px] font-bold rounded uppercase">Tutor</span>
                                <span>ID: TUT-2024-001</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-6 py-2 bg-white border border-[#ba1a1a] text-[#ba1a1a] rounded-xl font-bold hover:bg-[#ffebed] transition-colors flex items-center gap-2">
                                <ShieldAlert size={18} />
                                Suspend User
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-[18px] font-bold text-[#181c1e] mb-4 border-b border-[#e0e3e5] pb-2">Contact Information</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-[#43474e]">
                                    <Mail className="text-[#0061a5] w-5 h-5 shrink-0" />
                                    <span>john.doe@example.com</span>
                                </li>
                                <li className="flex items-center gap-3 text-[#43474e]">
                                    <Phone className="text-[#0061a5] w-5 h-5 shrink-0" />
                                    <span>+1 234 567 8900</span>
                                </li>
                                <li className="flex items-center gap-3 text-[#43474e]">
                                    <MapPin className="text-[#0061a5] w-5 h-5 shrink-0" />
                                    <span>123 Education St, NY</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-[18px] font-bold text-[#181c1e] mb-4 border-b border-[#e0e3e5] pb-2">Account Status</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-[#43474e]">
                                    <CheckCircle2 className="text-[#137333] w-5 h-5 shrink-0" />
                                    <span>Account Verified</span>
                                </li>
                                <li className="flex items-center gap-3 text-[#43474e]">
                                    <Calendar className="text-[#0061a5] w-5 h-5 shrink-0" />
                                    <span>Joined Oct 12, 2024</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAccountDetail;
