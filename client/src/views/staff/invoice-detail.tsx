
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, DollarSign, User, BookOpen, Calendar } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const InvoiceDetail = () => {
    const { id } = useParams();
    
    // Mock data for a detailed invoice (simulating an installment payment)
    const invoice = {
        id: id || 'INV-10025',
        status: 'Partial',
        issueDate: '01-10-2026',
        dueDate: '01-12-2026',
        
        learner: {
            name: 'Sarah Connor',
            email: 'sarah.c@example.com',
            phone: '+1 987 654 321',
            id: 'L-8842'
        },
        
        course: {
            name: 'TOEIC Target 700+',
            code: 'TOEIC-B01',
            duration: '16 Weeks',
            startDate: '15-10-2026'
        },
        
        payment: {
            method: 'Installment (3 Terms)',
            totalAmount: 300.00,
            paidAmount: 200.00,
            remainingAmount: 100.00,
            installments: [
                { id: 1, term: '1st Installment (Deposit)', amount: 100.00, dueDate: '01-10-2026', paidDate: '01-10-2026', status: 'Paid', method: 'Credit Card (*4421)' },
                { id: 2, term: '2nd Installment', amount: 100.00, dueDate: '01-11-2026', paidDate: '22-10-2026', status: 'Paid', method: 'Bank Transfer' },
                { id: 3, term: '3rd Installment (Final)', amount: 100.00, dueDate: '01-12-2026', paidDate: null, status: 'Pending', method: '-' },
            ]
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'Partial': return 'bg-blue-100 text-[#0061a5] border-blue-200';
            case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 className="w-4 h-4" />;
            case 'Partial': return <Clock className="w-4 h-4" />;
            case 'Overdue': return <AlertCircle className="w-4 h-4" />;
            case 'Pending': return <Clock className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up max-w-[1000px] mx-auto pb-12">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <Link to="/staff/invoices" className="text-[#74777f] hover:text-[#002045] font-semibold flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Invoices
                </Link>
                {/* Buttons removed as requested */}
            </div>

            {/* Main Invoice Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden">
                {/* Top Banner */}
                <div className="bg-[#f8f9fa] p-8 border-b border-[#e0e3e5] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-[32px] font-extrabold text-[#002045]">Invoice {invoice.id}</h1>
                            <span className={`px-3 py-1 border rounded-full text-[13px] font-bold flex items-center gap-1.5 ${getStatusStyle(invoice.status)}`}>
                                {getStatusIcon(invoice.status)} {invoice.status}
                            </span>
                        </div>
                        <div className="text-[#43474e] flex flex-wrap items-center gap-4 text-[14px]">
                            <span>Issue Date: <strong className="text-[#181c1e]">{invoice.issueDate}</strong></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c4c6cf]"></span>
                            <span>Due Date: <strong className="text-[#181c1e]">{invoice.dueDate}</strong></span>
                        </div>
                    </div>
                    
                    <div className="text-left md:text-right">
                        <div className="text-[13px] font-bold text-[#74777f] uppercase tracking-wider mb-1">Total Amount</div>
                        <div className="text-[36px] font-extrabold text-[#0061a5] leading-none">{invoice.payment.totalAmount.toLocaleString()} đ</div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#e0e3e5]">
                    {/* Billed To */}
                    <div>
                        <h3 className="text-[14px] font-bold text-[#74777f] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> Billed To
                        </h3>
                        <div className="space-y-2 text-[15px]">
                            <div className="font-extrabold text-[#002045] text-[18px]">{invoice.learner.name}</div>
                            <div className="text-[#43474e]">Learner ID: {invoice.learner.id}</div>
                            <div className="text-[#43474e]">{invoice.learner.email}</div>
                            <div className="text-[#43474e]">{invoice.learner.phone}</div>
                        </div>
                    </div>

                    {/* Course Summary */}
                    <div>
                        <h3 className="text-[14px] font-bold text-[#74777f] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Course Information
                        </h3>
                        <div className="bg-[#f8f9fa] rounded-xl p-5 border border-[#e0e3e5] space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-[#002045] text-[16px]">{invoice.course.name}</div>
                                <span className="bg-[#e6f0fa] text-[#0061a5] text-[12px] font-bold px-2 py-1 rounded">{invoice.course.code}</span>
                            </div>
                            <div className="flex items-center gap-4 text-[14px] text-[#43474e]">
                                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#74777f]" /> Starts: {invoice.course.startDate}</div>
                                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#74777f]" /> {invoice.course.duration}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Breakdown */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[18px] font-extrabold text-[#002045] flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#0061a5]" /> Installment Breakdown
                        </h3>
                        <span className="text-[14px] font-bold text-[#43474e] bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                            Payment Method: <span className="text-[#002045]">{invoice.payment.method}</span>
                        </span>
                    </div>

                    <div className="border border-[#e0e3e5] rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#f8f9fa] border-b border-[#e0e3e5]">
                                <tr>
                                    <th className="p-4 font-semibold text-[#43474e]">Term / Description</th>
                                    <th className="p-4 font-semibold text-[#43474e]">Due Date</th>
                                    <th className="p-4 font-semibold text-[#43474e]">Status</th>
                                    <th className="p-4 font-semibold text-[#43474e]">Payment Info</th>
                                    <th className="p-4 font-semibold text-[#43474e] text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.payment.installments.map((inst, index) => (
                                    <tr key={inst.id} className={index !== invoice.payment.installments.length - 1 ? "border-b border-[#e0e3e5]" : ""}>
                                        <td className="p-4 font-bold text-[#002045]">{inst.term}</td>
                                        <td className="p-4 text-[#43474e]">{inst.dueDate}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 border rounded-md text-[12px] font-bold ${getStatusStyle(inst.status)}`}>
                                                {getStatusIcon(inst.status)} {inst.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {inst.status === 'Paid' ? (
                                                <div className="text-[13px] text-[#002045] font-semibold">
                                                    Paid on {inst.paidDate}
                                                </div>
                                            ) : (
                                                <span className="text-[13px] text-[#74777f] italic">Awaiting Payment</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right font-bold text-[#181c1e]">
                                            {inst.amount.toLocaleString()} đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-[#f8f9fa] border-t border-[#e0e3e5]">
                                <tr>
                                    <td colSpan={4} className="p-4 text-right font-bold text-[#43474e]">Total Paid</td>
                                    <td className="p-4 text-right font-bold text-green-600">{invoice.payment.paidAmount.toLocaleString()} đ</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="p-4 text-right font-extrabold text-[#002045] text-[16px]">Remaining Balance</td>
                                    <td className="p-4 text-right font-extrabold text-[#0061a5] text-[18px]">{invoice.payment.remainingAmount.toLocaleString()} đ</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                
                {/* Footer Notes */}
                <div className="bg-gray-50 p-6 border-t border-[#e0e3e5] text-center text-[13px] text-[#74777f]">
                    <p>This invoice is generated automatically by ICMS Financial System.</p>
                    <p>For any questions regarding this invoice, please contact the support team or open a support ticket.</p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;