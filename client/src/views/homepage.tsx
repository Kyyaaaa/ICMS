import React, { useState } from 'react';
import { Search, ArrowRight, Clock, Users, Headset, Trophy, CheckCircle2, Star, BookOpen, CalendarCheck, Award, Compass, Quote, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';

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
    // Auth state for demonstration (will be managed by global state/context in reality)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <div className="bg-[#f7fafc] text-[#181c1e] text-[16px] leading-[24px] font-sans min-h-screen flex flex-col">
            <style>{marqueeStyles}</style>
            <TopNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative w-full py-[80px] lg:py-[120px] flex items-center justify-center overflow-hidden bg-[#f7fafc]">
                    {/* Background decorations instead of full image */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d2e4ff] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0061a5] rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 opacity-10"></div>
                    
                    <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 lg:px-[32px] flex flex-col lg:flex-row items-center gap-[64px]">
                        <div className="flex-1 flex flex-col items-start text-left">
                            <span className="px-4 py-1.5 bg-[#d6e3ff] text-[#001b3c] font-bold text-[14px] rounded-full mb-[24px] shadow-sm inline-flex items-center gap-2 border border-[#adc7f7]">
                                <Trophy className="w-4 h-4 text-[#0061a5]" /> Premium IELTS Preparation Center
                            </span>
                            <h1 className="text-[48px] lg:text-[72px] leading-[1.1] tracking-[-0.02em] font-extrabold text-[#002045] mb-[24px]">
                                Unlock Your Global Potential with <span className="text-[#0061a5]">Expert IELTS</span> Training
                            </h1>
                            <p className="text-[18px] lg:text-[22px] leading-[1.6] text-[#43474e] mb-[48px] max-w-2xl">
                                Join over 10,000 successful students. Expert-led courses, realistic mock exams, and personalized feedback designed to help you secure Band 7.0+ on your first try.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto">
                                <a href="#consultation" className="px-8 py-4 bg-[#0061a5] text-white rounded-full text-[16px] font-bold hover:bg-[#002045] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-[12px]">
                                    Register for Consultation
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <a href="#courses" className="px-8 py-4 bg-white border-2 border-[#c4c6cf] text-[#002045] rounded-full text-[16px] font-bold hover:border-[#002045] hover:bg-[#f1f4f6] transition-all flex items-center justify-center">
                                    View Featured Courses
                                </a>
                            </div>
                        </div>
                        <div className="flex-1 w-full lg:w-auto mt-[40px] lg:mt-0 relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0061a5] to-[#d2e4ff] rounded-[32px] transform rotate-3 scale-105 opacity-20 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500"></div>
                            <img src="/images/hero.png" alt="Students studying" className="relative z-10 w-full h-auto rounded-[32px] shadow-2xl object-cover aspect-[4/3] group-hover:-translate-y-2 transition-all duration-500 border-4 border-white" />
                        </div>
                    </div>
                </section>



                {/* Featured Courses */}
                <section id="courses" className="w-full py-[100px] bg-white border-t border-[#e0e3e5]">
                    <div className="max-w-[1440px] mx-auto px-4 lg:px-[32px]">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-[48px]">
                            <div className="max-w-2xl">
                                <h2 className="text-[36px] font-extrabold text-[#002045] mb-[16px]">Popular IELTS Courses</h2>
                                <p className="text-[18px] text-[#43474e]">Choose the pathway that matches your current proficiency and target band.</p>
                            </div>
                            <Link to="/courses" className="mt-6 md:mt-0 text-[#0061a5] font-bold text-[16px] hover:underline flex items-center gap-[8px]">
                                Browse All Courses <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
                            {/* Course Card 1 */}
                            <div className="bg-[#f7fafc] rounded-2xl shadow-sm border border-[#e0e3e5] hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer">
                                <div className="h-48 overflow-hidden relative">
                                    <img src="/images/course1.png" alt="Masterclass" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-[#d2e4ff] text-[#001d37] rounded-full text-[12px] font-bold shadow-sm">Popular</span>
                                    </div>
                                </div>
                                <div className="p-[24px] flex flex-col flex-grow">
                                    <h3 className="text-[20px] font-bold text-[#002045] mb-[12px]">Masterclass 7.5+</h3>
                                    <p className="text-[14px] text-[#43474e] mb-[24px] flex-grow">Advanced strategies for reading, rigorous writing structures, and idiomatic speaking.</p>
                                    <div className="bg-white rounded-xl p-[16px] mb-[24px] border border-[#e0e3e5] flex flex-col gap-2 shadow-sm text-[14px]">
                                        <div className="flex justify-between"><span className="text-[#43474e]">Duration</span><span className="font-bold text-[#002045]">12 Weeks</span></div>
                                        <div className="flex justify-between"><span className="text-[#43474e]">Target</span><span className="font-bold text-[#0061a5]">7.5+</span></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[20px] font-bold text-[#002045]">$899</span>
                                        <Link to="/courses/1" className="text-[#0061a5] font-bold hover:underline flex items-center gap-1">Details <ArrowRight className="w-4 h-4"/></Link>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Course Card 2 */}
                            <div className="bg-[#f7fafc] rounded-2xl shadow-sm border border-[#e0e3e5] hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer">
                                <div className="h-48 overflow-hidden relative">
                                    <img src="/images/course2.png" alt="Academic" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-[#eef1f3] text-[#43474e] rounded-full text-[12px] font-bold shadow-sm">Standard</span>
                                    </div>
                                </div>
                                <div className="p-[24px] flex flex-col flex-grow">
                                    <h3 className="text-[20px] font-bold text-[#002045] mb-[12px]">Academic 6.5+</h3>
                                    <p className="text-[14px] text-[#43474e] mb-[24px] flex-grow">Perfect for beginners aiming for a solid 6.5 band score. Master grammar and core vocab.</p>
                                    <div className="bg-white rounded-xl p-[16px] mb-[24px] border border-[#e0e3e5] flex flex-col gap-2 shadow-sm text-[14px]">
                                        <div className="flex justify-between"><span className="text-[#43474e]">Duration</span><span className="font-bold text-[#002045]">16 Weeks</span></div>
                                        <div className="flex justify-between"><span className="text-[#43474e]">Target</span><span className="font-bold text-[#0061a5]">6.5+</span></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[20px] font-bold text-[#002045]">$499</span>
                                        <Link to="/courses/2" className="text-[#0061a5] font-bold hover:underline flex items-center gap-1">Details <ArrowRight className="w-4 h-4"/></Link>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Course Card 3 */}
                            <div className="bg-[#f7fafc] rounded-2xl shadow-sm border border-[#e0e3e5] hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer">
                                <div className="h-48 overflow-hidden relative">
                                    <img src="/images/course3.png" alt="Intensive" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-[#ffdad6] text-[#93000a] rounded-full text-[12px] font-bold shadow-sm">Intensive</span>
                                    </div>
                                </div>
                                <div className="p-[24px] flex flex-col flex-grow">
                                    <h3 className="text-[20px] font-bold text-[#002045] mb-[12px]">1-Month Crash Course</h3>
                                    <p className="text-[14px] text-[#43474e] mb-[24px] flex-grow">Short on time? Intensive 4-week test-taking strategies and daily practice for immediate results.</p>
                                    <div className="bg-white rounded-xl p-[16px] mb-[24px] border border-[#e0e3e5] flex flex-col gap-2 shadow-sm text-[14px]">
                                        <div className="flex justify-between"><span className="text-[#43474e]">Duration</span><span className="font-bold text-[#002045]">4 Weeks</span></div>
                                        <div className="flex justify-between"><span className="text-[#43474e]">Target</span><span className="font-bold text-[#0061a5]">6.0+</span></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[20px] font-bold text-[#002045]">$350</span>
                                        <Link to="/courses/3" className="text-[#0061a5] font-bold hover:underline flex items-center gap-1">Details <ArrowRight className="w-4 h-4"/></Link>
                                    </div>
                                </div>
                            </div>

                            {/* Course Card 4 */}
                            <div className="bg-[#f7fafc] rounded-2xl shadow-sm border border-[#e0e3e5] hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden group cursor-pointer">
                                <div className="h-48 overflow-hidden relative">
                                    <img src="/images/course4.png" alt="Foundation" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-[#eef1f3] text-[#43474e] rounded-full text-[12px] font-bold shadow-sm">Beginner</span>
                                    </div>
                                </div>
                                <div className="p-[24px] flex flex-col flex-grow">
                                    <h3 className="text-[20px] font-bold text-[#002045] mb-[12px]">Foundation English</h3>
                                    <p className="text-[14px] text-[#43474e] mb-[24px] flex-grow">Build a strong English foundation before starting formal IELTS preparation.</p>
                                    <div className="bg-white rounded-xl p-[16px] mb-[24px] border border-[#e0e3e5] flex flex-col gap-2 shadow-sm text-[14px]">
                                        <div className="flex justify-between"><span className="text-[#43474e]">Duration</span><span className="font-bold text-[#002045]">8 Weeks</span></div>
                                        <div className="flex justify-between"><span className="text-[#43474e]">Target</span><span className="font-bold text-[#0061a5]">4.5 - 5.0</span></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[20px] font-bold text-[#002045]">$299</span>
                                        <Link to="/courses/4" className="text-[#0061a5] font-bold hover:underline flex items-center gap-1">Details <ArrowRight className="w-4 h-4"/></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Elite Instructors Marquee Section */}
                <section className="w-full py-[80px] bg-white overflow-hidden border-y border-[#e0e3e5]">
                    <div className="max-w-[1200px] mx-auto px-4 lg:px-[32px] mb-[48px] text-center">
                        <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#002045] mb-[16px]">Meet Our Elite Instructors</h2>
                        <p className="text-[16px] md:text-[18px] text-[#43474e] max-w-[700px] mx-auto">
                            Learn directly from former IELTS examiners and top-tier achievers.
                        </p>
                    </div>
                    
                    <div className="relative w-full overflow-hidden">
                        {/* Gradient fades on edges to make the marquee fade in/out smoothly */}
                        <div className="absolute top-0 left-0 bottom-0 w-[100px] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 bottom-0 w-[100px] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="animate-marquee gap-[32px] py-8">
                            {marqueeTutors.map((tutor, idx) => (
                                <div key={idx} className="w-[320px] flex-shrink-0 bg-white border border-[#e0e3e5] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col">
                                    <div className="w-full h-[300px] relative overflow-hidden bg-[#f1f4f6]">
                                        <img src={tutor.img} alt={tutor.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                                        
                                        {/* IELTS Badge */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#ffd200] text-[#002045] text-[14px] font-extrabold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border-2 border-white backdrop-blur-sm">
                                            <Star className="w-4 h-4 fill-[#002045]" />
                                            IELTS {tutor.ielts}
                                        </div>
                                    </div>
                                    
                                    <div className="p-[28px] pt-[24px] flex flex-col items-center text-center flex-grow bg-white relative">
                                        <h3 className="text-[22px] font-extrabold text-[#002045] mb-[6px]">{tutor.name}</h3>
                                        <p className="text-[13px] font-bold text-[#0061a5] mb-[16px] uppercase tracking-wider">{tutor.role}</p>
                                        <div className="w-[40px] h-[3px] bg-[#0061a5]/20 mb-[16px] rounded-full"></div>
                                        <p className="text-[14px] text-[#43474e] leading-relaxed">
                                            Passionate about helping students unlock their full language potential and achieve target band scores.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Success Stories */}
                <section className="w-full py-[80px] bg-white relative border-t border-[#e0e3e5]">
                    <div className="max-w-[1440px] mx-auto px-4 lg:px-[32px]">
                        <div className="text-center mb-[48px]">
                            <h2 className="text-[32px] md:text-[40px] font-extrabold text-[#002045] mb-[16px]">Success Stories</h2>
                            <p className="text-[16px] text-[#43474e] max-w-2xl mx-auto">See how our students achieved their dream IELTS scores through our structured programs.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                            {/* Testimonial 1 */}
                            <div className="bg-[#f7fafc] p-[32px] rounded-2xl border border-[#e0e3e5] relative hover:shadow-lg transition-all">
                                <div className="absolute top-[32px] right-[32px] bg-[#0061a5] text-white font-bold px-3 py-1 rounded-full text-[14px] shadow-sm">8.0 IELTS</div>
                                <Quote className="w-8 h-8 text-[#d2e4ff] mb-[16px]" />
                                <p className="text-[#43474e] text-[15px] leading-relaxed italic mb-[24px]">"The personalized feedback on my Writing tasks was a game changer. I went from a 6.0 to a 7.5 in writing alone!"</p>
                                <div className="flex items-center gap-[16px]">
                                    <div className="w-[48px] h-[48px] bg-[#002045] rounded-full flex items-center justify-center text-white font-bold text-[16px]">TA</div>
                                    <div>
                                        <div className="font-bold text-[#002045]">Tran Anh</div>
                                        <div className="text-[12px] text-[#43474e]">Masterclass Student</div>
                                    </div>
                                </div>
                            </div>
                            {/* Testimonial 2 */}
                            <div className="bg-[#f7fafc] p-[32px] rounded-2xl border border-[#e0e3e5] relative hover:shadow-lg transition-all">
                                <div className="absolute top-[32px] right-[32px] bg-[#0061a5] text-white font-bold px-3 py-1 rounded-full text-[14px] shadow-sm">7.5 IELTS</div>
                                <Quote className="w-8 h-8 text-[#d2e4ff] mb-[16px]" />
                                <p className="text-[#43474e] text-[15px] leading-relaxed italic mb-[24px]">"The mentors are incredibly supportive. The mock exams felt exactly like the real test, which helped reduce my anxiety."</p>
                                <div className="flex items-center gap-[16px]">
                                    <div className="w-[48px] h-[48px] bg-[#0061a5] rounded-full flex items-center justify-center text-white font-bold text-[16px]">ML</div>
                                    <div>
                                        <div className="font-bold text-[#002045]">Minh Ly</div>
                                        <div className="text-[12px] text-[#43474e]">Academic Fundamentals</div>
                                    </div>
                                </div>
                            </div>
                            {/* Testimonial 3 */}
                            <div className="bg-[#f7fafc] p-[32px] rounded-2xl border border-[#e0e3e5] relative hover:shadow-lg transition-all">
                                <div className="absolute top-[32px] right-[32px] bg-[#0061a5] text-white font-bold px-3 py-1 rounded-full text-[14px] shadow-sm">7.0 IELTS</div>
                                <Quote className="w-8 h-8 text-[#d2e4ff] mb-[16px]" />
                                <p className="text-[#43474e] text-[15px] leading-relaxed italic mb-[24px]">"I only had 1 month to prepare. The intensive strategies taught here were exactly what I needed to achieve my target."</p>
                                <div className="flex items-center gap-[16px]">
                                    <div className="w-[48px] h-[48px] bg-[#adc7f7] rounded-full flex items-center justify-center text-[#001d37] font-bold text-[16px]">HN</div>
                                    <div>
                                        <div className="font-bold text-[#002045]">Hoang Nam</div>
                                        <div className="text-[12px] text-[#43474e]">Crash Course Student</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Consultation Form (Unique ICMS Version) */}
                <section id="consultation" className="w-full py-[80px] bg-[#0061a5] relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#002045]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
                    
                    <div className="relative z-10 max-w-[1200px] mx-auto px-4 lg:px-[32px] flex flex-col lg:flex-row justify-between items-center gap-[64px]">
                        {/* Left Side: Unique ICMS Value Proposition */}
                        <div className="w-full lg:flex-1 text-left text-white">
                            <div className="inline-block bg-[#002045] text-[#adc7f7] text-[12px] font-bold tracking-widest uppercase px-4 py-2 mb-[24px] rounded-full shadow-sm">
                                Why Choose ICMS?
                            </div>
                            <h2 className="text-[36px] md:text-[48px] leading-[1.1] font-extrabold mb-[24px] text-white">
                                Master IELTS with <br/>
                                <span className="text-[#d2e4ff]">Confidence</span>
                            </h2>
                            <p className="text-[16px] md:text-[18px] font-medium mb-[40px] max-w-[90%] text-white/90">
                                Stop guessing and start progressing. Our structured approach is designed to help you achieve your target band score efficiently.
                            </p>
                            
                            <div className="flex flex-col gap-[28px]">
                                <div className="flex items-start gap-[20px]">
                                    <div className="w-[48px] h-[48px] bg-[#002045] flex-shrink-0 flex items-center justify-center rounded-2xl shadow-md border border-white/10">
                                        <BookOpen className="w-6 h-6 text-[#adc7f7]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[18px] text-white">Proven Framework</h4>
                                        <p className="text-[14px] text-white/80 mt-1 leading-relaxed">We focus on core academic logic rather than just test tricks, ensuring long-term language proficiency.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-[20px]">
                                    <div className="w-[48px] h-[48px] bg-[#002045] flex-shrink-0 flex items-center justify-center rounded-2xl shadow-md border border-white/10">
                                        <Star className="w-6 h-6 text-[#adc7f7]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[18px] text-white">Elite Instructors</h4>
                                        <p className="text-[14px] text-white/80 mt-1 leading-relaxed">Learn directly from top-tier professionals and experienced former IELTS examiners.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-[20px]">
                                    <div className="w-[48px] h-[48px] bg-[#002045] flex-shrink-0 flex items-center justify-center rounded-2xl shadow-md border border-white/10">
                                        <Clock className="w-6 h-6 text-[#adc7f7]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[18px] text-white">Flexible Learning Tracks</h4>
                                        <p className="text-[14px] text-white/80 mt-1 leading-relaxed">Whether you have 1 month or 6 months, we build a timeline that seamlessly fits your schedule.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Side: Small Form Box */}
                        <div className="w-full lg:w-[420px] flex-shrink-0">
                            <div className="bg-white rounded-2xl p-[32px] shadow-2xl border border-[#e0e3e5]">
                                <h3 className="text-[22px] font-extrabold text-[#002045] mb-[8px] text-center">Get Free Advice</h3>
                                <p className="text-center text-[13px] text-[#43474e] mb-[24px]">Leave your details and we'll be in touch shortly.</p>
                                
                                <form className="flex flex-col gap-[16px]">
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#002045] mb-[6px] uppercase tracking-wide">Full Name *</label>
                                        <input type="text" className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-[14px] text-[#181c1e] transition-all" placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#002045] mb-[6px] uppercase tracking-wide">Phone Number *</label>
                                        <input type="tel" className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-[14px] text-[#181c1e] transition-all" placeholder="09xx xxx xxx" required />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#002045] mb-[6px] uppercase tracking-wide">Email Address</label>
                                        <input type="email" className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-[14px] text-[#181c1e] transition-all" placeholder="email@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#002045] mb-[6px] uppercase tracking-wide">Course of Interest</label>
                                        <select className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-[#43474e] text-[14px] cursor-pointer transition-all">
                                            <option value="">Select a Course</option>
                                            <option value="masterclass">IELTS Masterclass</option>
                                            <option value="academic">Academic Fundamentals</option>
                                            <option value="intensive">Crash Course</option>
                                            <option value="other">General Consultation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#002045] mb-[6px] uppercase tracking-wide">Message (Optional)</label>
                                        <textarea rows={2} className="w-full px-4 py-3 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20 text-[#181c1e] text-[14px] transition-all resize-none" placeholder="Any specific requirements?"></textarea>
                                    </div>
                                    <button type="button" className="w-full py-3 mt-[8px] bg-[#002045] text-white text-[14px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#00142d] hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                        Submit Request
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Component */}
            <footer className="bg-[#00142d] text-[#f1f4f6] w-full pt-[80px] pb-[40px] border-t-4 border-[#0061a5]">
                <div className="max-w-[1200px] mx-auto px-4 lg:px-[32px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-[40px] lg:gap-[32px]">
                    
                    {/* Brand & Contact */}
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
                    
                    {/* Courses */}
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
                    
                    {/* Quick Links */}
                    <div className="col-span-1 lg:col-span-2">
                        <h4 className="text-[16px] font-bold text-white mb-[24px] uppercase tracking-wider">Explore</h4>
                        <div className="flex flex-col gap-[16px]">
                            <a href="#" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">About ICMS</a>
                            <a href="#tutors" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Our Tutors</a>
                            <a href="#stories" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Success Stories</a>
                            <a href="#" className="text-[#a8aeb4] hover:text-[#adc7f7] hover:translate-x-1 transition-all text-[14px]">Mock Tests</a>
                        </div>
                    </div>

                    {/* Newsletter */}
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
                
                {/* Bottom Bar */}
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

export default Homepage;
