import { formatDateTime } from "../../../shared/utils/date";
import { useState, useEffect } from 'react';
import { Tags, Search, Plus, Trash2, Edit, X } from 'lucide-react';
import { Pagination } from '@/shared/components/common/Pagination';
import type { DiscountCode } from '../types/discount-code';
import { AdminDiscountCodesService } from '../services/discount-codes.service';
import { showConfirmModal } from '@/utils/modal';
const AdminDiscountCodes = () => {
    const [codes, setCodes] = useState<DiscountCode[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    // CRUD Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<DiscountCode> & { startDate?: string, startTime?: string, endDate?: string, endTime?: string }>({
        code: '',
        value: 50000,
        status: 'Active',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
    });

    useEffect(() => {
        const fetchCodes = async () => {
            const data = await AdminDiscountCodesService.getDiscountCodes();
            setCodes(data);
        };
        fetchCodes();
    }, []);

    const filteredCodes = codes.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleOpenModal = (code?: DiscountCode) => {
        setError(null);
        if (code) {
            setEditingId(code.id);
            let startDate = '', startTime = '', endDate = '', endTime = '';
            if (code.validFrom) {
                const d = new Date(code.validFrom);
                startDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                startTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            }
            if (code.validUntil) {
                const d = new Date(code.validUntil);
                endDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                endTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            }
            
            setFormData({ 
                ...code,
                startDate,
                startTime,
                endDate,
                endTime
            });
        } else {
            setEditingId(null);
            setFormData({ code: '', value: 50000, status: 'Active', startDate: '', startTime: '', endDate: '', endTime: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        setError(null);

        if (!formData.startDate || !formData.endDate) {
            setError('Please fill in both start and end dates.');
            return;
        }

        const startTimeStr = formData.startTime || '00:00';
        const endTimeStr = formData.endTime || '00:00';

        const validFromLocal = `${formData.startDate}T${startTimeStr}`;
        const validUntilLocal = `${formData.endDate}T${endTimeStr}`;

        const startDateTime = new Date(validFromLocal);
        const endDateTime = new Date(validUntilLocal);

        if (endDateTime <= startDateTime) {
            setError('End Date/Time must be strictly after the Start Date/Time.');
            return;
        }

        const validFrom = startDateTime.toISOString();
        const validUntil = endDateTime.toISOString();

        try {
            if (editingId) {
                const updated = await AdminDiscountCodesService.updateDiscountCode(editingId, { ...formData, validFrom, validUntil });
                setCodes(codes.map(c => c.id === editingId ? updated : c));
            } else {
                const newCode = await AdminDiscountCodesService.createDiscountCode({
                    code: formData.code?.toUpperCase() || 'NEWCODE',
                    value: formData.value || 0,
                    validFrom,
                    validUntil,
                    status: formData.status as 'Active' | 'Expired' | 'Disabled' || 'Active'
                });
                setCodes([...codes, newCode]);
            }
            setIsModalOpen(false);
        } catch (error: unknown) {
            const msg = (error as Error).message || 'Failed to save discount code.';
            setError(msg);
            const data = await AdminDiscountCodesService.getDiscountCodes();
            setCodes(data);
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = await showConfirmModal('Confirm Delete', 'Are you sure you want to delete this discount code?', 'warning');
        if (isConfirmed) {
            await AdminDiscountCodesService.deleteDiscountCode(id);
            setCodes(codes.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Discount Codes</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#0061a5] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#004d80] transition-colors">
                    <Plus size={20} />
                    New Code
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                <div className="p-4 border-b border-[#e0e3e5]">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#74777f] w-5 h-5" />
                        <input 
                            className="pl-10 pr-4 py-2 bg-[#f1f4f6] border border-[#c4c6cf] rounded-xl text-sm focus:outline-none focus:border-[#0061a5] w-full uppercase" 
                            placeholder="SEARCH CODES..." 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-200">
                        <thead>
                            <tr className="bg-[#f7fafc] border-b border-[#e0e3e5]">
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Code</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Value (Discount)</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Valid From</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Valid Until</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e]">Status</th>
                                <th className="py-4 px-6 text-sm font-semibold text-[#43474e] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCodes.slice((currentPage - 1) * 10, currentPage * 10).map(code => (
                                <tr key={code.id} className="border-b border-[#e0e3e5] hover:bg-[#f7fafc]">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#e6f0fa] flex items-center justify-center text-[#0061a5]">
                                                <Tags size={20} />
                                            </div>
                                            <span className="font-bold text-[#181c1e] tracking-widest">{code.code}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-[#0061a5]">
                                        {code.value.toLocaleString('en-US')} VND
                                    </td>
                                    <td className="py-4 px-6 text-sm text-[#43474e]">
                                        {code.validFrom ? formatDateTime(code.validFrom) : 'N/A'}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-[#43474e]">
                                        {code.validUntil ? formatDateTime(code.validUntil) : 'N/A'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                                            code.status === 'Active' ? 'bg-[#e6f4ea] text-[#137333]' : 
                                            code.status === 'Disabled' ? 'bg-[#ffebed] text-[#ba1a1a]' : 
                                            'bg-[#f1f4f6] text-[#74777f]'
                                        }`}>
                                            {code.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpenModal(code)} className="p-2 text-[#43474e] hover:bg-[#e0e3e5] rounded-lg transition-colors" title="Edit"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(code.id)} className="p-2 text-[#ba1a1a] hover:bg-[#ffebed] rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCodes.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-[#74777f]">No discount codes found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredCodes.length}
                    itemsPerPage={10}
                    onPageChange={setCurrentPage}
                    itemName="discount codes"
                />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl overflow-hidden animate-slide-up">
                        <div className="p-4 border-b border-[#e0e3e5] flex justify-between items-center bg-[#f7fafc]">
                            <h2 className="text-lg font-bold text-[#002045]">{editingId ? 'Edit Discount Code' : 'New Discount Code'}</h2>
                            <button onClick={handleCloseModal} className="text-[#74777f] hover:text-[#181c1e] transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-[#43474e] mb-1">Code</label>
                                <input 
                                    type="text" 
                                    value={formData.code} 
                                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] uppercase tracking-widest font-bold"
                                    placeholder="e.g. SUMMER26"
                                />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-2">
                                            <label className="block text-xs font-bold text-[#43474e] mb-1">Discount Amount (VND)</label>
                                            <input 
                                                type="number" 
                                                value={formData.value} 
                                                onChange={e => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                                                className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] font-bold text-[#0061a5]"
                                                step="10000"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-[#43474e] mb-1">Status</label>
                                            <select 
                                                value={formData.status} 
                                                onChange={e => setFormData({...formData, status: e.target.value as 'Active' | 'Expired' | 'Disabled'})}
                                                className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] bg-white"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Expired">Expired</option>
                                                <option value="Disabled">Disabled</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#f7fafc] p-4 rounded-xl border border-[#e0e3e5] space-y-4">
                                        <h3 className="text-xs font-bold text-[#0061a5] flex items-center gap-2">
                                            Start Time (Valid From)
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-3">
                                                <label className="block text-xs font-bold text-[#43474e] mb-1">Date</label>
                                                <input 
                                                    type="date" 
                                                    value={formData.startDate || ''} 
                                                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                                                    className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] bg-white"
                                                />
                                            </div>
                                            <div className="flex-2">
                                                <label className="block text-xs font-bold text-[#43474e] mb-1">Time</label>
                                                <input 
                                                    type="time" 
                                                    lang="en-GB"
                                                    value={formData.startTime || ''} 
                                                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                                                    className="w-full px-3 py-2 text-sm border border-[#c4c6cf] rounded-lg focus:outline-none focus:border-[#0061a5] bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-[#fff8f8] p-4 rounded-xl border border-[#ffebed] space-y-4">
                                        <h3 className="text-xs font-bold text-[#ba1a1a] flex items-center gap-2">
                                            End Time (Valid Until)
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-3">
                                                <label className="block text-xs font-bold text-[#ba1a1a] mb-1">Date</label>
                                                <input 
                                                    type="date" 
                                                    value={formData.endDate || ''} 
                                                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                                                    className="w-full px-3 py-2 text-sm border border-[#ffebed] rounded-lg focus:outline-none focus:border-[#ba1a1a] bg-white"
                                                />
                                            </div>
                                            <div className="flex-2">
                                                <label className="block text-xs font-bold text-[#ba1a1a] mb-1">Time</label>
                                                <input 
                                                    type="time" 
                                                    lang="en-GB"
                                                    value={formData.endTime || ''} 
                                                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                                                    className="w-full px-3 py-2 text-sm border border-[#ffebed] rounded-lg focus:outline-none focus:border-[#ba1a1a] bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                        </div>
                        {error && (
                            <div className="px-6 py-3 bg-[#ffebed] border-y border-[#ffb4ab]">
                                <p className="text-xs font-bold text-[#ba1a1a]">{error}</p>
                            </div>
                        )}
                        <div className="p-4 border-t border-[#e0e3e5] flex justify-end gap-2 bg-[#f7fafc]">
                            <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-bold text-[#43474e] hover:bg-[#e0e3e5] rounded-xl transition-colors">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-bold text-white bg-[#0061a5] hover:bg-[#004d80] rounded-xl transition-colors">Save Code</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDiscountCodes;
