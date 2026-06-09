
import { Search, ShieldCheck, Eye, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileList = () => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-[24px] font-bold text-[#002045]">Tutor Profiles & Verification</h1>
                    <p className="text-[14px] text-[#74777f]">Review tutor qualifications, certificates, and approve profiles.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><ShieldAlert className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Pending Verification</p>
                        <p className="text-2xl font-bold text-[#002045]">12</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><ShieldCheck className="w-6 h-6"/></div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Verified Profiles</p>
                        <p className="text-2xl font-bold text-[#002045]">145</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="p-4 border-b border-[#e0e3e5] flex items-center justify-between bg-[#f8f9fa]">
                    <div className="relative w-full max-w-sm">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search tutors by name or subject..." className="w-full pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg text-sm focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20" />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 border border-[#c4c6cf] rounded-lg text-sm focus:outline-none focus:border-[#0061a5]">
                            <option value="">Status: All</option>
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5] text-[#43474e] text-sm">
                            <tr>
                                <th className="p-4 font-semibold">Tutor</th>
                                <th className="p-4 font-semibold">Subject Expertise</th>
                                <th className="p-4 font-semibold">Submitted On</th>
                                <th className="p-4 font-semibold">Verification Status</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {[
                                { name: 'Dr. Sarah Connor', subject: 'IELTS / TOEFL', date: '24-10-2026', status: 'Pending', avatar_url: '' },
                                { name: 'Mr. James Bond', subject: 'Advanced Communication', date: '23-10-2026', status: 'Verified', avatar_url: '' },
                                { name: 'Ms. Emily Blunt', subject: 'Basic English', date: '20-10-2026', status: 'Pending', avatar_url: '' },
                            ].map((tutor, i) => (
                                <tr key={i} className="border-b border-[#e0e3e5] hover:bg-[#f0f7ff]/50 transition-colors">
                                    <td className="p-4 font-bold text-[#002045]">
                                        <div className="flex items-center gap-3">
                                            {tutor.avatar_url ? (
                                                <img src={tutor.avatar_url} alt={tutor.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#e3f2fd] text-[#0061a5] flex items-center justify-center font-bold text-[12px] shrink-0">
                                                    {tutor.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                                                </div>
                                            )}
                                            {tutor.name}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#43474e]">{tutor.subject}</td>
                                    <td className="p-4 text-[#74777f]">{tutor.date}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${tutor.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {tutor.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link to={`/staff/profiles/${i}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#0061a5] hover:bg-blue-100 rounded-lg font-semibold transition-colors">
                                            <Eye className="w-4 h-4"/> Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default ProfileList;