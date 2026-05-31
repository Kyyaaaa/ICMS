import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Clock, User, Plus, Search, Filter, CalendarDays } from 'lucide-react';

const ManageClasses = () => {
    const courses = [
        {
            id: 1,
            name: 'IELTS Masterclass (Band 7.0+)',
            startDate: 'Oct 01, 2026',
            endDate: 'Dec 31, 2026',
            classes: [
                { id: '101', name: 'IELTS-A01', tutor: 'Dr. Sarah Connor', room: 'Room 102', schedule: 'Mon/Wed/Fri 18:00 - 20:00', students: 15, maxStudents: 20 },
                { id: '102', name: 'IELTS-A02', tutor: 'Mr. James Bond', room: 'Room 205', schedule: 'Tue/Thu 18:00 - 20:30', students: 25, maxStudents: 25 },
            ]
        },
        {
            id: 2,
            name: 'TOEIC Intensive (750+)',
            startDate: 'Nov 01, 2026',
            endDate: 'Feb 28, 2027',
            classes: [
                { id: '201', name: 'TOEIC-B01', tutor: 'Ms. Emily Blunt', room: 'Room 105', schedule: 'Sat/Sun 09:00 - 11:30', students: 20, maxStudents: 30 },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-[24px] font-bold text-[#002045]">Manage Classes</h1>
                    <p className="text-[14px] text-[#74777f]">Organize classes grouped by courses, assign tutors and rooms.</p>
                </div>
                <Link to="/staff/classes/create" className="px-4 py-2 bg-[#002045] text-white rounded-lg font-semibold hover:bg-[#0061a5] transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Create New Class
                </Link>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e0e3e5] flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by class name..." 
                        className="w-full pl-10 pr-4 py-2 border border-[#c4c6cf] rounded-lg text-sm focus:outline-none focus:border-[#0061a5] focus:ring-2 focus:ring-[#0061a5]/20" 
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer">
                            <option value="">All Courses</option>
                            <option value="ielts">IELTS Masterclass</option>
                            <option value="toeic">TOEIC Intensive</option>
                        </select>
                        <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer">
                            <option value="">All Tutors</option>
                            <option value="sarah">Dr. Sarah Connor</option>
                            <option value="james">Mr. James Bond</option>
                        </select>
                        <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer">
                            <option value="">All Statuses</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                        <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <input 
                            type="date" 
                            className="appearance-none pl-3 pr-3 py-2 bg-[#f8f9fa] border border-[#c4c6cf] rounded-lg text-sm text-[#43474e] focus:outline-none focus:border-[#0061a5] font-medium cursor-pointer tooltip-trigger"
                            title="Filter by specific date"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                        <div className="bg-[#f8f9fa] px-6 py-4 border-b border-[#e0e3e5] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-[#0061a5] rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-[18px] font-bold text-[#002045]">{course.name}</h2>
                                    <p className="text-xs text-[#74777f] mt-1 flex items-center gap-1 font-medium">
                                        <CalendarDays className="w-3 h-3" /> Duration: {course.startDate} - {course.endDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 p-6">
                            {course.classes.map((cls) => (
                                <Link to={`/staff/classes/${cls.id}`} key={cls.id} className="block group">
                                    <div className="border border-[#e0e3e5] rounded-xl p-5 hover:border-[#0061a5] hover:shadow-md transition-all h-full bg-white relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#0061a5] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-[18px] font-bold text-[#002045] group-hover:text-[#0061a5] transition-colors">{cls.name}</h3>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${cls.students >= cls.maxStudents ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0061a5]'}`}>
                                                {cls.students}/{cls.maxStudents} Students
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2 text-[#43474e] text-[14px]">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-[#74777f]" />
                                                <span><span className="font-medium text-[#181c1e]">Tutor:</span> {cls.tutor}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-[#74777f]" />
                                                <span><span className="font-medium text-[#181c1e]">Time:</span> {cls.schedule}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-[#74777f]" />
                                                <span><span className="font-medium text-[#181c1e]">Room:</span> {cls.room}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ManageClasses;