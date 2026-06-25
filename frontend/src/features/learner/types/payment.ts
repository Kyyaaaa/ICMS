export interface PaymentInstallment {
    id: string;
    installmentNumber?: number;
    amount: number;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue' | 'refunded' | 'cancelled';
    paidDate?: string;
}

export interface PaymentInvoice {
    id: string;
    dbId?: string;
    course: string;
    date: string;
    amount: number;
    discount?: number;
    status: 'paid' | 'pending' | 'refunded' | 'cancelled' | 'expired' | 'partial';
    installments?: PaymentInstallment[];
    learnerName?: string;
    learnerEmail?: string;
    createdAt?: string;
    hasPendingRefund?: boolean;
}

export interface PaymentCourseInfo {
    title: string;
    duration: string;
    sessions: number;
    price: number;
    format: string;
    band: string;
}

export interface PaymentClassInfo {
    name: string;
    schedule: string;
    room: string;
    currentStudents: number;
    maxStudents: number;
}
