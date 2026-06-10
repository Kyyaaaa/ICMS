export interface PaymentInvoice {
    id: string;
    course: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'refunded';
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
