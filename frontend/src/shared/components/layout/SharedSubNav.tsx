import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface SubNavTab {
    name: string;
    path: string;
    icon: React.ElementType;
}

export const SharedSubNav = ({ tabs }: { tabs: SubNavTab[] }) => {
    const location = useLocation();
    
    if (!tabs || tabs.length === 0) return null;
    
    const isActivePath = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
    
    return (
        <div className="bg-white border-b border-[#e0e3e5] px-6 flex items-center gap-6 overflow-x-auto scrollbar-none sticky top-18 z-20">
            {tabs.map(tab => {
                const active = isActivePath(tab.path);
                return (
                    <Link 
                        key={tab.name}
                        to={tab.path}
                        className={`flex items-center gap-2 py-3.5 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${active ? 'border-[#0061a5] text-[#0061a5]' : 'border-transparent text-[#74777f] hover:text-[#002045]'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </Link>
                )
            })}
        </div>
    );
};
