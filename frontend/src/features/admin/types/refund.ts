export interface RefundRequest {
    id: string; // REF-xxxx
    invoiceId: string; // INV-xxxx
    installment: string; 
    studentName: string;
    studentEmail: string;
    courseName: string;
    totalPaid: number;
    refundAmount: number;
    reason: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    requestedDate: string;
    processedDate?: string;
    status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
    notes?: string;
    approvedDate?: string;
    dbId?: string;
    proofImageUrl?: string;
}
