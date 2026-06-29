export interface RefundRequest {
  id?: string;
  refund_code?: string;
  invoice_id: string;
  learner_id: string;
  amount: number;
  reason: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  status?: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  admin_notes?: string;
  processed_at?: string | null;
  created_at?: string;
}

export interface RefundStatusUpdate {
  status: 'APPROVED' | 'COMPLETED' | 'REJECTED';
  admin_notes?: string;
}
