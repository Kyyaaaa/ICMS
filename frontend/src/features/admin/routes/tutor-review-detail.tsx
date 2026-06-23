import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft, Calendar, BookOpen, MessageSquare } from 'lucide-react';
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
    learner_avatar_url: string | null;
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
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
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
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header / Back */}
            <Link to="/admin/manage-reviews" className="group inline-flex items-center gap-2 text-[#43474e] hover:text-[#0061a5] transition-colors font-medium text-sm w-fit">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Manage Reviews
            </Link>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar - Tutor Profile */}
                <div className="lg:w-80 shrink-0">
                    <div className="bg-white rounded-2xl border border-[#e0e3e5] p-8 flex flex-col items-center text-center sticky top-24">
                        <div className="relative w-24 h-24 mb-4">
                            <div className="w-24 h-24 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold text-3xl absolute inset-0 border border-[#d2e4ff]">
                                {initials}
                            </div>
                            {tutorInfo.avatar_url && (
                                <img 
                                    src={tutorInfo.avatar_url} 
                                    alt={tutorInfo.full_name} 
                                    className="w-24 h-24 rounded-full object-cover absolute inset-0 z-10 border border-[#e0e3e5]"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-[#002045] mb-1">{tutorInfo.full_name}</h2>
                        <span className="text-[#74777f] text-sm mb-6 block">Tutor</span>

                        <div className="w-full pt-6 border-t border-[#e0e3e5] flex flex-col items-center">
                            <span className="text-[#43474e] text-sm font-medium mb-2">Average Rating</span>
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Star className="w-6 h-6 fill-[#fbbc04] text-[#fbbc04]" />
                                <span className="text-3xl font-bold text-[#181c1e]">{tutorInfo.averageRating.toFixed(1)}</span>
                            </div>
                            <span className="text-[#74777f] text-sm">
                                Based on {tutorInfo.reviewCount} reviews
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#f8f9fa] flex items-center justify-center shrink-0 border border-[#e0e3e5]">
                                <BookOpen className="w-5 h-5 text-[#0061a5]" />
                            </div>
                            <div>
                                <h3 className="text-[#74777f] text-sm font-medium mb-0.5">Active Classes</h3>
                                <p className="text-2xl font-bold text-[#181c1e]">{tutorInfo.activeClassesCount}</p>
                            </div>
                        </div>
                        <div className="bg-white border border-[#e0e3e5] rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#f8f9fa] flex items-center justify-center shrink-0 border border-[#e0e3e5]">
                                <Calendar className="w-5 h-5 text-[#ba1a1a]" />
                            </div>
                            <div>
                                <h3 className="text-[#74777f] text-sm font-medium mb-0.5">Joined Date</h3>
                                <p className="text-lg font-bold text-[#181c1e] mt-1">{joinedDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Currently Teaching */}
                    <div className="bg-white rounded-2xl border border-[#e0e3e5] p-5">
                        <h3 className="text-sm font-bold text-[#43474e] mb-4">Currently Teaching</h3>
                        <div className="flex flex-wrap gap-2">
                            {tutorInfo.activeClasses.length > 0 ? (
                                <>
                                    {tutorInfo.activeClasses.slice(0, 4).map(cls => (
                                        <span key={cls.id} className="bg-[#f8f9fa] text-[#181c1e] px-3 py-1.5 rounded-lg text-sm font-medium border border-[#e0e3e5]">
                                            {cls.name}
                                        </span>
                                    ))}
                                    {tutorInfo.activeClasses.length > 4 && (
                                        <span className="bg-[#f1f4f6] text-[#43474e] px-3 py-1.5 rounded-lg text-sm font-medium border border-[#e0e3e5]">
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
                    <div className="bg-white rounded-2xl border border-[#e0e3e5] flex flex-col">
                        {/* Filters Header */}
                        <div className="p-5 border-b border-[#e0e3e5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="font-bold text-[#002045] flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#0061a5]" />
                                Student Reviews ({filteredReviews.length})
                            </h3>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative">
                                    <select 
                                        className="appearance-none pl-4 pr-8 py-1.5 bg-[#f8f9fa] border border-[#e0e3e5] rounded-lg text-sm font-medium text-[#43474e] focus:outline-none focus:ring-1 focus:ring-[#0061a5] focus:border-[#0061a5] transition-colors cursor-pointer"
                                        value={filterRating}
                                        onChange={(e) => {
                                            setFilterRating(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="ALL">All Stars</option>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-[#74777f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                                <div className="relative">
                                    <select 
                                        className="appearance-none pl-4 pr-8 py-1.5 bg-[#f8f9fa] border border-[#e0e3e5] rounded-lg text-sm font-medium text-[#43474e] focus:outline-none focus:ring-1 focus:ring-[#0061a5] focus:border-[#0061a5] transition-colors cursor-pointer"
                                        value={sortOrder}
                                        onChange={(e) => {
                                            setSortOrder(e.target.value as 'NEWEST' | 'OLDEST' | 'HIGHEST' | 'LOWEST');
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="NEWEST">Newest First</option>
                                        <option value="OLDEST">Oldest First</option>
                                        <option value="HIGHEST">Highest Rating</option>
                                        <option value="LOWEST">Lowest Rating</option>
                                    </select>
                                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-[#74777f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review List */}
                        <div className="divide-y divide-[#e0e3e5]">
                            {paginatedReviews.length > 0 ? (
                                paginatedReviews.map(review => (
                                    <div key={review.id} className="p-5">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 shrink-0">
                                                    <div className="w-10 h-10 rounded-full bg-[#e6f0fa] flex items-center justify-center text-[#0061a5] font-bold absolute inset-0 border border-[#d2e4ff]">
                                                        {review.learner_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {review.learner_avatar_url && (
                                                        <img 
                                                            src={review.learner_avatar_url} 
                                                            alt={review.learner_name} 
                                                            className="w-10 h-10 rounded-full object-cover absolute inset-0 z-10 border border-[#e0e3e5]"
                                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#181c1e] text-sm">{review.learner_name}</h4>
                                                    <p className="text-xs text-[#74777f] mt-0.5">Class: {review.course_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:items-end gap-1">
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star 
                                                            key={star} 
                                                            className={`w-4 h-4 ${star <= review.rating ? 'fill-[#fbbc04] text-[#fbbc04]' : 'fill-[#e0e3e5] text-[#e0e3e5]'}`} 
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-[#74777f]">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="pl-13 mt-1">
                                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                                <summary className="cursor-pointer text-sm font-medium text-[#0061a5] flex items-center gap-1 hover:underline list-none w-fit">
                                                    <span>Read review content</span>
                                                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </summary>
                                                <div className="mt-3 p-4 border border-[#e0e3e5] rounded-xl text-sm text-[#43474e] bg-[#f8f9fa] whitespace-pre-wrap wrap-break-word leading-relaxed">
                                                    {review.review || <span className="italic text-[#74777f]">No text review provided.</span>}
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 flex flex-col items-center justify-center text-center">
                                    <MessageSquare className="w-8 h-8 text-[#e0e3e5] mb-3" />
                                    <h4 className="text-base font-bold text-[#181c1e] mb-1">No reviews found</h4>
                                    <p className="text-sm text-[#74777f]">Try adjusting your filters or sorting to find what you're looking for.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-[#e0e3e5] flex justify-center items-center gap-2">
                                <button 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e0e3e5] text-[#43474e] hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-[#0061a5] text-white' : 'border border-[#e0e3e5] text-[#43474e] hover:bg-[#f8f9fa]'}`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#e0e3e5] text-[#43474e] hover:bg-[#f8f9fa] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
