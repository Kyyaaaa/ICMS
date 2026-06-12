export interface PaymentInstallment {
    id: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue' | 'refunded' | 'cancelled';
    paidDate?: string;
}

export interface PaymentInvoice {
    id: string;
    course: string;
    date: string;
    amount: number;
    discount?: number;
    status: 'paid' | 'pending' | 'refunded' | 'cancelled' | 'expired' | 'partial';
    installments?: PaymentInstallment[];
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
