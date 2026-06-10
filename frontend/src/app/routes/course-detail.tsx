import { useState, useEffect } from 'react';
import {  BookOpen, Headset, Compass, ArrowRight, Star, CheckCircle2, ChevronRight, Clock, MapPin, Globe, Users, ShieldCheck, Ticket, X } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TopNav } from '@/shared/components/layout/TopNav';

const CourseDetail = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    // Tab state
    const [activeTab, setActiveTab] = useState('syllabus');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);

    const availableClasses = [
        { id: 101, name: 'Class 1', schedule: 'Mon, Wed 18:00 - 20:00', room: 'Room 302', currentStudents: 12, maxStudents: 15 },
        { id: 102, name: 'Class 2', schedule: 'Tue, Thu 19:30 - 21:30', room: 'Room 105', currentStudents: 15, maxStudents: 15 }, // Full
        { id: 103, name: 'Class 3', schedule: 'Sat, Sun 09:00 - 11:00', room: 'Room 204', currentStudents: 8, maxStudents: 15 },
    ];

    interface CourseModule {
        title: string;
        sessions: string;
        description: string;
        topics: string[];
    }

    interface Course {
        id: number;
        title: string;
        band: string;
        duration: string;
        sessions: number;
        format: string;
        type: string;
        price: string;
        originalPrice: string;
        description: string;
        nextCohort: string;
        modules?: CourseModule[];
    }

    // Mock data for the specific courses
    const mockCourses: Record<string, Course> = {
        '1': {
            id: 1, title: 'IELTS Intensive Mastery', band: '7.5 - 8.0', duration: '12 Weeks', sessions: 48, format: 'Offline', type: 'Masterclass', price: '899,000 đ', originalPrice: '1,200,000 đ', description: 'A comprehensive, high-intensity preparation course designed to elevate your IELTS band score across all four modules. Ideal for students aiming for Band 7.5+.', nextCohort: '15-10-2024',
            modules: [
                { 
                    title: 'Listening Mastery', 
                    sessions: '12 Sessions', 
                    description: 'Focus on complex audio inputs, diverse accents, and advanced note-taking strategies under exam conditions.',
                    topics: [
                        'Identifying distractors and signpost words.',
                        'Complex flowchart and map completions.'
                    ]
                },
                {
                    title: 'Reading Comprehension & Speed',
                    sessions: '12 Sessions',
                    description: 'Focus on speed-reading techniques, scanning, and detailed comprehension of academic texts.',
                    topics: [
                        'Skimming for main ideas and scanning for details.',
                        'True/False/Not Given statement analysis.'
                    ]
                }
            ]
        },
        '2': {
            id: 2, title: 'Academic 6.5+', band: '6.5+', duration: '16 Weeks', sessions: 64, format: 'Offline', type: 'Standard', price: '499,000 đ', originalPrice: '699,000 đ', description: 'Perfect for beginners aiming for a solid 6.5 band score. Master grammar and core vocab before diving into formal test strategies.', nextCohort: '20-10-2024'
        },
        '3': {
            id: 3, title: '1-Month Crash Course', band: '6.0+', duration: '4 Weeks', sessions: 20, format: 'Offline', type: 'Intensive', price: '350,000 đ', originalPrice: '450,000 đ', description: 'Short on time? Intensive 4-week test-taking strategies and daily practice for immediate results in your upcoming exam.', nextCohort: '01-11-2024'
        },
        '4': {
            id: 4, title: 'Foundation English', band: '4.5 - 5.0', duration: '8 Weeks', sessions: 32, format: 'Offline', type: 'Beginner', price: '299,000 đ', originalPrice: '400,000 đ', description: 'Build a strong English foundation focusing on daily communication, basic grammar, and general listening skills.', nextCohort: '05-11-2024'
        }
    };

    const course = id ? (mockCourses[id] || mockCourses['1']) : mockCourses['1'];

    const handleConfirmEnrollment = () => {
        if (!selectedClass) return;
        const clsInfo = availableClasses.find(c => c.id === selectedClass);
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            navigate('/learner/payments/new/checkout', { state: { course, class: clsInfo } });
        }
    };

    return (
        <div className="bg-[#f7fafc] text-[#181c1e] text-[16px] leading-[24px] font-sans min-h-screen flex flex-col">
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 lg:px-[32px] py-[40px]">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[14px] text-[#74777f] mb-[24px]">
                    <Link to="/courses" className="hover:text-[#0061a5] transition-colors">Courses</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#181c1e] font-medium">{course.title}</span>
                </nav>

                {/* Course Header Hero Area */}
                <div className="bg-[#002045] rounded-3xl p-[24px] md:p-[40px] shadow-lg mb-[40px] relative overflow-hidden flex flex-col md:flex-row gap-[40px] items-center">
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0061a5] rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    
                    <div className="flex-1 z-10 w-full">
                        <div className="flex flex-wrap gap-2 mb-[16px]">
                            <span className="bg-[#0061a5] text-white text-[13px] font-bold px-3 py-1 rounded-full">{course.type}</span>
                            <span className="bg-white/10 text-white text-[13px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {course.duration}
                            </span>
                        </div>
                        <h1 className="text-[32px] md:text-[48px] font-extrabold text-white mb-[16px] leading-tight tracking-tight">{course.title}</h1>
                        <p className="text-[18px] text-[#adc7f7] max-w-2xl mb-[32px] leading-relaxed">{course.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-[24px] md:gap-[40px] bg-white/5 rounded-2xl p-[24px] border border-white/10 w-fit backdrop-blur-sm">
                            <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-[#adc7f7] uppercase tracking-wider mb-1">Target Band</span>
                                <span className="text-[24px] font-extrabold text-[#ffd200] flex items-center gap-2">
                                    <Star className="w-6 h-6 fill-[#ffd200]" /> {course.band}
                                </span>
                            </div>
                            <div className="w-px h-12 bg-white/20 hidden md:block"></div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-[#adc7f7] uppercase tracking-wider mb-1">Total Sessions</span>
                                <span className="text-[24px] font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-[#adc7f7]" /> {course.sessions}
                                </span>
                            </div>
                            <div className="w-px h-12 bg-white/20 hidden md:block"></div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-bold text-[#adc7f7] uppercase tracking-wider mb-1">Format</span>
                                <span className="text-[24px] font-bold text-white flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-[#adc7f7]" /> {course.format}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Enrollment Action Box */}
                    <div className="bg-white rounded-2xl p-[32px] shadow-xl w-full md:w-[340px] z-10 flex flex-col border border-[#e0e3e5]">
                        <div className="flex flex-col mb-[24px]">
                            <span className="text-[16px] text-[#74777f] line-through font-medium mb-1">{course.originalPrice}</span>
                            <span className="text-[36px] font-extrabold text-[#002045] leading-none tracking-tight break-words">{course.price}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#f7fafc] rounded-xl p-[16px] mb-[24px] border border-[#e0e3e5]">
                            <Clock className="text-[#0061a5] w-6 h-6" />
                            <div className="text-[14px] text-[#43474e]">
                                Course starts:<br/>
                                <span className="font-bold text-[#002045] text-[16px]">{course.nextCohort}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-[#0061a5] text-white font-bold py-4 rounded-xl shadow-md hover:bg-[#004a80] hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mb-4"
                        >
                            Enroll Now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-[#74777f]">
                            <ShieldCheck className="w-4 h-4 text-[#0061a5]" /> 14-day money-back guarantee
                        </div>
                    </div>
                </div>

                {/* Layout Grid: Content + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 flex flex-col gap-[32px]">
                        {/* Tab Navigation */}
                        <div className="border-b border-[#e0e3e5] flex overflow-x-auto hide-scrollbar gap-8">
                            {['syllabus', 'tutors', 'reviews', 'schedule'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-[16px] text-[16px] font-bold capitalize whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-[#0061a5]' : 'text-[#74777f] hover:text-[#002045]'}`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0061a5] rounded-t-full"></div>}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'syllabus' && (
                            <div className="flex flex-col gap-[24px] animate-fade-in">
                                <h2 className="text-[24px] font-bold text-[#002045]">Course Modules</h2>
                                
                                {/* Dynamic Syllabus Content */}
                                <div className="space-y-[16px]">
                                    {course.modules?.map((module, index) => (
                                        <div key={index} className="bg-white border border-[#e0e3e5] rounded-2xl p-[24px] shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-[16px] gap-[12px]">
                                                <h3 className="text-[20px] font-bold text-[#002045] flex items-center gap-3">
                                                    <div className="w-[32px] h-[32px] rounded-full bg-[#e6f0fa] text-[#0061a5] flex items-center justify-center text-[14px]">
                                                        {index + 1}
                                                    </div>
                                                    {module.title}
                                                </h3>
                                                <span className="bg-[#f7fafc] text-[#43474e] text-[13px] font-bold px-3 py-1 rounded-full border border-[#e0e3e5] whitespace-nowrap w-fit">
                                                    {module.sessions}
                                                </span>
                                            </div>
                                            <p className="text-[#43474e] mb-[16px] leading-relaxed">
                                                {module.description}
                                            </p>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                                                {module.topics?.map((topic, tIndex) => (
                                                    <li key={tIndex} className="flex items-start gap-2">
                                                        <CheckCircle2 className="w-5 h-5 text-[#0061a5] shrink-0 mt-0.5" />
                                                        <span className="text-[#43474e]">{topic}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'tutors' && (
                            <div className="flex flex-col gap-[24px] animate-fade-in">
                                <h2 className="text-[24px] font-bold text-[#002045]">Lead Instructors</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
                                    {/* Tutor 1 */}
                                    <div className="bg-white border border-[#c4c6cf] rounded-2xl p-[24px] flex gap-[16px] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" alt="Tutor" className="w-[80px] h-[80px] rounded-full object-cover shrink-0" />
                                        <div className="flex flex-col">
                                            <h3 className="text-[18px] font-bold text-[#002045]">James Sterling</h3>
                                            <span className="text-[13px] font-bold text-[#0061a5] mb-2 uppercase tracking-wide">Ex-IELTS Examiner</span>
                                            <div className="flex items-center gap-1 text-[13px] font-bold text-[#74777f] mb-2">
                                                <Star className="w-4 h-4 fill-[#ffd200] text-[#ffd200]" /> 4.9 (120 reviews)
                                            </div>
                                            <p className="text-[14px] text-[#43474e] line-clamp-2">Specializes in Advanced Writing Task 2 structure and logic.</p>
                                        </div>
                                    </div>
                                    {/* Tutor 2 */}
                                    <div className="bg-white border border-[#c4c6cf] rounded-2xl p-[24px] flex gap-[16px] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Tutor" className="w-[80px] h-[80px] rounded-full object-cover shrink-0" />
                                        <div className="flex flex-col">
                                            <h3 className="text-[18px] font-bold text-[#002045]">Dr. Eleanor Vance</h3>
                                            <span className="text-[13px] font-bold text-[#0061a5] mb-2 uppercase tracking-wide">Reading Specialist</span>
                                            <div className="flex items-center gap-1 text-[13px] font-bold text-[#74777f] mb-2">
                                                <Star className="w-4 h-4 fill-[#ffd200] text-[#ffd200]" /> 4.9 (95 reviews)
                                            </div>
                                            <p className="text-[14px] text-[#43474e] line-clamp-2">Focuses on critical thinking and complex text analysis.</p>
                                        </div>
                                    </div>
                                    {/* Tutor 3 */}
                                    <div className="bg-white border border-[#c4c6cf] rounded-2xl p-[24px] flex gap-[16px] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" alt="Tutor" className="w-[80px] h-[80px] rounded-full object-cover shrink-0" />
                                        <div className="flex flex-col">
                                            <h3 className="text-[18px] font-bold text-[#002045]">Sophia Chen</h3>
                                            <span className="text-[13px] font-bold text-[#0061a5] mb-2 uppercase tracking-wide">Speaking Coach</span>
                                            <div className="flex items-center gap-1 text-[13px] font-bold text-[#74777f] mb-2">
                                                <Star className="w-4 h-4 fill-[#ffd200] text-[#ffd200]" /> 5.0 (210 reviews)
                                            </div>
                                            <p className="text-[14px] text-[#43474e] line-clamp-2">Helps students achieve natural fluency and pronunciation.</p>
                                        </div>
                                    </div>
                                    {/* Tutor 4 */}
                                    <div className="bg-white border border-[#c4c6cf] rounded-2xl p-[24px] flex gap-[16px] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200" alt="Tutor" className="w-[80px] h-[80px] rounded-full object-cover shrink-0" />
                                        <div className="flex flex-col">
                                            <h3 className="text-[18px] font-bold text-[#002045]">Michael Chang</h3>
                                            <span className="text-[13px] font-bold text-[#0061a5] mb-2 uppercase tracking-wide">Listening Master</span>
                                            <div className="flex items-center gap-1 text-[13px] font-bold text-[#74777f] mb-2">
                                                <Star className="w-4 h-4 fill-[#ffd200] text-[#ffd200]" /> 4.8 (88 reviews)
                                            </div>
                                            <p className="text-[14px] text-[#43474e] line-clamp-2">Expert in breaking down fast-paced native accents.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Other tabs can remain empty for now */}
                        {['reviews', 'schedule'].includes(activeTab) && (
                            <div className="flex items-center justify-center h-[200px] bg-white border border-[#e0e3e5] rounded-2xl text-[#74777f] animate-fade-in">
                                Content for {activeTab} will be available soon.
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Desktop) / Bottom section (Mobile) */}
                    <aside className="lg:col-span-4 flex flex-col gap-[24px]">
                        {/* Key Information Card */}
                        <div className="bg-white border border-[#c4c6cf] rounded-2xl p-[24px] shadow-sm">
                            <h3 className="text-[18px] font-bold text-[#002045] border-b border-[#e0e3e5] pb-[16px] mb-[24px]">Course Details</h3>
                            
                            <div className="flex flex-col gap-[20px]">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#f1f4f6] p-2 rounded-lg text-[#0061a5]">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-bold text-[#002045]">London Center / Online</div>
                                        <div className="text-[14px] text-[#74777f]">Hybrid delivery model</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#f1f4f6] p-2 rounded-lg text-[#0061a5]">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-bold text-[#002045]">English</div>
                                        <div className="text-[14px] text-[#74777f]">Instruction language</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#f1f4f6] p-2 rounded-lg text-[#0061a5]">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-bold text-[#002045]">Max 15 Students</div>
                                        <div className="text-[14px] text-[#74777f]">Small group focus</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promotional / Promo Code Box */}
                        <div className="bg-[#002045] rounded-2xl p-[24px] shadow-sm text-white">
                            <h3 className="text-[18px] font-bold mb-[16px] flex items-center gap-2">
                                <Ticket className="text-[#ffd200]" /> Apply Promo Code
                            </h3>
                            <div className="flex gap-2">
                                <input 
                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#adc7f7] placeholder:text-white/50" 
                                    placeholder="Enter code" 
                                    type="text" 
                                />
                                <button className="bg-white text-[#002045] font-bold px-6 py-3 rounded-xl hover:bg-[#f1f4f6] transition-colors">Apply</button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Footer Component */}
            <footer className="bg-[#00142d] text-[#f1f4f6] w-full pt-[80px] pb-[40px] border-t-4 border-[#0061a5] mt-auto">
                <div className="max-w-[1200px] mx-auto px-4 lg:px-[32px] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-[40px] lg:gap-[32px]">
                    <div className="col-span-1 md:col-span-3 lg:col-span-5 flex flex-col items-start">
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
                    
                    <div className="col-span-1 lg:col-span-4">
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
                    
                    <div className="col-span-1 lg:col-span-3">
                        <h4 className="text-[16px] font-bold text-white mb-[24px] uppercase tracking-wider">Explore</h4>
                        <div className="flex flex-col gap-[16px]">
                            <a href="/homepage#about" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">About ICMS</a>
                            <a href="/homepage#tutors" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Our Tutors</a>
                            <a href="/homepage#stories" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Success Stories</a>
                            <a href="/homepage#consultation" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Free Consultation</a>
                        </div>
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

            {/* Class Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#002045]/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-[32px] border-b border-[#e0e3e5] flex justify-between items-start bg-white">
                            <div>
                                <h3 className="text-[24px] font-extrabold text-[#002045] mb-2">Select a Class</h3>
                                <p className="text-[15px] text-[#74777f]">Choose a schedule that fits you for <strong className="text-[#0061a5]">{course.title}</strong>.</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-[#f1f4f6] text-[#43474e] transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-[24px] overflow-y-auto bg-[#f7fafc] flex justify-center">
                            <div className="w-full bg-white border border-[#e0e3e5] rounded-2xl overflow-hidden shadow-sm">
                                {availableClasses.map((cls, index) => {
                                    const isFull = cls.currentStudents >= cls.maxStudents;
                                    const isSelected = selectedClass === cls.id;
                                    const isLast = index === availableClasses.length - 1;
                                    
                                    return (
                                    <div 
                                        key={cls.id}
                                        onClick={() => !isFull && setSelectedClass(cls.id)}
                                        className={`flex items-center justify-between p-[16px] md:p-[20px] transition-all duration-200 
                                            ${!isLast ? 'border-b border-[#e0e3e5]' : ''}
                                            ${isFull 
                                                ? 'opacity-60 bg-[#f7fafc] cursor-not-allowed' 
                                                : isSelected 
                                                    ? 'bg-[#f0f7ff] cursor-pointer' 
                                                    : 'hover:bg-[#f1f4f6] cursor-pointer'
                                            }`}
                                    >
                                        <div className="flex items-center gap-[16px]">
                                            {/* Custom Radio */}
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                ${isSelected ? 'border-[#0061a5]' : isFull ? 'border-[#c4c6cf]' : 'border-[#74777f] group-hover:border-[#0061a5]'}`}>
                                                {isSelected && <div className="w-3 h-3 bg-[#0061a5] rounded-full"></div>}
                                            </div>

                                            {/* Info */}
                                            <div className="flex flex-col">
                                                <span className={`font-bold text-[16px] mb-1 ${isSelected ? 'text-[#0061a5]' : isFull ? 'text-[#74777f]' : 'text-[#002045]'}`}>
                                                    {cls.name}
                                                </span>
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-[14px] text-[#43474e]">
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                        <Clock className="w-4 h-4 text-[#74777f]" /> {cls.schedule}
                                                    </span>
                                                    <span className="hidden md:block w-1 h-1 rounded-full bg-[#c4c6cf]"></span>
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                        <MapPin className="w-4 h-4 text-[#74777f]" /> {cls.room}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center justify-end min-w-[100px]">
                                            {isFull ? (
                                                <span className="text-[12px] font-bold bg-[#ffebee] text-[#c62828] px-3 py-1 rounded-full border border-[#ffcdd2]">
                                                    Full
                                                </span>
                                            ) : (
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-[13px] font-bold ${isSelected ? 'text-[#0061a5]' : 'text-[#43474e]'}`}>
                                                        {cls.currentStudents} / {cls.maxStudents}
                                                    </span>
                                                    <span className="text-[11px] text-[#74777f] font-medium">Students</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-[24px] border-t border-[#e0e3e5] bg-white flex justify-end gap-[16px]">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-3 rounded-xl font-bold text-[#43474e] hover:bg-[#f1f4f6] transition-colors text-[15px]"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmEnrollment}
                                disabled={!selectedClass}
                                className={`px-10 py-3 rounded-xl font-bold text-white transition-all text-[16px] shadow-sm flex items-center gap-2 ${selectedClass ? 'bg-[#0061a5] hover:bg-[#004a80] hover:shadow-md' : 'bg-[#c4c6cf] cursor-not-allowed'}`}
                            >
                                Confirm Selection <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
