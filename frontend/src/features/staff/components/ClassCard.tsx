import { Link } from 'react-router-dom';
import { User, Clock, MapPin } from 'lucide-react';
import type { Class } from '../types/class';

interface ClassCardProps {
    cls: Class;
}

export const ClassCard = ({ cls }: ClassCardProps) => {
    return (
        <Link to={`/staff/classes/${cls.id}`} className="block group h-full">
            <div className="border border-[#e0e3e5] rounded-xl p-5 hover:border-[#0061a5] hover:shadow-md transition-all h-full bg-white relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0061a5] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-[#002045] group-hover:text-[#0061a5] transition-colors">{cls.name}</h3>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-[#0061a5]">
                        {cls.capacity} Max Students
                    </span>
                </div>
                
                <div className="space-y-2 text-[#43474e] text-sm mt-auto">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#74777f]" />
                        <span><span className="font-medium text-[#181c1e]">Tutor:</span> {cls.tutor?.full_name || 'Not assigned'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#74777f]" />
                        <span><span className="font-medium text-[#181c1e]">Status:</span> {cls.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#74777f]" />
                        <span><span className="font-medium text-[#181c1e]">Room:</span> {cls.classroom?.room_name || 'Not assigned'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
