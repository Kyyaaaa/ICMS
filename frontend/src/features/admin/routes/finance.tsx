import { useState, useEffect } from 'react';
import type { Transaction } from '../types/finance';
import { FinanceService } from '../services/finance.service';
import { FinanceOverview } from '../components/FinanceOverview';
import { FinanceFilters } from '../components/FinanceFilters';
import { FinanceTable } from '../components/FinanceTable';
import { TransactionModal } from '../components/TransactionModal';

const AdminFinance = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, income, expense
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterMonth, setFilterMonth] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            const data = await FinanceService.getTransactions();
            setTransactions(data);
            setLoading(false);
        };
        fetchTransactions();
    }, []);

    const categories = Array.from(new Set(transactions.map(t => t.category)));

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              txn.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              txn.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || txn.type === filterType;
        const matchesStatus = filterStatus === 'all' || txn.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesCategory = filterCategory === 'all' || txn.category === filterCategory;
        
        const txnDate = new Date(txn.date);
        const txnMonth = `${txnDate.getFullYear()}-${String(txnDate.getMonth() + 1).padStart(2, '0')}`;
        const matchesMonth = filterMonth === 'all' || txnMonth === filterMonth;

        return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesMonth;
    });

    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.paidAmount || 0), 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense' && (t.status === 'Completed' || t.status === 'Refunded')).reduce((acc, t) => acc + t.amount, 0);
    const netRevenue = totalIncome - totalExpense;

    return (
        <div className="space-y-6 animate-fade-in-up pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#002045]">Transaction History</h1>
                    <p className="text-[#74777f] mt-1 text-sm">View all cash inflows and outflows of the platform.</p>
                </div>
            </div>

            <FinanceOverview 
                totalIncome={totalIncome} 
                totalExpense={totalExpense} 
                netRevenue={netRevenue} 
            />

            <FinanceFilters 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                filterType={filterType} 
                setFilterType={setFilterType} 
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                categories={categories}
            />

            {loading ? (
                <div className="flex items-center justify-center h-64 border border-[#e0e3e5] border-t-0 rounded-b-[12px] bg-white shadow-sm">
                    <div className="w-8 h-8 border-4 border-[#0061a5] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <FinanceTable 
                    transactions={filteredTransactions} 
                    setSelectedTransaction={setSelectedTransaction} 
                />
            )}

            {selectedTransaction && (
                <TransactionModal 
                    transaction={selectedTransaction} 
                    onClose={() => setSelectedTransaction(null)} 
                />
            )}
        </div>
    );
};

export default AdminFinance;
