import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, Filter, BookOpen } from 'lucide-react';
import { AdminReviewService } from '../services/review.service';

interface TutorRating {
    id: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
    averageRating: number;
    reviewCount: number;
    activeClassesCount: number;
}

export default function AdminManageReviews() {
    const navigate = useNavigate();
    const [tutors, setTutors] = useState<TutorRating[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'DESC' | 'ASC'>('DESC');

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                setLoading(true);
                const res = await AdminReviewService.getTutorRatings();
                if (res.success) {
                    setTutors(res.data);
                } else {
                    setError('Failed to fetch tutor ratings');
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchTutors();
    }, []);

    const filteredAndSortedTutors = tutors
        .filter(t => t.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'DESC') {
                return b.averageRating - a.averageRating;
            } else {
                return a.averageRating - b.averageRating;
            }
        });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-10 font-medium">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#002045]">Manage Reviews</h1>
                    <p className="text-sm text-[#43474e]">Overview of tutor ratings and feedback</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                        <input 
                            type="text" 
                            placeholder="Search tutor by name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-[#e0e3e5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0061a5]/20 focus:border-[#0061a5] transition-all"
                        />
                    </div>
                    <div className="relative shrink-0">
                        <select 
                            className="appearance-none pl-9 pr-8 py-2 bg-white border border-[#e0e3e5] rounded-xl text-sm font-medium text-[#43474e] focus:outline-none focus:ring-2 focus:ring-[#0061a5]/20 focus:border-[#0061a5] transition-all cursor-pointer"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                        >
                            <option value="DESC">Rating: Highest First</option>
                            <option value="ASC">Rating: Lowest First</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f] pointer-events-none" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-[#74777f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#f8f9fa] border-b border-[#e0e3e5] text-sm font-bold text-[#002045]">
                                <th className="p-4 pl-6 whitespace-nowrap">Tutor</th>
                                <th className="p-4 whitespace-nowrap">Average Rating</th>
                                <th className="p-4 pr-6 whitespace-nowrap text-right">Active Classes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e0e3e5]">
                            {filteredAndSortedTutors.length > 0 ? (
                                filteredAndSortedTutors.map(tutor => {
                                    const initials = tutor.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                                    
                                    return (
                                        <tr 
                                            key={tutor.id} 
                                            onClick={() => navigate(`/admin/manage-reviews/${tutor.id}`)}
                                            className="hover:bg-[#f8f9fa] transition-colors cursor-pointer group"
                                        >
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold shrink-0 overflow-hidden">
                                                        {tutor.avatar_url ? (
                                                            <img src={tutor.avatar_url} alt={tutor.full_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            initials
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#181c1e] group-hover:text-[#0061a5] transition-colors">{tutor.full_name}</h3>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Star className="w-4 h-4 fill-[#fbbc04] text-[#fbbc04]" />
                                                    <span className="font-bold text-[#181c1e]">{tutor.averageRating.toFixed(1)}</span>
                                                    <span className="text-xs text-[#74777f]">({tutor.reviewCount} reviews)</span>
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <BookOpen className="w-4 h-4 text-[#0061a5]" />
                                                    <span className="font-bold text-[#181c1e]">{tutor.activeClassesCount}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-16 text-center text-[#74777f]">
                                        <Star className="w-12 h-12 text-[#c4c6cf] mx-auto mb-3" />
                                        <p className="font-medium">No tutors found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
