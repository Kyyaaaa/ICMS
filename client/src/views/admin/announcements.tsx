import React, { useState } from 'react';
import { Megaphone, Plus, Edit, Trash2, X, Users, BookOpen, Save, Filter, Globe, ShieldAlert, Clock, CalendarClock, Search } from 'lucide-react';

type Role = 'Admin' | 'Staff' | 'Tutor' | 'Learner';
type AudienceScope = 'System Wide' | 'Specific Roles' | 'Specific Classes';

type TargetAudience = {
    scope: AudienceScope;
    roles: Role[];
    classes: string[];
};

type Announcement = {
    id: string;
    title: string;
    content: string;
    date: string;
    audience: TargetAudience;
    status: 'Published' | 'Scheduled';
    scheduledFor?: string;
};

const mockClasses = [
    { id: 'c1', name: 'Math 101 - Fall 2026' },
    { id: 'c2', name: 'Physics 201 - Fall 2026' },
    { id: 'c3', name: 'Chemistry 101 - Fall 2026' },
    { id: 'c4', name: 'English 102 - Fall 2026' },
];

const mockAnnouncements: Announcement[] = [
    {
        id: '1',
        title: 'Scheduled Maintenance',
        content: 'The ICMS platform will undergo scheduled maintenance this Sunday from 2:00 AM to 4:00 AM EST. Access may be temporarily unavailable. Please save your work.',
        date: 'Oct 25, 2026',
        status: 'Published',
        audience: { scope: 'System Wide', roles: [], classes: [] }
    },
    {
        id: '4',
        title: 'Upcoming System Upgrade',
        content: 'We will be deploying new features next week. Please review the changelog sent to your email.',
        date: 'Nov 01, 2026',
        status: 'Scheduled',
        scheduledFor: '2026-11-01T08:00',
        audience: { scope: 'System Wide', roles: [], classes: [] }
    },
    {
        id: '2',
        title: 'New Exam Format for Math 101',
        content: 'Please be informed that the midterm exam format for Math 101 has been updated. Check the course syllabus for more details.',
        date: 'Oct 24, 2026',
        status: 'Published',
        audience: { scope: 'Specific Classes', roles: [], classes: ['c1'] }
    },
    {
        id: '3',
        title: 'Staff Meeting Reminder',
        content: 'Monthly all-hands staff meeting will take place tomorrow at 9:00 AM in the Main Conference Room. Attendance is mandatory.',
        date: 'Oct 22, 2026',
        status: 'Published',
        audience: { scope: 'Specific Roles', roles: ['Staff', 'Admin'], classes: [] }
    }
];

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editId, setEditId] = useState<string | null>(null);
    const [filterScope, setFilterScope] = useState<'All' | AudienceScope>('All');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Published' | 'Scheduled'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState<Omit<Announcement, 'id' | 'date' | 'status'>>({
        title: '',
        content: '',
        audience: { scope: 'System Wide', roles: [], classes: [] },
        scheduledFor: ''
    });
    const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');

    const handleOpenModal = (mode: 'create' | 'edit', ann?: Announcement) => {
        setModalMode(mode);
        if (mode === 'edit' && ann) {
            setEditId(ann.id);
            setPublishMode(ann.status === 'Scheduled' ? 'schedule' : 'now');
            setFormData({
                title: ann.title,
                content: ann.content,
                audience: { ...ann.audience },
                scheduledFor: ann.scheduledFor || ''
            });
        } else {
            setEditId(null);
            setPublishMode('now');
            setFormData({
                title: '',
                content: '',
                audience: { scope: 'System Wide', roles: [], classes: [] },
                scheduledFor: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleActualSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        // The user wants empty selections to mean "ALL".
        // No strict validation blocking submission for empty arrays anymore.
        if (publishMode === 'schedule' && !formData.scheduledFor) {
            alert("Please select a date and time for the scheduled announcement.");
            return;
        }

        // Cleanup unused fields to keep data clean
        const finalAudience = { ...formData.audience };
        if (finalAudience.scope === 'System Wide') {
            finalAudience.roles = [];
            finalAudience.classes = [];
        } else if (finalAudience.scope === 'Specific Roles') {
            finalAudience.classes = [];
        } else if (finalAudience.scope === 'Specific Classes') {
            finalAudience.roles = [];
        }

        if (modalMode === 'create') {
            const newAnn: Announcement = {
                id: Date.now().toString(),
                title: formData.title,
                content: formData.content,
                audience: finalAudience,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: publishMode === 'schedule' ? 'Scheduled' : 'Published',
                scheduledFor: publishMode === 'schedule' ? formData.scheduledFor : undefined
            };
            setAnnouncements([newAnn, ...announcements]);
        } else if (editId) {
            setAnnouncements(announcements.map(ann => 
                ann.id === editId ? { 
                    ...ann, 
                    title: formData.title, 
                    content: formData.content, 
                    audience: finalAudience,
                    status: publishMode === 'schedule' ? 'Scheduled' : 'Published',
                    scheduledFor: publishMode === 'schedule' ? formData.scheduledFor : undefined
                } : ann
            ));
        }
        setIsModalOpen(false);
        setEditId(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            setAnnouncements(announcements.filter(ann => ann.id !== id));
        }
    };

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

    const formatAudienceText = (audience: TargetAudience) => {
        if (audience.scope === 'System Wide') return "All Users (System Wide)";
        if (audience.scope === 'Specific Roles') return audience.roles.length > 0 ? `Roles: ${audience.roles.join(', ')}` : "All Roles";
        if (audience.scope === 'Specific Classes') {
            if (audience.classes.length === 0) return "All Classes";
            const classNames = audience.classes.map(cid => mockClasses.find(c => c.id === cid)?.name).filter(Boolean);
            return `Classes: ${classNames.join(', ')}`;
        }
        return "Unknown";
    };

    const filteredAnnouncements = announcements.filter(ann => {
        const matchScope = filterScope === 'All' || ann.audience.scope === filterScope;
        const matchStatus = filterStatus === 'All' || ann.status === filterStatus;
        const query = searchQuery.toLowerCase();
        const matchSearch = ann.title.toLowerCase().includes(query) || ann.content.toLowerCase().includes(query);
        return matchScope && matchStatus && matchSearch;
    });

    const getAudienceIcon = (scope: AudienceScope) => {
        if (scope === 'System Wide') return <Globe className="w-5 h-5 text-green-600" />;
        if (scope === 'Specific Roles') return <Users className="w-5 h-5 text-blue-600" />;
        return <BookOpen className="w-5 h-5 text-purple-600" />;
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#002045]">System Announcements</h1>
                    <p className="text-[#43474e] text-[15px] mt-1">Broadcast important information across the platform or to specific groups.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('create')}
                    className="flex items-center gap-2 bg-[#0061a5] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#004d80] transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    New Announcement
                </button>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-4 rounded-2xl shadow-sm border border-[#e0e3e5] gap-4">
                <div className="relative w-full lg:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#74777f]" />
                    <input 
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors"
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-5 h-5 text-[#74777f]" />
                        <select 
                            value={filterScope}
                            onChange={e => setFilterScope(e.target.value as any)}
                            className="px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] font-bold text-[#002045] focus:outline-none focus:border-[#0061a5] cursor-pointer w-full sm:w-auto"
                        >
                            <option value="All">All Scopes</option>
                            <option value="System Wide">System Wide</option>
                            <option value="Specific Roles">Specific Roles</option>
                            <option value="Specific Classes">Specific Classes</option>
                        </select>
                    </div>
                    <select 
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as any)}
                        className="px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] font-bold text-[#002045] focus:outline-none focus:border-[#0061a5] cursor-pointer w-full sm:w-auto"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Scheduled">Scheduled</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredAnnouncements.length > 0 ? filteredAnnouncements.map(ann => (
                    <div key={ann.id} className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-6 hover:border-[#c4c6cf] transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                            <div className="flex gap-4 flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                    ann.audience.scope === 'System Wide' ? 'bg-green-100' :
                                    ann.audience.scope === 'Specific Roles' ? 'bg-blue-100' : 'bg-purple-100'
                                }`}>
                                    {getAudienceIcon(ann.audience.scope)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[18px] md:text-[20px] font-bold text-[#181c1e]">{ann.title}</h3>
                                    <p className="text-[14px] text-[#43474e] mt-2 max-w-4xl leading-relaxed whitespace-pre-wrap">
                                        {ann.content}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 mt-4 text-[12px] font-bold">
                                        {ann.status === 'Scheduled' ? (
                                            <span className="text-[#854c0e] bg-[#fef08a] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                <CalendarClock size={14} /> Scheduled for: {ann.scheduledFor?.replace('T', ' ')}
                                            </span>
                                        ) : (
                                            <span className="text-[#74777f] bg-[#f1f4f6] px-3 py-1.5 rounded-lg">Posted: {ann.date}</span>
                                        )}
                                        <span className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                                            ann.audience.scope === 'System Wide' ? 'text-green-700 bg-green-50 border border-green-200' :
                                            ann.audience.scope === 'Specific Roles' ? 'text-blue-700 bg-blue-50 border border-blue-200' : 
                                            'text-purple-700 bg-purple-50 border border-purple-200'
                                        }`}>
                                            Target: {formatAudienceText(ann.audience)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0 md:pl-4 mt-4 md:mt-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-[#e0e3e5]">
                                <button onClick={() => handleOpenModal('edit', ann)} className="px-4 py-2 md:p-2.5 text-[#0061a5] bg-[#e6f0fa] hover:bg-[#cce0f5] rounded-xl transition-colors flex items-center gap-2" title="Edit Announcement">
                                    <Edit size={18} /> <span className="md:hidden font-bold text-[13px]">Edit</span>
                                </button>
                                <button onClick={() => handleDelete(ann.id)} className="px-4 py-2 md:p-2.5 text-[#ba1a1a] bg-[#ffebed] hover:bg-[#ffd6da] rounded-xl transition-colors flex items-center gap-2" title="Delete Announcement">
                                    <Trash2 size={18} /> <span className="md:hidden font-bold text-[13px]">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] p-12 text-center text-[#74777f]">
                        <Megaphone size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-[16px] font-bold text-[#181c1e]">No announcements found.</p>
                        <p className="text-[14px] mt-1">Try changing your filter or create a new announcement.</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal - Split Layout */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#002045]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-scale-in flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-[#e0e3e5] bg-[#f8f9fa] shrink-0">
                            <h2 className="text-[20px] font-bold text-[#002045] flex items-center gap-2">
                                <Megaphone className="text-[#0061a5]" size={22} />
                                {modalMode === 'create' ? 'Compose Announcement' : 'Edit Announcement'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#74777f] hover:text-[#ba1a1a] transition-colors p-1.5 hover:bg-white rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleActualSave} className="flex flex-col h-full max-h-[85vh]">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-y-auto">
                                
                                {/* Left Column: Content */}
                                <div className="lg:col-span-3 p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-[#e0e3e5]">
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#181c1e] mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded bg-[#0061a5] text-white flex items-center justify-center text-[12px]">1</span>
                                            Message Content
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Announcement Title</label>
                                                <input 
                                                    type="text" 
                                                    required 
                                                    value={formData.title}
                                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors" 
                                                    placeholder="e.g. System Maintenance Notice"
                                                />
                                            </div>
                                            
                                            <div className="space-y-1.5 h-full flex flex-col">
                                                <label className="text-[13px] font-bold text-[#43474e] uppercase tracking-wider">Detailed Message</label>
                                                <textarea 
                                                    required 
                                                    value={formData.content}
                                                    onChange={e => setFormData({...formData, content: e.target.value})}
                                                    className="w-full flex-1 min-h-[300px] px-4 py-3 bg-[#f8f9fa] border border-[#c4c6cf] rounded-xl text-[14px] focus:bg-white focus:outline-none focus:border-[#0061a5] transition-colors resize-none leading-relaxed" 
                                                    placeholder="Type the announcement message here..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Audience */}
                                <div className="lg:col-span-2 p-6 bg-[#f8f9fa] space-y-5">
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#181c1e] mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded bg-[#0061a5] text-white flex items-center justify-center text-[12px]">2</span>
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
                                                                <span className={`text-[14px] font-bold ${isSelected ? 'text-[#002045]' : ''}`}>{scope}</span>
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
                                                                                <span className={`text-[13px] font-bold ${roleSelected ? 'text-[#002045]' : 'text-[#43474e]'}`}>
                                                                                    {role}
                                                                                </span>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {formData.audience.roles.length === 0 && (
                                                                    <p className="text-[12px] text-[#74777f] font-medium flex items-center gap-1 mt-2">
                                                                        💡 Leave empty to target ALL Roles
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}

                                                        {isSelected && scope === 'Specific Classes' && (
                                                            <div className="pl-4 pr-1 py-2 animate-fade-in">
                                                                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#c4c6cf]">
                                                                    {mockClasses.map(cls => {
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
                                                                                <span className={`text-[13px] font-bold truncate ${classSelected ? 'text-[#002045]' : 'text-[#43474e]'}`}>
                                                                                    {cls.name}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                                {formData.audience.classes.length === 0 && (
                                                                    <p className="text-[12px] text-[#74777f] font-medium flex items-center gap-1 mt-2">
                                                                        💡 Leave empty to target ALL Classes
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Publish Settings moved to Right Column */}
                                    <div className="pt-5 border-t border-[#e0e3e5]">
                                        <h3 className="text-[15px] font-bold text-[#181c1e] mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded bg-[#0061a5] text-white flex items-center justify-center text-[12px]">3</span>
                                            Publish Settings
                                        </h3>
                                        
                                        <div className="space-y-3">
                                            <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${publishMode === 'now' ? 'bg-white border-[#0061a5] shadow-sm ring-1 ring-[#0061a5]' : 'bg-white border-[#e0e3e5] hover:border-[#c4c6cf]'}`}>
                                                <input type="radio" name="publishMode" checked={publishMode === 'now'} onChange={() => setPublishMode('now')} className="accent-[#0061a5] w-4 h-4" />
                                                <span className="text-[14px] text-[#181c1e] font-bold">Publish Immediately</span>
                                            </label>
                                            
                                            <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${publishMode === 'schedule' ? 'bg-white border-[#0061a5] shadow-sm ring-1 ring-[#0061a5]' : 'bg-white border-[#e0e3e5] hover:border-[#c4c6cf]'}`}>
                                                <input type="radio" name="publishMode" checked={publishMode === 'schedule'} onChange={() => setPublishMode('schedule')} className="accent-[#0061a5] w-4 h-4" />
                                                <span className="text-[14px] text-[#181c1e] font-bold">Schedule for later</span>
                                            </label>
                                            
                                            {publishMode === 'schedule' && (
                                                <div className="pt-2 animate-fade-in">
                                                    <input 
                                                        type="datetime-local" 
                                                        value={formData.scheduledFor}
                                                        onChange={e => setFormData({...formData, scheduledFor: e.target.value})}
                                                        className="w-full px-4 py-2.5 bg-white border border-[#0061a5] rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0061a5]/20 transition-all font-bold text-[#002045]"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer */}
                            <div className="p-5 border-t border-[#e0e3e5] flex justify-end gap-3 bg-white shrink-0">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[#43474e] font-bold rounded-xl hover:bg-[#f1f4f6] transition-colors border border-transparent hover:border-[#c4c6cf]">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-[#0061a5] text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#004d80] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save size={18} />
                                    {modalMode === 'create' ? (publishMode === 'schedule' ? 'Schedule Announcement' : 'Publish Now') : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
