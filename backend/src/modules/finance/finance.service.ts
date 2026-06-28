import { FinanceRepository } from './finance.repository';
import { Transaction } from './finance.model';

export class FinanceService {
  private static mapInvoiceToTransaction(inv: any): Transaction {
    const courseTitle = Array.isArray(inv.classes?.courses) 
      ? inv.classes.courses[0]?.title 
      : inv.classes?.courses?.title;

    const userObj = { 
      name: inv.account?.full_name || 'Unknown Learner', 
      role: 'Learner',
      accountCode: inv.account?.account_code || 'Unknown'
    };

    let mappedStatus = 'Processing';
    if (inv.status === 'PAID') mappedStatus = 'Completed';
    else if (inv.status === 'CANCELLED' || inv.status === 'OVERDUE') mappedStatus = 'Failed';
    else if (inv.status === 'REFUNDED') mappedStatus = 'Refunded';

    let paidAmount = 0;
    let isInstallment = false;
    let installments: any[] = [];

    if (inv.invoice_installments && inv.invoice_installments.length > 0) {
      isInstallment = true;
      installments = inv.invoice_installments.sort((a: any, b: any) => a.installment_number - b.installment_number);
      paidAmount = installments.reduce((sum: number, inst: any) => sum + ((inst.status === 'PAID' || inst.status === 'REFUNDED') ? inst.amount : 0), 0);
    } else {
      paidAmount = (inv.status === 'PAID' || inv.status === 'REFUNDED') ? inv.amount : 0;
    }

    return {
      id: inv.invoice_code || inv.id,
      type: 'income',
      category: 'Course Registration',
      description: courseTitle || 'Unknown Course',
      user: userObj,
      date: new Date(inv.created_at).toISOString(),
      amount: inv.amount,
      paidAmount: paidAmount,
      status: mappedStatus as Transaction['status'],
      isInstallment: isInstallment,
      installments: installments
    };
  }

  private static mapRefundToTransaction(r: any): Transaction {
    const courseTitle = Array.isArray(r.invoices?.classes?.courses) 
      ? r.invoices.classes.courses[0]?.title 
      : r.invoices?.classes?.courses?.title;

    let reason = r.reason;
    const match = r.reason.match(/^(Term \d+) \| (.*)$/);
    if (match) {
      reason = match[2];
    }

    return {
      id: r.refund_code,
      type: 'expense',
      category: 'Course Refund',
      description: courseTitle || 'Unknown Course',
      user: { 
        name: r.account?.full_name || 'Unknown Learner', 
        role: 'Learner',
        accountCode: r.account?.account_code || 'Unknown'
      },
      date: r.processed_at || r.created_at,
      amount: r.amount,
      paidAmount: r.amount,
      status: r.status === 'COMPLETED' ? 'Completed' : 'Processing',
      reason: reason
    };
  }

  private static mapPayrollToTransaction(p: any): Transaction {
    const roleName = p.account?.roles?.name || p.account?.roles?.[0]?.name || 'Staff';
    return {
      id: p.payroll_code,
      type: 'expense',
      category: 'Salary Payment',
      description: `Salary for ${p.payroll_month}`,
      user: { 
        name: p.account?.full_name || 'Unknown', 
        role: roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase(),
        accountCode: p.account?.account_code || 'Unknown'
      },
      date: p.payment_date || p.updated_at || p.created_at,
      amount: p.net_pay,
      paidAmount: p.net_pay,
      status: 'Completed'
    };
  }

  static async getAllTransactions(): Promise<Transaction[]> {
    const invoices = await FinanceRepository.getAllInvoices();
    const transactions = invoices.map(inv => FinanceService.mapInvoiceToTransaction(inv));

    const refunds = await FinanceRepository.getAllRefunds();
    const refundTransactions = refunds.map(r => FinanceService.mapRefundToTransaction(r));

    const payrolls = await FinanceRepository.getAllPaidPayrolls();
    const payrollTransactions = payrolls.map(p => FinanceService.mapPayrollToTransaction(p));

    transactions.push(...refundTransactions);
    transactions.push(...payrollTransactions);

    // Sort transactions by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return transactions;
  }
}
