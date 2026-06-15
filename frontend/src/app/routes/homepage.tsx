import { useState, useEffect } from 'react';
import { ArrowRight, Clock, Headset, Trophy, Star, BookOpen, Compass, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopNav } from '@/shared/components/layout/TopNav';
import Cookies from 'js-cookie';
import { ConsultationsService } from '@/features/staff/services/consultations.service';
import { showAlertModal } from '@/utils/modal';
import axios from 'axios';
interface UserInfo {
    role?: 'learner' | 'tutor' | 'staff' | 'admin';
    name?: string;
    email?: string;
    [key: string]: unknown;
}

function parseUserFromCookies(): { loggedIn: boolean; role: 'learner' | 'tutor' | 'staff' | 'admin'; info: UserInfo | null } {
    const token = Cookies.get('access_token');
    const userStr = Cookies.get('user_info');
    if (token && userStr) {
        try {
            const user = JSON.parse(userStr) as UserInfo;
            const role = (user.role ?? 'learner').toLowerCase() as 'learner' | 'tutor' | 'staff' | 'admin';
            return { loggedIn: true, role, info: user };
        } catch {
            // invalid JSON in cookie
        }
    }
    return { loggedIn: false, role: 'learner', info: null };
}

const marqueeStyles = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 50s linear infinite;
  display: flex;
  width: max-content;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
