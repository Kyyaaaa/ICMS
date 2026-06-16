import { useState, useEffect } from 'react';
import {  BookOpen, Headset, Compass, ArrowRight, Filter, Star, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TopNav } from '@/shared/components/layout/TopNav';
import Cookies from 'js-cookie';
import type { Course } from '@/shared/types/course';
import { CoursesService } from '@/shared/services/courses.service';

const Courses = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!Cookies.get('access_token') && !!Cookies.get('user_info'));
    const [userInfo] = useState<Record<string, unknown> | undefined>(() => {
        const userStr = Cookies.get('user_info');
        if (userStr) {
            try { return JSON.parse(userStr); } catch { return undefined; }
        }
        return undefined;
    });
    const [userRole] = useState<'learner' | 'tutor' | 'staff' | 'admin'>(() => {
        const userStr = Cookies.get('user_info');
        if (userStr) {
            try { return JSON.parse(userStr).role?.toLowerCase() || 'learner'; } catch { return 'learner'; }
        }
        return 'learner';
    });
    const [courses, setCourses] = useState<Course[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchCourses = async () => {
            try {
                const data = await CoursesService.getCourses();
                const visibleCourses = data.filter((c: Course & { status?: string }) => {
                    const status = String(c.status || '').toLowerCase();
                    return status !== 'draft' && status !== 'hidden';
                });
                setCourses(visibleCourses);
            } catch (e) {
                console.error("Failed to fetch courses:", e);
            } finally {
                // setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Filter states
    const [userMinBand, setUserMinBand] = useState<string>('');
    const [userMaxBand, setUserMaxBand] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

    // Advanced filtering logic
    const filteredCourses = courses.filter(course => {
        let matchCategory = true;
        if (selectedCategory && selectedCategory !== 'All Categories') {
            matchCategory = course.category === selectedCategory;
        }

        let matchBand = true;
        if (userMinBand || userMaxBand) {
            let cMin = 0;
            let cMax = 0;
            if (course.band) {
                const parts = String(course.band).split('-');
                if (parts.length === 2) {
                    cMin = parseFloat(parts[0].trim());
                    cMax = parseFloat(parts[1].trim());
                } else {
                    cMin = parseFloat(parts[0].trim());
                    cMax = cMin;
                }
            }
            
            const filterMin = userMinBand ? parseFloat(userMinBand) : 0;
            const filterMax = userMaxBand ? parseFloat(userMaxBand) : 9.0;
            
            matchBand = cMin >= filterMin && cMax <= filterMax;
        }
        
        return matchCategory && matchBand;
    });

    return (
        <div className="bg-[#f7fafc] text-[#181c1e] text-base leading-6 font-sans min-h-screen flex flex-col">
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userInfo={userInfo} userRole={userRole} />

            {/* Main Content */}
            <main className="grow w-full max-w-360 mx-auto px-4 lg:px-8 py-10">
                {/* Hero */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-[#002045] mb-4">Explore Our Courses</h1>
                    <p className="text-lg text-[#43474e] max-w-2xl">Discover the perfect path for your IELTS journey. We offer a variety of formats and specializations to help you achieve your target band score.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <aside className="w-full lg:w-70 shrink-0">
                        <div className="bg-white border border-[#c4c6cf] rounded-2xl p-6 sticky top-25">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#e0e3e5]">
                                <Filter className="w-5 h-5 text-[#0061a5]" />
                                <h2 className="text-lg font-bold text-[#002045]">Filters</h2>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6 pb-6 border-b border-[#e0e3e5]">
                                <h3 className="text-base font-bold text-[#002045] mb-3">Category</h3>
                                <select 
                                    value={selectedCategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f8f9fa] font-medium border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] focus:bg-white outline-none transition-all"
                                >
                                    <option value="All Categories">All Categories</option>
                                    <option value="Masterclass">Masterclass</option>
                                    <option value="Fundamentals">Fundamentals</option>
                                    <option value="Specialized">Specialized</option>
                                    <option value="General">General</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>

                            {/* Target Band Filter */}
                            <div>
                                <h3 className="text-base font-bold text-[#002045] mb-3">Target Band</h3>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        step="0.5" min="0" max={userMaxBand || "9.0"} 
                                        placeholder="Min"
                                        value={userMinBand} 
                                        onChange={(e) => setUserMinBand(e.target.value)} 
                                        className="w-full px-3 py-2 bg-[#f8f9fa] font-bold text-center border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] focus:bg-white outline-none transition-all" 
                                    />
                                    <span className="font-bold text-[#74777f]">-</span>
                                    <input 
                                        type="number" 
                                        step="0.5" min={userMinBand || "0"} max="9.0" 
                                        placeholder="Max"
                                        value={userMaxBand} 
                                        onChange={(e) => setUserMaxBand(e.target.value)} 
                                        className={`w-full px-3 py-2 bg-[#f8f9fa] font-bold text-center border ${userMinBand && userMaxBand && parseFloat(userMinBand) > parseFloat(userMaxBand) ? 'border-[#ba1a1a]' : 'border-[#c4c6cf] focus:border-[#0061a5]'} rounded-xl focus:bg-white outline-none transition-all`} 
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Course Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex justify-between items-center">
                            <span className="text-[#43474e] font-medium">Showing <strong className="text-[#002045]">{filteredCourses.length}</strong> courses</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredCourses.map(course => (
                                <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-[#e0e3e5] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                                    <div className="relative h-50 overflow-hidden bg-[#e6f0fa]">
                                        {(course as Course & { image_url?: string; image?: string }).image_url || (course as Course & { image_url?: string; image?: string }).image ? (
                                            <img src={(course as Course & { image_url?: string; image?: string }).image_url || (course as Course & { image_url?: string; image?: string }).image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="absolute inset-0 bg-linear-to-br from-[#002045] to-[#0061a5] transition-transform duration-500 group-hover:scale-105"></div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {course.format && <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#002045] shadow-sm">{course.format}</span>}
                                            {course.band && <span className="bg-[#0061a5]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">IELTS {course.band}</span>}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col grow relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="flex items-center gap-1 text-xs font-bold text-[#ffd200] bg-[#181c1e] px-2 py-1 rounded">
                                                <Star className="w-3 h-3 fill-[#ffd200]" /> {course.band}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#002045] mb-2 leading-tight group-hover:text-[#0061a5] transition-colors">{course.title}</h3>
                                        
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1.5 text-xs text-[#43474e] font-medium">
                                                <Clock className="w-4 h-4 text-[#0061a5]" /> {course.duration}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-xl font-extrabold text-[#0061a5]">
                                                {course.price ? new Intl.NumberFormat('vi-VN').format(Number(course.price)) : '0'} đ
                                            </span>
                                            <span className="text-sm font-bold text-[#002045] flex items-center gap-1 group-hover:text-[#0061a5] transition-colors">
                                                View Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Component */}
            <footer className="bg-[#00142d] text-[#f1f4f6] w-full pt-20 pb-10 border-t-4 border-[#0061a5] mt-auto">
                <div className="max-w-300 mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8">
                    <div className="col-span-1 md:col-span-3 lg:col-span-5 flex flex-col items-start">
                        <div className="text-3xl font-extrabold text-white mb-5 flex items-center gap-2">
                            <BookOpen className="w-8 h-8 text-[#adc7f7]" /> ICMS
                        </div>
                        <p className="text-[#a8aeb4] text-sm leading-6 mb-6 max-w-75">
                            Empowering students to achieve their target IELTS band score with proven methodologies and elite instructors.
                        </p>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-[#a8aeb4] text-sm">
                                <Headset className="w-5 h-5 text-[#adc7f7]" />
                                <span>Hotline: <strong className="text-white">1900 1234</strong></span>
                            </div>
                            <div className="flex items-start gap-3 text-[#a8aeb4] text-sm">
                                <Compass className="w-5 h-5 text-[#adc7f7] mt-0.5" />
                                <span>123 Education Street, Tech District,<br/>Hanoi, Vietnam</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-span-1 lg:col-span-4">
                        <h4 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Our Programs</h4>
                        <div className="flex flex-col gap-4">
                            <Link to="/courses" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> IELTS Masterclass
                            </Link>
                            <Link to="/courses" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> Academic Fundamentals
                            </Link>
                            <Link to="/courses" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> Intensive Crash Course
                            </Link>
                            <Link to="/courses" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> 1-on-1 Private Tutoring
                            </Link>
                        </div>
                    </div>
                    
                    <div className="col-span-1 lg:col-span-3">
                        <h4 className="text-base font-bold text-white mb-6 uppercase tracking-wider">Explore</h4>
                        <div className="flex flex-col gap-4">
                            <a href="/homepage#about" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm">About ICMS</a>
                            <a href="/homepage#tutors" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm">Our Tutors</a>
                            <a href="/homepage#stories" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm">Success Stories</a>
                            <a href="/homepage#consultation" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-sm">Free Consultation</a>
                        </div>
                    </div>
                </div>
                
                <div className="max-w-300 mx-auto px-4 lg:px-8 mt-16 pt-8 border-t border-[#43474e] flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-[#a8aeb4]">
                        © {new Date().getFullYear()} ICMS Education. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-[#a8aeb4] hover:text-white text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[#a8aeb4] hover:text-white text-sm transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Courses;
