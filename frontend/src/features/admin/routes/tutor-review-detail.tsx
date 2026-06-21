import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, Calendar, BookOpen, MessageSquare, Filter } from 'lucide-react';
import { AdminReviewService } from '../services/review.service';

interface TutorInfo {
    id: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
    averageRating: number;
    reviewCount: number;
    activeClassesCount: number;
    activeClasses: { id: string, name: string }[];
}

interface Review {
    id: string;
    rating: number;
    review: string | null;
    created_at: string;
    learner_name: string;
    course_name: string;
}

export default function AdminTutorReviewDetail() {
    const { id } = useParams<{ id: string }>();
    const [tutorInfo, setTutorInfo] = useState<TutorInfo | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
    const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST' | 'HIGHEST' | 'LOWEST'>('NEWEST');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await AdminReviewService.getTutorReviewDetail(id);
                if (res.success) {
                    setTutorInfo(res.data.tutor);
                    setReviews(res.data.reviews);
                } else {
                    setError('Failed to fetch tutor details');
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !tutorInfo) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 font-medium mb-4">{error || 'Tutor not found'}</p>
                <Link to="/admin/manage-reviews" className="text-[#0061a5] font-bold hover:underline">
                    &larr; Back to Manage Reviews
                </Link>
            </div>
        );
    }

    const filteredReviews = reviews.filter(r => filterRating === 'ALL' || r.rating === filterRating);
    
    const sortedReviews = [...filteredReviews].sort((a, b) => {
        switch (sortOrder) {
            case 'NEWEST': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'OLDEST': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case 'HIGHEST': return b.rating - a.rating;
            case 'LOWEST': return a.rating - b.rating;
            default: return 0;
        }
    });

    const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
    const paginatedReviews = sortedReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const initials = tutorInfo.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    const joinedDate = new Date(tutorInfo.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-6">
            <Link to="/admin/manage-reviews" className="inline-flex items-center gap-2 text-[#43474e] hover:text-[#002045] transition-colors font-medium text-sm w-fit">
                <ArrowLeft className="w-4 h-4" />
                Back to Manage Reviews
            </Link>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar - Tutor Profile */}
                <div className="lg:w-80 shrink-0">
                    <div className="bg-white rounded-2xl border border-[#e0e3e5] p-6 flex flex-col items-center text-center sticky top-24">
                        <div className="w-24 h-24 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold text-3xl mb-4 overflow-hidden shadow-inner">
                            {tutorInfo.avatar_url ? (
                                <img src={tutorInfo.avatar_url} alt={tutorInfo.full_name} className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-[#002045] mb-1">{tutorInfo.full_name}</h2>
                        <span className="text-[#0061a5] text-sm font-bold bg-[#e6f0fa] px-3 py-1 rounded-full mb-6">Tutor</span>

                        <div className="w-full pt-6 border-t border-[#f1f4f6] flex flex-col items-center">
                            <span className="text-[#43474e] text-sm font-medium mb-2">Average Rating</span>
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-7 h-7 fill-[#fbbc04] text-[#fbbc04]" />
                                <span className="text-3xl font-black text-[#181c1e]">{tutorInfo.averageRating.toFixed(1)}</span>
                            </div>
                            <span className="text-[#74777f] text-sm">Based on {tutorInfo.reviewCount} reviews</span>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Stats & Classes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#f8f9fa] border border-[#e0e3e5] rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                <BookOpen className="w-6 h-6 text-[#0061a5]" />
                            </div>
                            <div>
                                <h3 className="text-[#43474e] text-sm font-medium mb-1">Active Classes</h3>
                                <p className="text-2xl font-bold text-[#181c1e]">{tutorInfo.activeClassesCount}</p>
                            </div>
                        </div>
                        <div className="bg-[#f8f9fa] border border-[#e0e3e5] rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                <Calendar className="w-6 h-6 text-[#ba1a1a]" />
                            </div>
                            <div>
                                <h3 className="text-[#43474e] text-sm font-medium mb-1">Joined Date</h3>
                                <p className="text-[#181c1e] font-bold">{joinedDate}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
                        <h3 className="text-sm font-bold text-[#43474e] mb-3">Currently Teaching</h3>
                        <div className="flex flex-wrap gap-2">
                            {tutorInfo.activeClasses.length > 0 ? (
                                <>
                                    {tutorInfo.activeClasses.slice(0, 4).map(cls => (
                                        <span key={cls.id} className="bg-[#e6f0fa] text-[#0061a5] px-3 py-1.5 rounded-lg text-sm font-semibold border border-[#d2e4ff]">
                                            {cls.name}
                                        </span>
                                    ))}
                                    {tutorInfo.activeClasses.length > 4 && (
                                        <span className="bg-[#f1f4f6] text-[#43474e] px-3 py-1.5 rounded-lg text-sm font-semibold border border-[#e0e3e5]">
                                            +{tutorInfo.activeClasses.length - 4} more
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-sm text-[#74777f]">Not teaching any classes currently.</span>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white rounded-2xl border border-[#e0e3e5] flex flex-col overflow-hidden">
                        {/* Filters */}
                        <div className="p-4 border-b border-[#e0e3e5] bg-[#f8f9fa] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="font-bold text-[#002045] flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#0061a5]" />
                                Student Reviews ({filteredReviews.length})
                            </h3>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative">
                                    <select 
                                        className="appearance-none pl-9 pr-8 py-2 bg-white border border-[#e0e3e5] rounded-xl text-sm font-medium text-[#43474e] focus:outline-none focus:border-[#0061a5] transition-all cursor-pointer"
                                        value={filterRating}
                                        onChange={(e) => {
                                            setFilterRating(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="ALL">Filter By: All Stars</option>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777f] pointer-events-none" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-[#74777f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select 
                                        className="appearance-none pl-4 pr-8 py-2 bg-white border border-[#e0e3e5] rounded-xl text-sm font-medium text-[#43474e] focus:outline-none focus:border-[#0061a5] transition-all cursor-pointer"
                                        value={sortOrder}
                                        onChange={(e) => {
                                            setSortOrder(e.target.value as any);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="NEWEST">Sort By: Newest</option>
                                        <option value="OLDEST">Sort By: Oldest</option>
                                        <option value="HIGHEST">Sort By: Highest Rating</option>
                                        <option value="LOWEST">Sort By: Lowest Rating</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-[#74777f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review List */}
                        <div className="divide-y divide-[#e0e3e5]">
                            {paginatedReviews.length > 0 ? (
                                paginatedReviews.map(review => (
                                    <div key={review.id} className="p-5 hover:bg-[#f8f9fa] transition-colors">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#f1f4f6] flex items-center justify-center text-[#43474e] font-bold shrink-0">
                                                    {review.learner_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#181c1e] text-sm">{review.learner_name}</h4>
                                                    <p className="text-xs text-[#74777f]">Class: {review.course_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:items-end">
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star 
                                                            key={star} 
                                                            className={`w-4 h-4 ${star <= review.rating ? 'fill-[#fbbc04] text-[#fbbc04]' : 'fill-[#e0e3e5] text-[#e0e3e5]'}`} 
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-[#74777f] mt-1">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="pl-13">
                                            <div className="bg-[#f1f4f6] rounded-xl p-3 text-sm text-[#43474e]">
                                                {review.review || <span className="italic text-[#74777f]">No text review provided.</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center text-[#74777f]">
                                    No reviews match the selected filters.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-[#e0e3e5] bg-white flex justify-center items-center gap-2">
                                <button 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-[#0061a5] text-white' : 'border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6]'}`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e0e3e5] text-[#43474e] hover:bg-[#f1f4f6] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