`;

const Homepage = () => {
    // Auth state initialized synchronously from cookies (no useEffect needed)
    const [{ loggedIn: isLoggedIn, role: userRole, info: userInfo }] = useState(parseUserFromCookies);
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses');
                setCourses((response.data.data || []).slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        fetchCourses();
    }, []);

    const [formData, setFormData] = useState({ guest_name: '', guest_phone: '', guest_email: '', course: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConsultationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.guest_name || !formData.guest_phone) return;
        
        setIsSubmitting(true);
        try {
            const inquiry_details = formData.course 
                ? `Course Interest: ${formData.course}\nMessage: ${formData.message}` 
                : formData.message;
            
            await ConsultationsService.createPublicConsultation({
                guest_name: formData.guest_name,
                guest_phone: formData.guest_phone,
                guest_email: formData.guest_email,
                inquiry_details: inquiry_details.trim() || 'General Consultation'
            });
            showAlertModal('Success', 'Thank you! Your consultation request has been sent. We will contact you shortly.', 'success');
            setFormData({ guest_name: '', guest_phone: '', guest_email: '', course: '', message: '' });
        } catch (error) {
            console.error(error);
            showAlertModal('Error', 'An error occurred while sending the request. Please try again later.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const tutors = [
        { name: "Dr. Eleanor Vance", ielts: "9.0", role: "Former IELTS Examiner", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" },
        { name: "James Sterling", ielts: "8.5", role: "Speaking Specialist", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" },
        { name: "Sophia Chen", ielts: "8.5", role: "Writing & Reading Expert", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200" },
        { name: "Michael Chang", ielts: "8.5", role: "Listening Master", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200" },
        { name: "Emma Thompson", ielts: "9.0", role: "Academic Writing Lead", img: "https://images.unsplash.com/photo-1598550874175-4d0ef43ce902?auto=format&fit=crop&q=80&w=200&h=200" },
        { name: "David Miller", ielts: "8.5", role: "General Training Pro", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200" },
    ];
    // Duplicate for seamless loop
    const marqueeTutors = [...tutors, ...tutors];

    return (
        <div className="bg-[#f7fafc] text-[#181c1e] text-base leading-6 font-sans min-h-screen flex flex-col">
            <style>{marqueeStyles}</style>
            <TopNav isLoggedIn={isLoggedIn} userRole={userRole} userInfo={userInfo || undefined} />

            <main className="grow">
                {/* Hero Section */}
                <section id="about" className="relative w-full py-20 lg:py-30 flex items-center justify-center overflow-hidden bg-[#f7fafc]">
                    {/* Background decorations instead of full image */}
                    <div className="absolute top-0 right-0 w-150 h-150 bg-[#d2e4ff] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#0061a5] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 opacity-10"></div>
                    
                    <div className="relative z-10 w-full max-w-360 mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 flex flex-col items-start text-left">
                            <span className="px-4 py-1.5 bg-[#d6e3ff] text-[#001b3c] font-bold text-sm rounded-full mb-6 shadow-sm inline-flex items-center gap-2 border border-[#adc7f7]">
                                <Trophy className="w-4 h-4 text-[#0061a5]" /> Premium IELTS Preparation Center
                            </span>
                            <h1 className="text-5xl lg:text-7xl leading-[1.1] tracking-[-0.02em] font-extrabold text-[#002045] mb-6">
                                Unlock Your Global Potential with <span className="text-[#0061a5]">Expert IELTS</span> Training
                            </h1>
                            <p className="text-lg lg:text-xl leading-[1.6] text-[#43474e] mb-12 max-w-2xl">
                                Join over 10,000 successful students. Expert-led courses, realistic mock exams, and personalized feedback designed to help you secure Band 7.0+ on your first try.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <a href="#consultation" className="px-8 py-4 bg-[#0061a5] text-white rounded-full text-base font-bold hover:bg-[#002045] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
                                    Register for Consultation
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <a href="#courses" className="px-8 py-4 bg-white border-2 border-[#c4c6cf] text-[#002045] rounded-full text-base font-bold hover:border-[#002045] hover:bg-[#f1f4f6] transition-all flex items-center justify-center">
                                    View Featured Courses
                                </a>
                            </div>
                        </div>
                        <div className="flex-1 w-full lg:w-auto mt-10 lg:mt-0 relative group">
                            <div className="absolute inset-0 bg-linear-to-tr from-[#0061a5] to-[#d2e4ff] rounded-[32px] transform rotate-3 scale-105 opacity-20 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500"></div>
                            <img src="/images/hero.png" alt="Students studying" className="relative z-10 w-full h-auto rounded-[32px] shadow-2xl object-cover aspect-4/3 group-hover:-translate-y-2 transition-all duration-500 border-4 border-white" />
                        </div>
                    </div>
                </section>



                {/* Featured Courses */}
                <section id="courses" className="w-full py-25 bg-white border-t border-[#e0e3e5]">
                    <div className="max-w-360 mx-auto px-4 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl font-extrabold text-[#002045] mb-4">Popular IELTS Courses</h2>
                                <p className="text-lg text-[#43474e]">Choose the pathway that matches your current proficiency and target band.</p>
                            </div>
                            <Link to="/courses" className="mt-6 md:mt-0 text-[#0061a5] font-bold text-base hover:underline flex items-center gap-2">
                                Browse All Courses <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {courses.map(course => (
                                <div key={course.id} className="bg-[#f7fafc] rounded-2xl shadow-sm border border-[#e0e3e5] hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={course.image_url || '/images/course1.png'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-[#d2e4ff] text-[#001d37] rounded-full text-[12px] font-bold shadow-sm">{course.category || 'Popular'}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col grow">
                                        <h3 className="text-[20px] font-bold text-[#002045] mb-3">{course.title}</h3>
                                        <p className="text-[14px] text-[#43474e] mb-6 grow line-clamp-2">{course.description}</p>
                                        <div className="bg-white rounded-xl p-4 mb-6 border border-[#e0e3e5] flex flex-col gap-2 shadow-sm text-[14px]">
                                            <div className="flex justify-between"><span className="text-[#43474e]">Duration</span><span className="font-bold text-[#002045]">{course.duration}</span></div>
                                            <div className="flex justify-between"><span className="text-[#43474e]">Target</span><span className="font-bold text-[#0061a5]">{course.band}</span></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[20px] font-bold text-[#002045]">{course.price ? `${course.price} đ` : 'Free'}</span>
                                            <Link to={`/courses/${course.id}`} className="text-[#0061a5] font-bold hover:underline flex items-center gap-1">Details <ArrowRight className="w-4 h-4"/></Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Elite Instructors Marquee Section */}
                <section id="tutors" className="w-full py-20 bg-white overflow-hidden border-y border-[#e0e3e5]">
                    <div className="max-w-300 mx-auto px-4 lg:px-8 mb-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#002045] mb-4">Meet Our Elite Instructors</h2>
                        <p className="text-base md:text-lg text-[#43474e] max-w-175 mx-auto">
                            Learn directly from former IELTS examiners and top-tier achievers.
                        </p>
                    </div>
                    
                    <div className="relative w-full overflow-hidden">
                        {/* Gradient fades on edges to make the marquee fade in/out smoothly */}
                        <div className="absolute top-0 left-0 bottom-0 w-25 bg-linear-to-r from-white to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 bottom-0 w-25 bg-linear-to-l from-white to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="animate-marquee gap-8 py-8">
                            {marqueeTutors.map((tutor, idx) => (
                                <div key={idx} className="w-80 shrink-0 bg-white border border-[#e0e3e5] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col">
                                    <div className="w-full h-75 relative overflow-hidden bg-[#f1f4f6]">
                                        <img src={tutor.img} alt={tutor.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                                        
                                        {/* IELTS Badge */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#ffd200] text-[#002045] text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border-2 border-white backdrop-blur-sm">
                                            <Star className="w-4 h-4 fill-[#002045]" />
                                            IELTS {tutor.ielts}
                                        </div>
                                    </div>
                                    
                                    <div className="p-7 pt-6 flex flex-col items-center text-center grow bg-white relative">
                                        <h3 className="text-xl font-extrabold text-[#002045] mb-1.5">{tutor.name}</h3>
                                        <p className="text-xs font-bold text-[#0061a5] mb-4 uppercase tracking-wider">{tutor.role}</p>
                                        <div className="w-10 h-0.75 bg-[#0061a5]/20 mb-4 rounded-full"></div>
                                        <p className="text-sm text-[#43474e] leading-relaxed">
                                            Passionate about helping students unlock their full language potential and achieve target band scores.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Success Stories */}
                <section id="stories" className="w-full py-20 bg-white relative border-t border-[#e0e3e5]">
                    <div className="max-w-360 mx-auto px-4 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002045] mb-4">Success Stories</h2>
                            <p className="text-base text-[#43474e] max-w-2xl mx-auto">See how our students achieved their dream IELTS scores through our structured programs.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Testimonial 1 */}
                            <div className="bg-[#f7fafc] p-8 rounded-2xl border border-[#e0e3e5] relative hover:shadow-lg transition-all">
                                <div className="absolute top-8 right-8 bg-[#0061a5] text-white font-bold px-3 py-1 rounded-full text-sm shadow-sm">8.0 IELTS</div>
                                <Quote className="w-8 h-8 text-[#d2e4ff] mb-4" />
                                <p className="text-[#43474e] text-sm leading-relaxed italic mb-6">"The personalized feedback on my Writing tasks was a game changer. I went from a 6.0 to a 7.5 in writing alone!"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#002045] rounded-full flex items-center justify-center text-white font-bold text-base">TA</div>
                                    <div>
                                        <div className="font-bold text-[#002045]">Tran Anh</div>
                                        <div className="text-xs text-[#43474e]">Masterclass Student</div>
                                    </div>
                                </div>
                            </div>
                            {/* Testimonial 2 */}
                            <div className="bg-[#f7fafc] p-8 rounded-2xl border border-[#e0e3e5] relative hover:shadow-lg transition-all">
                                <div className="absolute top-8 right-8 bg-[#0061a5] text-white font-bold px-3 py-1 rounded-full text-sm shadow-sm">7.5 IELTS</div>
                                <Quote className="w-8 h-8 text-[#d2e4ff] mb-4" />
                                <p className="text-[#43474e] text-sm leading-relaxed italic mb-6">"The mentors are incredibly supportive. The mock exams felt exactly like the real test, which helped reduce my anxiety."</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#0061a5] rounded-full flex items-center justify-center text-white font-bold text-base">ML</div>
                                    <div>
                                        <div className="font-bold text-[#002045]">Minh Ly</div>
                                        <div className="text-xs text-[#43474e]">Academic Fundamentals</div>
                                    </div>
                                </div>
                            </div>
                            {/* Testimonial 3 */}
                            <div className="bg-[#f7fafc] p-8 rounded-2xl border border-[#e0e3e5] relative hover:shadow-lg transition-all">
                                <div className="absolute top-8 right-8 bg-[#0061a5] text-white font-bold px-3 py-1 rounded-full text-sm shadow-sm">7.0 IELTS</div>
                                <Quote className="w-8 h-8 text-[#d2e4ff] mb-4" />
                                <p className="text-[#43474e] text-sm leading-relaxed italic mb-6">"I only had 1 month to prepare. The intensive strategies taught here were exactly what I needed to achieve my target."</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#adc7f7] rounded-full flex items-center justify-center text-[#001d37] font-bold text-base">HN</div>
                                    <div>
                                        <div className="font-bold text-[#002045]">Hoang Nam</div>
                                        <div className="text-xs text-[#43474e]">Crash Course Student</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Consultation Form (Unique ICMS Version) */}
                <section id="consultation" className="w-full py-20 bg-[#0061a5] relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    <div className="absolute top-0 right-0 w-100 h-100 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#002045]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
                    
                    <div className="relative z-10 max-w-300 mx-auto px-4 lg:px-8 flex flex-col lg:flex-row justify-between items-center gap-16">
                        {/* Left Side: Unique ICMS Value Proposition */}
                        <div className="w-full lg:flex-1 text-left text-white">
                            <div className="inline-block bg-[#002045] text-[#adc7f7] text-xs font-bold tracking-widest uppercase px-4 py-2 mb-6 rounded-full shadow-sm">
                                Why Choose ICMS?
                            </div>
                            <h2 className="text-4xl md:text-5xl leading-[1.1] font-extrabold mb-6 text-white">
                                Master IELTS with <br/>
                                <span className="text-[#d2e4ff]">Confidence</span>
                            </h2>
                            <p className="text-base md:text-lg font-medium mb-10 max-w-[90%] text-white/90">
                                Stop guessing and start progressing. Our structured approach is designed to help you achieve your target band score efficiently.
                            </p>
                            
                            <div className="flex flex-col gap-7">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-[#002045] shrink-0 flex items-center justify-center rounded-2xl shadow-md border border-white/10">
                                        <BookOpen className="w-6 h-6 text-[#adc7f7]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white">Proven Framework</h4>
                                        <p className="text-sm text-white/80 mt-1 leading-relaxed">We focus on core academic logic rather than just test tricks, ensuring long-term language proficiency.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-[#002045] shrink-0 flex items-center justify-center rounded-2xl shadow-md border border-white/10">
                                        <Star className="w-6 h-6 text-[#adc7f7]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white">Elite Instructors</h4>
                                        <p className="text-sm text-white/80 mt-1 leading-relaxed">Learn directly from top-tier professionals and experienced former IELTS examiners.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-[#002045] shrink-0 flex items-center justify-center rounded-2xl shadow-md border border-white/10">
                                        <Clock className="w-6 h-6 text-[#adc7f7]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-white">Flexible Learning Tracks</h4>
                                        <p className="text-sm text-white/80 mt-1 leading-relaxed">Whether you have 1 month or 6 months, we build a timeline that seamlessly fits your schedule.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Side: Small Form Box */}
                        <div className="w-full lg:w-105 shrink-0">
                            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-[#e0e3e5]">
                                <h3 className="text-xl font-extrabold text-[#002045] mb-2 text-center">Get Free Advice</h3>
                                <p className="text-center text-xs text-[#43474e] mb-6">Leave your details and we'll be in touch shortly.</p>
                                
                                <form className="flex flex-col gap-4" onSubmit={handleConsultationSubmit}>
                                    <div>
                                        <label className="block text-xs font-bold text-[#002045] mb-1.5 uppercase tracking-wide">Full Name *</label>
                                        <input type="text" className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-sm text-[#181c1e] transition-all" placeholder="John Doe" required value={formData.guest_name} onChange={e => setFormData({...formData, guest_name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#002045] mb-1.5 uppercase tracking-wide">Phone Number *</label>
                                        <input type="tel" className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-sm text-[#181c1e] transition-all" placeholder="09xx xxx xxx" required value={formData.guest_phone} onChange={e => setFormData({...formData, guest_phone: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#002045] mb-1.5 uppercase tracking-wide">Email Address</label>
                                        <input type="email" className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-sm text-[#181c1e] transition-all" placeholder="email@example.com" value={formData.guest_email} onChange={e => setFormData({...formData, guest_email: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#002045] mb-1.5 uppercase tracking-wide">Course of Interest</label>
                                        <select className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-[#43474e] text-sm cursor-pointer transition-all" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})}>
                                            <option value="">Select a Course</option>
                                            <option value="IELTS Masterclass">IELTS Masterclass</option>
                                            <option value="Academic Fundamentals">Academic Fundamentals</option>
                                            <option value="Crash Course">Crash Course</option>
                                            <option value="General Consultation">General Consultation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#002045] mb-1.5 uppercase tracking-wide">Message (Optional)</label>
                                        <textarea rows={2} className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-[#181c1e] text-sm transition-all resize-none" placeholder="Any specific requirements?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-[#002045] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#00142d] hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Component */}
            <footer className="bg-[#00142d] text-[#f1f4f6] w-full pt-20 pb-10 border-t-4 border-[#0061a5]">
                <div className="max-w-300 mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8">
                    
                    {/* Brand & Contact */}
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
                    
                    {/* Courses */}
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
                    
                    {/* Quick Links */}
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
                
                {/* Bottom Bar */}
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

export default Homepage;
