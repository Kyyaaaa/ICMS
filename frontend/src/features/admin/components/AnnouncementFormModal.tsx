import { useState, useEffect } from 'react';
import { Megaphone, X, Save, Globe, Users, BookOpen } from 'lucide-react';
import type { Announcement, AudienceScope, Role } from '../types/announcement';
import { showAlertModal } from '@/utils/modal';

interface AnnouncementFormModalProps {
    mode: 'create' | 'edit';
    initialData?: Announcement;
    availableCourses: { id: string; name: string }[];
    availableClasses: { id: string; name: string; course_id?: string }[];
    onClose: () => void;
    onSave: (data: Omit<Announcement, 'id' | 'date' | 'status'> & { publishMode: 'now' | 'schedule' }) => void;
}

export const AnnouncementFormModal = ({ mode, initialData, availableCourses, availableClasses, onClose, onSave }: AnnouncementFormModalProps) => {
    const [formData, setFormData] = useState<Omit<Announcement, 'id' | 'date' | 'status'>>({
        title: '',
        content: '',
        audience: { scope: 'System Wide', roles: [], classes: [] },
        scheduledFor: ''
    });
    const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                title: initialData.title,
                content: initialData.content,
                audience: { ...initialData.audience },
                scheduledFor: initialData.scheduledFor || ''
            });
            setPublishMode(initialData.status === 'Scheduled' ? 'schedule' : 'now');
        }
    }, [mode, initialData]);

    const handleRoleToggle = (role: Role) => {
        const currentRoles = formData.audience.roles;
        const newRoles = currentRoles.includes(role) 
            ? currentRoles.filter(r => r !== role) 
            : [...currentRoles, role];
        setFormData({ ...formData, audience: { ...formData.audience, roles: newRoles } });
    };

    const handleClassToggle = (classId: string) => {
        const currentClasses = formData.audience.classes;
        const newClasses = currentClasses.includes(classId) 
            ? currentClasses.filter(c => c !== classId) 
            : [...currentClasses, classId];
        setFormData({ ...formData, audience: { ...formData.audience, classes: newClasses } });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.audience.scope === 'Specific Roles' && formData.audience.roles.length === 0) {
            showAlertModal('Warning', 'Please select at least one role for the target audience.', 'warning');
            return;
        }

        if (publishMode === 'schedule') {
            if (!formData.scheduledFor) {
                showAlertModal('Warning', 'Please select a date and time.', 'warning');
                return;
            }
            const selectedTime = new Date(formData.scheduledFor).getTime();
            const now = new Date().getTime();
            if (selectedTime < now) {
                showAlertModal('Warning', 'Please select a date and time in the future.', 'warning');
                return;
            }
        }
        
        onSave({ ...formData, publishMode });
    };

    const filteredClasses = selectedCourseId 
        ? availableClasses.filter(c => c.course_id === selectedCourseId)
        : availableClasses;

    return (
        <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-scale-in flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                    <h2 className="text-xl font-bold text-[#002045] flex items-center gap-2">
                        <Megaphone className="text-[#0061a5]" size={22} />
                        {mode === 'create' ? 'Compose Announcement' : 'Edit Announcement'}
                    </h2>
                    <button onClick={onClose} className="text-[#74777f] hover:text-[#ba1a1a] transition-colors p-1.5 hover:bg-white rounded-full">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-y-auto">
                        
                        {/* Left Column: Content */}
                        <div className="lg:col-span-3 p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-[#e0e3e5]">
                            <div>
                                <h3 className="text-sm font-bold text-[#181c1e] mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-[#0061a5] text-white flex items-center justify-center text-xs">1</span>
                                    Message Content
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Announcement Title</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={formData.title}
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                            placeholder="e.g. System Maintenance Notice"
                                        />
                                    </div>
                                    
                                    <div className="space-y-1.5 h-full flex flex-col">
                                        <label className="text-xs font-bold text-[#43474e] uppercase tracking-wider">Detailed Message</label>
                                        <textarea 
                                            required 
                                            value={formData.content}
                                            onChange={e => setFormData({...formData, content: e.target.value})}
                                            className="w-full flex-1 min-h-75 px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors resize-none leading-relaxed" 
                                            placeholder="Type the announcement message here..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Audience */}
                        <div className="lg:col-span-2 p-6 bg-[#f8f9fa] space-y-5">
                            <div>
                                <h3 className="text-sm font-bold text-[#181c1e] mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-[#0061a5] text-white flex items-center justify-center text-xs">2</span>
                                    Target Audience
                                </h3>
                                
                                <div className="space-y-2">
                                    {(['System Wide', 'Specific Roles', 'Specific Classes'] as AudienceScope[]).map(scope => {
                                        const isSelected = formData.audience.scope === scope;
                                        return (
                                            <div key={scope} className="space-y-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({...formData, audience: { scope, roles: [], classes: [] }})}
                                                    className={`w-full py-3 px-4 rounded-xl border transition-all flex items-center gap-3 ${
                                                        isSelected 
                                                            ? 'bg-white border-[#0061a5] shadow-sm ring-1 ring-[#0061a5]' 
                                                            : 'bg-white border-[#c4c6cf] text-[#43474e] hover:border-[#0061a5]'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#0061a5]' : 'border-[#c4c6cf]'}`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0061a5]" />}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {scope === 'System Wide' && <Globe size={18} className={isSelected ? 'text-[#0061a5]' : 'text-[#74777f]'}/>}
                                                        {scope === 'Specific Roles' && <Users size={18} className={isSelected ? 'text-[#0061a5]' : 'text-[#74777f]'}/>}
                                                        {scope === 'Specific Classes' && <BookOpen size={18} className={isSelected ? 'text-[#0061a5]' : 'text-[#74777f]'}/>}
                                                        <span className={`text-sm font-bold ${isSelected ? 'text-[#002045]' : ''}`}>{scope}</span>
                                                    </div>
                                                </button>

                                                {/* Sub-panels inject directly below their radio button for better context */}
                                                {isSelected && scope === 'Specific Roles' && (
                                                    <div className="pl-4 pr-1 py-2 animate-fade-in">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {(['Admin', 'Staff', 'Tutor', 'Learner'] as Role[]).map(role => {
                                                                const roleSelected = formData.audience.roles.includes(role);
                                                                return (
                                                                    <button
                                                                        key={role}
                                                                        type="button"
                                                                        onClick={() => handleRoleToggle(role)}
                                                                        className={`py-2 px-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                                                                            roleSelected 
                                                                                ? 'bg-[#e6f0fa] border-[#0061a5]' 
                                                                                : 'bg-white border-[#e0e3e5] hover:border-[#c4c6cf]'
                                                                        }`}
                                                                    >
                                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${roleSelected ? 'bg-[#0061a5] border-[#0061a5] text-white' : 'border-[#c4c6cf] bg-white'}`}>
                                                                            {roleSelected && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                                        </div>
                                                                        <span className={`text-xs font-bold ${roleSelected ? 'text-[#002045]' : 'text-[#43474e]'}`}>
                                                                            {role}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        {formData.audience.roles.length === 0 && (
                                                            <p className="text-xs text-[#ba1a1a] font-medium flex items-center gap-1 mt-2">
                                                                ⚠️ Please select at least one role.
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {isSelected && scope === 'Specific Classes' && (
                                                    <div className="pl-4 pr-1 py-2 animate-fade-in space-y-3">
                                                        <div>
                                                            <select 
                                                                value={selectedCourseId}
                                                                onChange={e => setSelectedCourseId(e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-[#c4c6cf] rounded-lg text-sm focus:outline-none focus:border-[#0061a5] transition-colors"
                                                            >
                                                                <option value="">Filter by Course (All Courses)</option>
                                                                {availableCourses.map(course => (
                                                                    <option key={course.id} value={course.id}>{course.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#c4c6cf]">
                                                            {filteredClasses.length > 0 ? filteredClasses.map(cls => {
                                                                const classSelected = formData.audience.classes.includes(cls.id);
                                                                return (
                                                                    <div 
                                                                        key={cls.id}
                                                                        onClick={() => handleClassToggle(cls.id)}
                                                                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                                                                            classSelected 
                                                                                ? 'bg-[#e6f0fa] border-[#0061a5]' 
                                                                                : 'bg-white border-[#e0e3e5] hover:border-[#c4c6cf]'
                                                                        }`}
                                                                    >
                                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${classSelected ? 'bg-[#0061a5] border-[#0061a5] text-white' : 'border-[#c4c6cf]'}`}>
                                                                            {classSelected && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                                                        </div>
                                                                        <span className={`text-xs font-bold truncate ${classSelected ? 'text-[#002045]' : 'text-[#43474e]'}`}>
                                                                            {cls.name}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            }) : (
                                                                <div className="text-center py-4 text-xs text-[#74777f]">No classes found for the selected course.</div>
                                                            )}
                                                        </div>
                                                        <div className="pt-2 border-t border-[#e0e3e5]">
                                                            <div className="text-xs text-[#0061a5] font-bold">
                                                                Selected Classes: {formData.audience.classes.length}
                                                            </div>
                                                            {formData.audience.classes.length === 0 && (
                                                                <p className="text-xs text-[#74777f] font-medium mt-1">
                                                                    💡 Leave empty to target ALL Classes
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Publish Settings moved to Right Column */}
                            <div className="pt-5 border-t border-[#e0e3e5]">
                                <h3 className="text-sm font-bold text-[#181c1e] mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-[#0061a5] text-white flex items-center justify-center text-xs">3</span>
                                    Publish Settings
                                </h3>
                                
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${publishMode === 'now' ? 'bg-white border-[#0061a5] shadow-sm ring-1 ring-[#0061a5]' : 'bg-white border-[#e0e3e5] hover:border-[#c4c6cf]'}`}>
                                        <input type="radio" name="publishMode" checked={publishMode === 'now'} onChange={() => setPublishMode('now')} className="accent-[#0061a5] w-4 h-4" />
                                        <span className="text-sm text-[#181c1e] font-bold">Publish Immediately</span>
                                    </label>
                                    
                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${publishMode === 'schedule' ? 'bg-white border-[#0061a5] shadow-sm ring-1 ring-[#0061a5]' : 'bg-white border-[#e0e3e5] hover:border-[#c4c6cf]'}`}>
                                        <input type="radio" name="publishMode" checked={publishMode === 'schedule'} onChange={() => setPublishMode('schedule')} className="accent-[#0061a5] w-4 h-4" />
                                        <span className="text-sm text-[#181c1e] font-bold">Schedule for later</span>
                                    </label>
                                    
                                    {publishMode === 'schedule' && (
                                        <div className="pt-2 animate-fade-in">
                                            <input 
                                                type="datetime-local" 
                                                min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                                                value={formData.scheduledFor}
                                                onChange={e => setFormData({...formData, scheduledFor: e.target.value})}
                                                className="w-full px-4 py-2.5 bg-white border border-[#0061a5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0061a5]/20 transition-all font-bold text-[#002045]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="p-5 border-t border-[#e0e3e5] flex justify-end gap-3 bg-white shrink-0">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-[#43474e] font-bold rounded-xl hover:bg-[#f1f4f6] transition-colors border border-transparent hover:border-[#c4c6cf]">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="bg-[#0061a5] text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#004d80] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {mode === 'create' ? (publishMode === 'schedule' ? 'Schedule Announcement' : 'Publish Now') : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
