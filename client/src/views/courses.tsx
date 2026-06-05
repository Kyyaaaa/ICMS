import { useState, useEffect } from 'react';
import { Search, BookOpen, Headset, Compass, ArrowRight, Filter, Star, Clock, MonitorPlay, Users, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';

const Courses = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock data for courses
    const allCourses = [
        { id: '1', title: 'IELTS Intensive Mastery', band: '7.5+', duration: '12 Weeks', format: 'Offline', category: 'Masterclass', price: '899,000 đ', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600&h=400' },
        { id: '2', title: 'Academic Fundamentals', band: '5.5-6.5', duration: '8 Weeks', format: 'Offline', category: 'Fundamentals', price: '599,000 đ', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600&h=400' },
        { id: '3', title: 'Speaking Boot Camp', band: '7.0+', duration: '4 Weeks', format: 'Offline', category: 'Specialized', price: '299,000 đ', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600&h=400' },
        { id: '4', title: 'Writing Task 2 Accelerator', band: '7.0+', duration: '4 Weeks', format: 'Offline', category: 'Specialized', price: '299,000 đ', image: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=600&h=400' },
        { id: '5', title: 'General Training Crash Course', band: '6.0-7.0', duration: '6 Weeks', format: 'Offline', category: 'General', price: '499,000 đ', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600&h=400' },
        { id: '6', title: '1-on-1 Elite Coaching', band: '8.0+', duration: 'Flexible', format: 'Offline', category: 'Private', price: '120,000 đ/hr', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600&h=400' },
    ];

    // Filter states
    const [selectedBands, setSelectedBands] = useState<string[]>([]);

    const toggleFilter = (state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    // Very basic filtering logic
    const filteredCourses = allCourses.filter(course => {
        const bandMatch = selectedBands.length === 0 || selectedBands.includes(course.band) || (selectedBands.includes('7.0+') && (course.band === '7.5+' || course.band === '8.0+'));
        return bandMatch;
    });

    const bands = ['5.5-6.5', '6.0-7.0', '7.0+', '7.5+', '8.0+'];

    return (
        <div className="bg-[#f7fafc] text-[#181c1e] text-[16px] leading-[24px] font-sans min-h-screen flex flex-col">
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 lg:px-[32px] py-[40px]">
                {/* Hero */}
                <div className="mb-[40px]">
                    <h1 className="text-[40px] font-extrabold text-[#002045] mb-4">Explore Our Courses</h1>
                    <p className="text-[18px] text-[#43474e] max-w-2xl">Discover the perfect path for your IELTS journey. We offer a variety of formats and specializations to help you achieve your target band score.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-[32px]">
                    {/* Filter Sidebar */}
                    <aside className="w-full lg:w-[280px] flex-shrink-0">
                        <div className="bg-white border border-[#c4c6cf] rounded-2xl p-[24px] sticky top-[100px]">
                            <div className="flex items-center gap-2 mb-[24px] pb-[16px] border-b border-[#e0e3e5]">
                                <Filter className="w-5 h-5 text-[#0061a5]" />
                                <h2 className="text-[18px] font-bold text-[#002045]">Filters</h2>
                            </div>

                            {/* Format Filter - Removed since all courses are offline */}

                            {/* Target Band Filter */}
                            <div>
                                <h3 className="text-[16px] font-bold text-[#002045] mb-[12px]">Target Band</h3>
                                <div className="flex flex-col gap-[12px]">
                                    {bands.map(band => (
                                        <label key={band} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 border-2 border-[#c4c6cf] rounded-[6px] appearance-none checked:bg-[#0061a5] checked:border-[#0061a5] transition-colors"
                                                    checked={selectedBands.includes(band)}
                                                    onChange={() => toggleFilter(selectedBands, setSelectedBands, band)}
                                                />
                                                {selectedBands.includes(band) && <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none"><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.00003 7.8L1.20003 5L0.266693 5.93333L4.00003 9.66667L12 1.66667L11.0667 0.733334L4.00003 7.8Z" fill="currentColor"/></svg></div>}
                                            </div>
                                            <span className="text-[15px] text-[#43474e] group-hover:text-[#002045] transition-colors">IELTS {band}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Course Grid */}
                    <div className="flex-1">
                        <div className="mb-[24px] flex justify-between items-center">
                            <span className="text-[#43474e] font-medium">Showing <strong className="text-[#002045]">{filteredCourses.length}</strong> courses</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
                            {filteredCourses.map(course => (
                                <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-[#e0e3e5] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer" onClick={() => navigate(`/courses/${course.id}`)}>
                                    <div className="h-[200px] overflow-hidden relative">
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    </div>
                                    <div className="p-[24px] flex flex-col flex-grow relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-white border border-[#c4c6cf] text-[#43474e] text-[11px] font-bold rounded uppercase tracking-wider">{course.category}</span>
                                                <span className="px-2 py-1 bg-[#0061a5] text-white text-[11px] font-bold rounded uppercase tracking-wider">{course.format}</span>
                                            </div>
                                            <span className="flex items-center gap-1 text-[13px] font-bold text-[#ffd200] bg-[#181c1e] px-2 py-1 rounded">
                                                <Star className="w-3 h-3 fill-[#ffd200]" /> {course.band}
                                            </span>
                                        </div>
                                        <h3 className="text-[20px] font-bold text-[#002045] mb-2 leading-tight group-hover:text-[#0061a5] transition-colors">{course.title}</h3>
                                        
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1.5 text-[13px] text-[#43474e] font-medium">
                                                <Clock className="w-4 h-4 text-[#0061a5]" /> {course.duration}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-[20px] font-extrabold text-[#0061a5]">{course.price}</span>
                                            <span className="text-[14px] font-bold text-[#002045] flex items-center gap-1 group-hover:text-[#0061a5] transition-colors">
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
            <footer className="bg-[#00142d] text-[#f1f4f6] w-full pt-[80px] pb-[40px] border-t-4 border-[#0061a5] mt-auto">
                <div className="max-w-[1200px] mx-auto px-4 lg:px-[32px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[40px] lg:gap-[32px]">
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col items-start">
                        <div className="text-[28px] font-extrabold text-white mb-[20px] flex items-center gap-2">
                            <BookOpen className="w-8 h-8 text-[#adc7f7]" /> ICMS
                        </div>
                        <p className="text-[#a8aeb4] text-[14px] leading-[24px] mb-[24px] max-w-[300px]">
                            Empowering students to achieve their target IELTS band score with proven methodologies and elite instructors.
                        </p>
                        <div className="flex flex-col gap-[12px]">
                            <div className="flex items-center gap-3 text-[#a8aeb4] text-[14px]">
                                <Headset className="w-5 h-5 text-[#adc7f7]" />
                                <span>Hotline: <strong className="text-white">1900 1234</strong></span>
                            </div>
                            <div className="flex items-start gap-3 text-[#a8aeb4] text-[14px]">
                                <Compass className="w-5 h-5 text-[#adc7f7] mt-0.5" />
                                <span>123 Education Street, Tech District,<br/>Hanoi, Vietnam</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-span-1 lg:col-span-3">
                        <h4 className="text-[16px] font-bold text-white mb-[24px] uppercase tracking-wider">Our Programs</h4>
                        <div className="flex flex-col gap-[16px]">
                            <Link to="/courses" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px] flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> IELTS Masterclass
                            </Link>
                            <Link to="/courses" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px] flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> Academic Fundamentals
                            </Link>
                            <Link to="/courses" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px] flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> Intensive Crash Course
                            </Link>
                            <Link to="/courses" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px] flex items-center gap-2">
                                <ArrowRight className="w-4 h-4" /> 1-on-1 Private Tutoring
                            </Link>
                        </div>
                    </div>
                    
                    <div className="col-span-1 lg:col-span-2">
                        <h4 className="text-[16px] font-bold text-white mb-[24px] uppercase tracking-wider">Explore</h4>
                        <div className="flex flex-col gap-[16px]">
                            <a href="#" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">About ICMS</a>
                            <a href="#" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Our Tutors</a>
                            <a href="#" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Success Stories</a>
                            <a href="#" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Mock Tests</a>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <h4 className="text-[16px] font-bold text-white mb-[24px] uppercase tracking-wider">Stay Updated</h4>
                        <p className="text-[#a8aeb4] text-[14px] mb-[16px]">
                            Subscribe to get the latest IELTS tips and exclusive offers.
                        </p>
                        <form className="flex flex-col gap-3">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="w-full px-4 py-3 bg-[#002045] border border-[#43474e] rounded-xl focus:outline-none focus:border-[#adc7f7] text-[14px] text-white"
                            />
                            <button 
                                type="button" 
                                className="w-full py-3 bg-[#0061a5] hover:bg-[#004a80] text-white text-[14px] font-bold rounded-xl transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className="max-w-[1200px] mx-auto px-4 lg:px-[32px] mt-[64px] pt-[32px] border-t border-[#43474e] flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-[14px] text-[#a8aeb4]">
                        © {new Date().getFullYear()} ICMS Education. All rights reserved.
                    </div>
                    <div className="flex gap-[24px]">
                        <a href="#" className="text-[#a8aeb4] hover:text-white text-[14px] transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[#a8aeb4] hover:text-white text-[14px] transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Courses;
