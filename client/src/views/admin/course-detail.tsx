import { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Users, Edit, Target, MonitorPlay, Save, X, Image as ImageIcon, Star, Globe, ChevronRight, CheckCircle2, ShieldCheck, MapPin, Ticket } from 'lucide-react';

const AdminCourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState(() => {
        if (id === 'new') {
            return {
                title: '',
                code: '',
                category: '',
                status: 'Draft',
                description: '',
                duration: '',
                sessions: '',
                maxSize: '',
                format: '',
                targetBand: '',
                price: '',
                originalPrice: '',
                nextCohort: '',
                imageUrl: '',
                modules: []
            };
        }
        return {
            title: 'IELTS Intensive Mastery',
            code: 'IEL-INT-01',
            category: 'Masterclass',
            status: 'Active',
            description: 'A comprehensive, high-intensity preparation course designed to elevate your IELTS band score across all four modules. Ideal for students aiming for Band 7.5+.',
            duration: '12 Weeks',
            sessions: '48',
            maxSize: '15',
            format: 'Offline',
            targetBand: '7.5 - 8.0',
            price: '899,000',
            originalPrice: '1,200,000',
            nextCohort: '15-10-2024',
            imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600&h=400',
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
        };
    });

    const [activeTab, setActiveTab] = useState('syllabus');
    const [isEditing, setIsEditing] = useState(id === 'new' ? true : new URLSearchParams(location.search).get('edit') === 'true');

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // In a real app, you would upload to a server here.
            // For preview, we use createObjectURL.
            const imageUrl = URL.createObjectURL(file);
            setCourseData({ ...courseData, imageUrl });
        }
    };

    const handleModuleChange = (index: number, field: string, value: string) => {
        const newModules = [...courseData.modules];
        newModules[index] = { ...newModules[index], [field]: value };
        setCourseData({ ...courseData, modules: newModules });
    };

    const handleTopicChange = (moduleIndex: number, topicIndex: number, value: string) => {
        const newModules = [...courseData.modules];
        const newTopics = [...newModules[moduleIndex].topics];
        newTopics[topicIndex] = value;
        newModules[moduleIndex] = { ...newModules[moduleIndex], topics: newTopics };
        setCourseData({ ...courseData, modules: newModules });
    };

    const handleAddModule = () => {
        setCourseData({ 
            ...courseData, 
            modules: [...courseData.modules, { title: 'New Module', sessions: '0 Sessions', description: '', topics: [''] }] 
        });
    };

    const handleRemoveModule = (index: number) => {
        const newModules = courseData.modules.filter((_, i) => i !== index);
        setCourseData({ ...courseData, modules: newModules });
    };

    const handleAddTopic = (moduleIndex: number) => {
        const newModules = [...courseData.modules];
        newModules[moduleIndex].topics.push('');
        setCourseData({ ...courseData, modules: newModules });
    };

    const handleRemoveTopic = (moduleIndex: number, topicIndex: number) => {
        const newModules = [...courseData.modules];
        newModules[moduleIndex].topics = newModules[moduleIndex].topics.filter((_, i) => i !== topicIndex);
        setCourseData({ ...courseData, modules: newModules });
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            {/* Header / Edit Toggle */}
            <div className="flex items-center gap-4">
                <Link to="/admin/courses" className="p-2 rounded-full hover:bg-[#e0e3e5] text-[#43474e] transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Course Details</h1>
                <div className="ml-auto flex gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={() => {
                                setIsEditing(false);
                            }} className="flex items-center gap-2 bg-[#f1f4f6] text-[#43474e] px-4 py-2 rounded-xl font-bold hover:bg-[#e0e3e5] transition-colors">
                                <X size={20} />
                                Cancel
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#004d84] transition-colors">
                                <Save size={20} />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#e6f0fa] text-[#0061a5] px-4 py-2 rounded-xl font-bold hover:bg-[#d2e4ff] transition-colors">
                            <Edit size={20} />
                            Edit Course
                        </button>
                    )}
                </div>
            </div>

            {isEditing ? (
                /* EDIT FORM */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] overflow-hidden">
                            <div className="p-6 border-b border-[#e0e3e5] bg-[#f8f9fa]">
                                <label className="block text-[13px] font-bold text-[#43474e] mb-2">Cover Image</label>
                                <div className="flex gap-4 items-start">
                                    {courseData.imageUrl ? (
                                        <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-[#c4c6cf]">
                                            <img src={courseData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => setCourseData({...courseData, imageUrl: ''})} className="absolute top-1 right-1 bg-white/90 text-[#ba1a1a] p-1 rounded-full hover:bg-white transition-colors shadow-sm">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-40 h-24 rounded-lg border-2 border-dashed border-[#c4c6cf] flex flex-col items-center justify-center text-[#74777f] bg-white cursor-pointer hover:border-[#0061a5] hover:text-[#0061a5] transition-colors relative">
                                            <ImageIcon size={24} className="mb-1" />
                                            <span className="text-[12px] font-medium">Upload Image</span>
                                            <input type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-[13px] text-[#74777f] mb-2">Upload a high-quality image to represent this course. Recommended size: 1200x800px (16:9 ratio). Max file size: 5MB.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col mb-6">
                                    <label className="block text-[13px] font-bold text-[#43474e] mb-1">Course Title</label>
                                    <input type="text" name="title" value={courseData.title} onChange={handleChange} className="w-full text-[24px] font-bold text-[#181c1e] px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] mb-4" placeholder="e.g. IELTS Intensive Mastery" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[13px] font-bold text-[#43474e] mb-1">Category</label>
                                            <input type="text" name="category" value={courseData.category} onChange={handleChange} className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]" placeholder="e.g. Masterclass" />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-bold text-[#43474e] mb-1">Status</label>
                                            <select name="status" value={courseData.status} onChange={handleChange as any} className="w-full px-3 py-2 text-[14px] border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] bg-white">
                                                <option value="Active">Active (Public)</option>
                                                <option value="Hidden">Hidden (Private)</option>
                                                <option value="Draft">Draft (Unpublished)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <textarea name="description" value={courseData.description} onChange={handleChange} className="w-full text-[#43474e] leading-relaxed p-3 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] min-h-[100px]" placeholder="Course Description"></textarea>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                                        <Clock className="text-[#0061a5] mb-2" size={24} />
                                        <h4 className="text-[12px] text-[#74777f] font-bold uppercase mb-1">Duration</h4>
                                        <input type="text" name="duration" value={courseData.duration} onChange={handleChange} className="w-full text-[14px] font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]" />
                                    </div>
                                    <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                                        <BookOpen className="text-[#0061a5] mb-2" size={24} />
                                        <h4 className="text-[12px] text-[#74777f] font-bold uppercase mb-1">Sessions</h4>
                                        <div className="flex items-center gap-1">
                                            <input type="number" name="sessions" value={courseData.sessions} onChange={handleChange} className="w-16 text-[14px] font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]" />
                                            <span className="text-[12px] font-bold text-[#74777f]">Total</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                                        <Globe className="text-[#0061a5] mb-2" size={24} />
                                        <h4 className="text-[12px] text-[#74777f] font-bold uppercase mb-1">Format</h4>
                                        <div className="flex items-center gap-1">
                                            <input type="text" name="format" value={courseData.format} onChange={handleChange} className="w-full text-[14px] font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]" />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                                        <Target className="text-[#0061a5] mb-2" size={24} />
                                        <h4 className="text-[12px] text-[#74777f] font-bold uppercase mb-1">Target</h4>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[14px] font-bold text-[#74777f]">IELTS</span>
                                            <input type="text" name="targetBand" value={courseData.targetBand} onChange={handleChange} className="flex-1 text-[14px] font-bold text-[#181c1e] p-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[18px] font-bold text-[#181c1e]">Course Modules</h3>
                                <button onClick={handleAddModule} className="text-[14px] text-[#0061a5] font-bold hover:underline">+ Add Module</button>
                            </div>
                            <div className="space-y-6">
                                {courseData.modules.map((module, mIndex) => (
                                    <div key={mIndex} className="p-4 border border-[#e0e3e5] rounded-xl bg-[#f7fafc]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3 w-full pr-4">
                                                <div className="w-8 h-8 bg-[#0061a5] text-white rounded-full flex items-center justify-center font-bold shrink-0">{mIndex + 1}</div>
                                                <input type="text" value={module.title} onChange={(e) => handleModuleChange(mIndex, 'title', e.target.value)} className="flex-1 font-bold text-[#181c1e] px-3 py-1.5 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]" placeholder="Module Title" />
                                                <input type="text" value={module.sessions} onChange={(e) => handleModuleChange(mIndex, 'sessions', e.target.value)} className="w-28 text-[14px] font-bold text-[#0061a5] px-3 py-1.5 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]" placeholder="12 Sessions" />
                                            </div>
                                            <button onClick={() => handleRemoveModule(mIndex)} className="text-[#ba1a1a] hover:bg-[#fceeee] p-1.5 rounded-lg shrink-0 mt-1">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="pl-11 space-y-4">
                                            <textarea value={module.description} onChange={(e) => handleModuleChange(mIndex, 'description', e.target.value)} className="w-full text-[14px] text-[#43474e] px-3 py-2 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]" placeholder="Module Description" rows={2} />
                                            
                                            <div className="space-y-2">
                                                <div className="text-[13px] font-bold text-[#43474e] mb-2 flex justify-between items-center">
                                                    <span>Key Topics</span>
                                                    <button onClick={() => handleAddTopic(mIndex)} className="text-[#0061a5] hover:underline">+ Add Topic</button>
                                                </div>
                                                {module.topics.map((topic, tIndex) => (
                                                    <div key={tIndex} className="flex items-center gap-2">
                                                        <CheckCircle2 className="text-[#0061a5] w-4 h-4 shrink-0" />
                                                        <input type="text" value={topic} onChange={(e) => handleTopicChange(mIndex, tIndex, e.target.value)} className="flex-1 text-[14px] text-[#181c1e] px-2 py-1 border border-[#c4c6cf] rounded focus:outline-none focus:border-[#0061a5]" placeholder="Topic point" />
                                                        <button onClick={() => handleRemoveTopic(mIndex, tIndex)} className="text-[#ba1a1a] hover:bg-[#fceeee] p-1 rounded shrink-0">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6">
                            <h3 className="text-[18px] font-bold text-[#181c1e] mb-4">Pricing & Cohort</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#43474e] mb-1">Current Price</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[20px] font-bold text-[#0061a5]">$</span>
                                            <input type="number" name="price" value={courseData.price} onChange={handleChange} className="w-full text-[16px] font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#43474e] mb-1">Original Price</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[20px] font-bold text-[#74777f]">$</span>
                                            <input type="text" name="originalPrice" value={courseData.originalPrice} onChange={handleChange} className="w-full text-[16px] font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#43474e] mb-1">Course Starts</label>
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-[#74777f]" size={20} />
                                        <input type="text" name="nextCohort" value={courseData.nextCohort} onChange={handleChange} className="flex-1 text-[14px] font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]" placeholder="15-10-2024" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6">
                            <h3 className="text-[18px] font-bold text-[#181c1e] mb-4">Course Settings</h3>
                            <div>
                                <label className="block text-[13px] font-bold text-[#43474e] mb-1">Max Class Size</label>
                                <div className="flex items-center gap-1">
                                    <input type="number" name="maxSize" value={courseData.maxSize} onChange={handleChange} className="w-full text-[14px] font-bold px-2 py-1.5 border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* PREVIEW/PUBLIC LAYOUT */
                <div className="flex-grow w-full max-w-[1440px] mx-auto pb-4">
                    {/* Course Header Hero Area */}
                    <div className="bg-[#002045] rounded-3xl p-[24px] md:p-[40px] shadow-lg mb-[40px] relative overflow-hidden flex flex-col md:flex-row gap-[40px] items-center">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0061a5] rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        
                        <div className="flex-1 z-10 w-full">
                            <div className="flex flex-wrap gap-2 mb-[16px]">
                                <span className="bg-[#0061a5] text-white text-[13px] font-bold px-3 py-1 rounded-full">{courseData.category || 'Category'}</span>
                                <span className={`text-[13px] font-bold px-3 py-1 rounded-full ${courseData.status === 'Active' ? 'bg-[#e6f4ea] text-[#137333]' : courseData.status === 'Hidden' ? 'bg-[#ffebed] text-[#ba1a1a]' : 'bg-[#f1f4f6] text-[#74777f]'}`}>
                                    {courseData.status}
                                </span>
                                <span className="bg-white/10 text-white text-[13px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> {courseData.duration}
                                </span>
                            </div>
                            <h1 className="text-[32px] md:text-[48px] font-extrabold text-white mb-[16px] leading-tight tracking-tight">{courseData.title}</h1>
                            <p className="text-[18px] text-[#adc7f7] max-w-2xl mb-[32px] leading-relaxed">{courseData.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-[24px] md:gap-[40px] bg-white/5 rounded-2xl p-[24px] border border-white/10 w-fit backdrop-blur-sm">
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-[#adc7f7] uppercase tracking-wider mb-1">Target Band</span>
                                    <span className="text-[24px] font-extrabold text-[#ffd200] flex items-center gap-2">
                                        <Star className="w-6 h-6 fill-[#ffd200]" /> {courseData.targetBand}
                                    </span>
                                </div>
                                <div className="w-px h-12 bg-white/20 hidden md:block"></div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-[#adc7f7] uppercase tracking-wider mb-1">Total Sessions</span>
                                    <span className="text-[24px] font-bold text-white flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-[#adc7f7]" /> {courseData.sessions}
                                    </span>
                                </div>
                                <div className="w-px h-12 bg-white/20 hidden md:block"></div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold text-[#adc7f7] uppercase tracking-wider mb-1">Format</span>
                                    <span className="text-[24px] font-bold text-white flex items-center gap-2">
                                        <Globe className="w-6 h-6 text-[#adc7f7]" /> {courseData.format}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Enrollment Action Box */}
                        <div className="bg-white rounded-2xl p-[32px] shadow-xl w-full md:w-[340px] z-10 flex flex-col border border-[#e0e3e5]">
                            <div className="flex justify-between items-end mb-[16px]">
                                <span className="text-[40px] font-extrabold text-[#002045] leading-none">{courseData.price} đ</span>
                                {courseData.originalPrice && (
                                    <span className="text-[18px] text-[#74777f] line-through font-medium mb-1">{courseData.originalPrice} đ</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 bg-[#f7fafc] rounded-xl p-[16px] mb-[24px] border border-[#e0e3e5]">
                                <Clock className="text-[#0061a5] w-6 h-6" />
                                <div className="text-[14px] text-[#43474e]">
                                    Course starts:<br/>
                                    <span className="font-bold text-[#002045] text-[16px]">{courseData.nextCohort}</span>
                                </div>
                            </div>
                            <button disabled className="w-full bg-[#e0e3e5] text-[#74777f] font-bold py-4 rounded-xl flex justify-center items-center gap-2 mb-4 cursor-not-allowed">
                                Enroll Now (Preview)
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
                                    
                                    {courseData.modules && courseData.modules.map((module, index) => (
                                        <div key={index} className={`bg-white border border-[#c4c6cf] rounded-2xl overflow-hidden shadow-sm ${index > 0 ? 'opacity-70' : ''}`}>
                                            <div className="bg-[#f7fafc] px-[24px] py-[16px] flex justify-between items-center border-b border-[#e0e3e5]">
                                                <div className="flex items-center gap-[16px]">
                                                    <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[14px] ${index === 0 ? 'bg-[#0061a5] text-white' : 'bg-[#e0e3e5] text-[#43474e]'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <h3 className={`text-[18px] font-bold ${index === 0 ? 'text-[#002045]' : 'text-[#43474e]'}`}>{module.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-[16px]">
                                                    <span className={`text-[13px] font-bold px-3 py-1 rounded-full ${index === 0 ? 'text-[#0061a5] bg-[#e6f0fa]' : 'text-[#74777f] bg-white border border-[#c4c6cf]'}`}>
                                                        {module.sessions}
                                                    </span>
                                                </div>
                                            </div>
                                            {index === 0 && (
                                                <div className="p-[24px] flex flex-col gap-[16px]">
                                                    <p className="text-[#43474e]">{module.description}</p>
                                                    <ul className="flex flex-col gap-[12px] mt-[8px]">
                                                        {module.topics.map((topic, tIndex) => (
                                                            <li key={tIndex} className="flex items-start gap-3 text-[#181c1e] font-medium">
                                                                <CheckCircle2 className="text-[#0061a5] w-5 h-5 shrink-0" /> {topic}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {activeTab === 'tutors' && (
                                <div className="flex flex-col gap-[24px] animate-fade-in">
                                    <h2 className="text-[24px] font-bold text-[#002045]">Lead Instructors</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px]">
                                        <div className="bg-white border border-[#c4c6cf] rounded-2xl p-[24px] flex gap-[16px] shadow-sm">
                                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200" alt="Tutor" className="w-[80px] h-[80px] rounded-full object-cover shrink-0" />
                                            <div className="flex flex-col">
                                                <h3 className="text-[18px] font-bold text-[#002045]">James Sterling</h3>
                                                <span className="text-[13px] font-bold text-[#0061a5] mb-2 uppercase tracking-wide">Ex-IELTS Examiner</span>
                                                <p className="text-[14px] text-[#43474e] line-clamp-2">Specializes in Advanced Writing Task 2 structure and logic.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {['reviews', 'schedule'].includes(activeTab) && (
                                <div className="flex items-center justify-center h-[200px] bg-white border border-[#e0e3e5] rounded-2xl text-[#74777f] animate-fade-in">
                                    Content for {activeTab} will be available soon.
                                </div>
                            )}
                        </div>

                        {/* Sidebar (Desktop) */}
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
                                            <div className="text-[16px] font-bold text-[#002045]">Max {courseData.maxSize} Students</div>
                                            <div className="text-[14px] text-[#74777f]">Small group focus</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourseDetail;
