import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search, BookOpen } from 'lucide-react';
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
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An error occurred');
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
            <div className="flex items-center justify-center min-h-100">
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
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#e0e3e5]">
                <div>
                    <h1 className="text-xl font-bold text-[#002045] mb-1">Manage Reviews</h1>
                    <p className="text-sm text-[#74777f]">Overview of tutor ratings and feedback</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f]" />
                        <input 
                            type="text" 
                            placeholder="Search tutor by name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#e0e3e5] rounded-xl text-sm text-[#43474e] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0061a5] focus:border-[#0061a5] transition-colors"
                        />
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <select 
                            className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2 bg-[#f8f9fa] border border-[#e0e3e5] rounded-xl text-sm text-[#43474e] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0061a5] focus:border-[#0061a5] transition-colors cursor-pointer"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                        >
                            <option value="DESC">Highest Rated First</option>
                            <option value="ASC">Lowest Rated First</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-[#74777f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clean List Layout for Tutors */}
            <div className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden">
                <div className="divide-y divide-[#e0e3e5]">
                    {filteredAndSortedTutors.length > 0 ? (
                        filteredAndSortedTutors.map(tutor => {
                            const initials = tutor.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                            
                            return (
                                <div 
                                    key={tutor.id} 
                                    onClick={() => navigate(`/admin/manage-reviews/${tutor.id}`)}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-[#f8f9fa] transition-colors cursor-pointer group gap-4"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="relative w-12 h-12 shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold absolute inset-0 border border-[#d2e4ff]">
                                                {initials}
                                            </div>
                                            {tutor.avatar_url && (
                                                <img 
                                                    src={tutor.avatar_url} 
                                                    alt={tutor.full_name} 
                                                    className="w-12 h-12 rounded-full object-cover absolute inset-0 z-10 border border-[#e0e3e5]"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#181c1e] group-hover:text-[#0061a5] transition-colors">{tutor.full_name}</h3>
                                            <p className="text-sm text-[#74777f] flex items-center gap-1 mt-0.5">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                {tutor.activeClassesCount} Active Classes
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-5 h-5 fill-[#fbbc04] text-[#fbbc04]" />
                                                <span className="font-bold text-lg text-[#181c1e]">{tutor.averageRating.toFixed(1)}</span>
                                            </div>
                                            <span className="text-sm text-[#74777f]">({tutor.reviewCount} reviews)</span>
                                        </div>
                                        
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#c4c6cf] group-hover:text-[#0061a5] group-hover:bg-[#e6f0fa] transition-all">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <Star className="w-10 h-10 text-[#e0e3e5] mb-3" />
                            <h4 className="text-base font-bold text-[#181c1e] mb-1">No tutors found</h4>
                            <p className="text-sm text-[#74777f]">Try adjusting your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
