export interface Installment {
  installment_number: number;
  amount: number;
  status: string;
  due_date: string;
  paid_date: string | null;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  user: {
    name: string;
    role: string;
    accountCode: string;
  };
  date: string;
  amount: number;
  paidAmount: number;
  status: 'Completed' | 'Processing' | 'Failed' | 'Refunded';
  isInstallment?: boolean;
  installments?: Installment[];
  reason?: string;
}
