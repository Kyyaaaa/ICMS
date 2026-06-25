import { FinanceRepository } from './finance.repository';
import { Transaction } from './finance.model';

export class FinanceService {
  static async getAllTransactions(): Promise<Transaction[]> {
    const invoices = await FinanceRepository.getAllInvoices();

    const transactions = invoices.map((inv: any) => {
      const courseTitle = Array.isArray(inv.classes?.courses) 
        ? inv.classes.courses[0]?.title 
        : inv.classes?.courses?.title;

      const userObj = { 
        name: inv.account?.full_name || 'Unknown Learner', 
        role: 'Learner',
        accountCode: inv.account?.account_code || 'Unknown'
      };

      let mappedStatus: 'Completed' | 'Processing' | 'Failed' = 'Processing';
      if (inv.status === 'PAID') mappedStatus = 'Completed';
      else if (inv.status === 'CANCELLED' || inv.status === 'OVERDUE') mappedStatus = 'Failed';

      let paidAmount = 0;
      let isInstallment = false;
      let installments: any[] = [];

      if (inv.invoice_installments && inv.invoice_installments.length > 0) {
        isInstallment = true;
        installments = inv.invoice_installments.sort((a: any, b: any) => a.installment_number - b.installment_number);
        paidAmount = installments.reduce((sum: number, inst: any) => sum + (inst.status === 'PAID' ? inst.amount : 0), 0);
      } else {
        paidAmount = inv.status === 'PAID' ? inv.amount : 0;
      }

      return {
        id: inv.invoice_code || inv.id,
        type: 'income' as 'income' | 'expense',
        category: 'Course Registration',
        description: courseTitle || 'Unknown Course',
        user: userObj,
        date: new Date(inv.created_at).toISOString(),
        amount: inv.amount,
        paidAmount: paidAmount,
        status: mappedStatus,
        isInstallment: isInstallment,
        installments: installments
      };
    });

    // Sort transactions by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return transactions;
  }
}
