import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, X, Image as ImageIcon, BookOpen, Clock, Users, Target, Book, AlignLeft, Tags } from 'lucide-react';
import { CoursesService } from '../../../shared/services/courses.service';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        minBand: '6.5',
        maxBand: '7.5',
        duration: 12,
        sessions: 0,
        format: 'Offline',
        category: 'Masterclass',
        type: 'Standard',
        price: '',
        original_price: '',
        description: '',
        next_cohort: '',
        image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600&h=400',
        status: 'Active',
        maxSize: '15'
    });

    const [modules, setModules] = useState([
        { title: '', sessions: 1, description: '', topics: [''] }
    ]);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateStr = tomorrow.toISOString().split('T')[0];

    const calculatedTotalSessions = modules.reduce((acc, mod) => acc + (Number(mod.sessions) || 0), 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploadingImage(true);
            const url = await CoursesService.uploadImage(file);
            if (url) {
                setFormData(prev => ({ ...prev, image_url: url }));
            } else {
                alert('Failed to upload image!');
            }
            setIsUploadingImage(false);
        }
    };

    const handleAddModule = () => {
        setModules(prev => [...prev, { title: '', sessions: 1, description: '', topics: [''] }]);
    };

    const handleModuleChange = (index: number, field: string, value: string) => {
        const newModules = [...modules];
        newModules[index] = { ...newModules[index], [field]: value };
        setModules(newModules);
    };

    const handleAddTopic = (moduleIndex: number) => {
        const newModules = [...modules];
        newModules[moduleIndex].topics.push('');
        setModules(newModules);
    };

    const handleTopicChange = (moduleIndex: number, topicIndex: number, value: string) => {
        const newModules = [...modules];
        newModules[moduleIndex].topics[topicIndex] = value;
        setModules(newModules);
    };

    const handleRemoveTopic = (moduleIndex: number, topicIndex: number) => {
        const newModules = [...modules];
        newModules[moduleIndex].topics.splice(topicIndex, 1);
        setModules(newModules);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (modules.length === 0) {
                alert('At least 1 Course Module is required.');
                setLoading(false);
                return;
            }

            for (let i = 0; i < modules.length; i++) {
                const m = modules[i];
                if (!m.title.trim()) {
                    alert(`Module ${i + 1} requires a Module Title.`);
                    setLoading(false);
                    return;
                }
                if (!m.sessions) {
                    alert(`Module ${i + 1} requires Sessions.`);
                    setLoading(false);
                    return;
                }
                if (m.topics.filter(t => t.trim() !== '').length === 0) {
                    alert(`Module ${i + 1} requires at least 1 Topic.`);
                    setLoading(false);
                    return;
                }
            }

            // Remove empty topics
            const cleanedModules = modules.map(m => ({
                ...m,
                sessions: `${m.sessions} Sessions`,
                topics: m.topics.filter(t => t.trim() !== '')
            }));

            let formattedDate = formData.next_cohort;
            if (formattedDate && formattedDate.includes('-')) {
                const parts = formattedDate.split('-');
                if (parts.length === 3) {
                    formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; // YYYY-MM-DD -> DD/MM/YYYY
                }
            }

            const payload = {
                ...formData,
                next_cohort: formattedDate,
                band: formData.minBand && formData.maxBand ? (formData.minBand === formData.maxBand ? formData.minBand : `${formData.minBand} - ${formData.maxBand}`) : formData.minBand,
                duration: `${formData.duration} Weeks`,
                price: Number(formData.price),
                original_price: Number(formData.original_price),
                max_size: Number(formData.maxSize),
                sessions: calculatedTotalSessions,
                modules: cleanedModules
            };

            await CoursesService.createCourse(payload);
            navigate('/admin/courses');
        } catch (error) {
            console.error(error);
            alert('Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-[#002045]" />
                </button>
                <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">Create New Course</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-[12px] shadow-sm border border-[#e0e3e5] p-6">
                    <h2 className="text-[18px] font-bold text-[#181c1e] mb-6 border-b border-[#e0e3e5] pb-4">Basic Information</h2>
                    
                    <div className="space-y-6">
                        {/* Course Title - Full width */}
                        <div className="flex flex-col">
                            <label className="flex items-center gap-2 text-[14px] font-bold text-[#43474e] mb-2">
                                <Book size={18} className="text-[#0061a5]" /> Course Title <span className="text-[#ba1a1a]">*</span>
                            </label>
                            <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full text-[18px] font-bold text-[#181c1e] px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] focus:bg-white focus:ring-1 focus:ring-[#0061a5] outline-none transition-all" placeholder="e.g. IELTS Intensive Mastery" />
                        </div>

                        {/* Flex row for Category and Target Band */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-[14px] font-bold text-[#43474e] mb-2">
                                    <Tags size={18} className="text-[#0061a5]" /> Category
                                </label>
                                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#f8f9fa] font-medium border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] focus:bg-white outline-none transition-all">
                                    <option>Masterclass</option>
                                    <option>Fundamentals</option>
                                    <option>Specialized</option>
                                    <option>General</option>
                                    <option>Private</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 text-[14px] font-bold text-[#43474e] mb-2">
                                    <Target size={18} className="text-[#0061a5]" /> Target Band <span className="text-[#ba1a1a]">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-[14px] font-bold text-[#74777f] bg-[#f1f4f6] px-3 py-3 rounded-lg border border-[#e0e3e5]">IELTS</span>
                                    <input type="number" step="0.5" min="0" max="9.0" required name="minBand" value={formData.minBand} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#f8f9fa] font-bold text-center border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] focus:bg-white outline-none transition-all" />
                                    <span className="font-bold text-[#74777f]">-</span>
                                    <input type="number" step="0.5" min="0" max="9.0" required name="maxBand" value={formData.maxBand} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#f8f9fa] font-bold text-center border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] focus:bg-white outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Stats grid, similar to the edit view */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5] hover:border-[#c4c6cf] transition-colors">
                                <Clock className="text-[#0061a5] mb-2" size={24} />
                                <h4 className="text-[12px] text-[#74777f] font-bold uppercase mb-2">Duration</h4>
                                <div className="flex items-center gap-2">
                                    <input type="number" min="1" name="duration" value={formData.duration} onChange={handleInputChange} className="w-20 px-3 py-2 text-[16px] font-bold text-[#181c1e] bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]" placeholder="12" />
                                    <span className="text-[14px] font-bold text-[#74777f]">Weeks</span>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5] hover:border-[#c4c6cf] transition-colors">
                                <Users className="text-[#0061a5] mb-2" size={24} />
                                <h4 className="text-[12px] text-[#74777f] font-bold uppercase mb-2">Max Students</h4>
                                <div className="flex items-center gap-2">
                                    <input type="number" min="1" name="maxSize" value={formData.maxSize} onChange={handleInputChange} className="w-20 px-3 py-2 text-[16px] font-bold text-[#181c1e] bg-white border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5]" placeholder="15" />
                                    <span className="text-[14px] font-bold text-[#74777f]">/ Class</span>
                                </div>
                            </div>

                            <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e3e5]">
                                <BookOpen className="text-[#0061a5] mb-2" size={24} />
                                <h4 className="text-[12px] text-[#74777f] font-bold uppercase mb-2">Total Sessions</h4>
                                <div className="flex items-center gap-2">
                                    <input type="text" readOnly value={calculatedTotalSessions} className="w-20 px-3 py-2 text-[16px] font-bold text-[#43474e] bg-[#e0e3e5] border border-[#c4c6cf] rounded-lg cursor-not-allowed outline-none" />
                                    <span className="text-[14px] font-bold text-[#74777f]">Sessions</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-2 text-[14px] font-bold text-[#43474e] mb-2">
                                <AlignLeft size={18} className="text-[#0061a5]" /> Description
                            </label>
                            <textarea rows={4} name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] focus:bg-white focus:ring-1 focus:ring-[#0061a5] outline-none transition-all resize-none text-[#181c1e] leading-relaxed" placeholder="Write a compelling description for this course..."></textarea>
                        </div>
                    </div>
                </div>

                {/* Pricing & Display */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e5]">
                    <h2 className="text-[18px] font-bold text-[#002045] mb-4">Pricing & Display</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[14px] font-bold text-[#43474e] mb-1">Price (VND) *</label>
                            <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#43474e] mb-1">Original Price (VND) *</label>
                            <input required type="number" name="original_price" value={formData.original_price} onChange={handleInputChange} className={`w-full px-4 py-2 bg-[#f7fafc] border ${formData.price && formData.original_price && Number(formData.original_price) < Number(formData.price) ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]' : 'border-[#c4c6cf] focus:border-[#0061a5]'} rounded-xl outline-none transition-all`} />
                            {formData.price && formData.original_price && Number(formData.original_price) < Number(formData.price) && (
                                <p className="text-[#ba1a1a] text-[13px] font-medium mt-1">Note: Original Price should be greater than Price.</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#43474e] mb-1">Next Cohort *</label>
                            <input required type="date" min={minDateStr} name="next_cohort" value={formData.next_cohort} onChange={handleInputChange} className="w-full px-4 py-2 bg-[#f7fafc] border border-[#c4c6cf] rounded-xl focus:border-[#0061a5] outline-none transition-all" />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-[14px] font-bold text-[#43474e] mb-2">Cover Image</label>
                            <div className="flex gap-4 items-start">
                                {formData.image_url && !formData.image_url.includes('unsplash.com') ? (
                                    <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-[#c4c6cf]">
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="absolute top-1 right-1 bg-white/90 text-[#ba1a1a] p-1 rounded-full hover:bg-white transition-colors shadow-sm">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-40 h-24 rounded-lg border-2 border-dashed border-[#c4c6cf] flex flex-col items-center justify-center text-[#74777f] bg-[#f7fafc] cursor-pointer hover:border-[#0061a5] hover:text-[#0061a5] transition-colors relative">
                                        {isUploadingImage ? (
                                            <div className="w-6 h-6 border-2 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <ImageIcon size={24} className="mb-1" />
                                                <span className="text-[12px] font-medium">Upload Image</span>
                                                <input type="file" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" disabled={isUploadingImage} />
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-[13px] text-[#74777f] mb-2">Upload a high-quality image to represent this course. Recommended size: 1200x800px (16:9 ratio). Max file size: 5MB.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modules */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e3e5]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-[18px] font-bold text-[#002045]">Course Modules</h2>
                        <button type="button" onClick={handleAddModule} className="text-[#0061a5] font-bold text-[14px] flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Add Module
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        {modules.map((module, mIndex) => (
                            <div key={mIndex} className="p-4 border border-[#c4c6cf] rounded-xl bg-[#f7fafc]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#43474e] mb-1">Module Title *</label>
                                        <input required value={module.title} onChange={(e) => handleModuleChange(mIndex, 'title', e.target.value)} className="w-full px-3 py-1.5 border border-[#c4c6cf] rounded-lg outline-none focus:border-[#0061a5]" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#43474e] mb-1">Sessions *</label>
                                        <div className="flex items-center gap-2">
                                            <input required type="number" min="1" value={module.sessions} onChange={(e) => handleModuleChange(mIndex, 'sessions', e.target.value)} className="w-full px-3 py-1.5 border border-[#c4c6cf] rounded-lg outline-none focus:border-[#0061a5]" />
                                            <span className="font-bold text-[#74777f]">Sessions</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[13px] font-bold text-[#43474e] mb-1">Module Description</label>
                                    <textarea rows={2} value={module.description} onChange={(e) => handleModuleChange(mIndex, 'description', e.target.value)} className="w-full px-3 py-1.5 border border-[#c4c6cf] rounded-lg outline-none focus:border-[#0061a5] resize-none"></textarea>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[13px] font-bold text-[#43474e]">Topics</label>
                                        <button type="button" onClick={() => handleAddTopic(mIndex)} className="text-[#0061a5] text-[12px] font-bold flex items-center gap-1">
                                            <Plus size={14} /> Add Topic
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {module.topics.map((topic, tIndex) => (
                                            <div key={tIndex} className="flex gap-2">
                                                <input required value={topic} onChange={(e) => handleTopicChange(mIndex, tIndex, e.target.value)} className="flex-1 px-3 py-1.5 border border-[#c4c6cf] rounded-lg outline-none focus:border-[#0061a5]" placeholder="Enter topic..." />
                                                <button type="button" onClick={() => handleRemoveTopic(mIndex, tIndex)} className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-[#0061a5] text-white font-bold rounded-xl hover:bg-[#004d80] transition-colors flex items-center gap-2 disabled:opacity-70">
                        <Save size={20} />
                        {loading ? 'Creating...' : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCourse;
