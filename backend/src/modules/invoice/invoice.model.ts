export interface Invoice {
  id: string;
  invoice_code?: string;
  learner_id: string;
  class_id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED' | 'OVERDUE';
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceInstallment {
  id: string;
  invoice_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  created_at?: string;
  updated_at?: string;
}
