export interface Installment {
    id: string;
    term: string;
    dueDate: string;
    status: string;
    method: string;
    paidDate: string | null;
    amount: number;
}

export interface Invoice {
    id: string;
    learner: string;
    course: string;
    paymentMethod: string;
    progress: string;
    totalAmount: string;
    paidAmount: string;
    date: string;
    status: string;
    installments: Installment[];
    rawPaid: number;
    rawTotal: number;
    rawRemaining: number;
}

export interface DetailedInvoice {
    id: string;
    status: string;
    issueDate: string;
    dueDate: string;
    learner: {
        name: string;
        email: string;
        phone: string;
        id: string;
    };
    course: {
        name: string;
        code: string;
        duration: string;
        startDate: string;
    };
    payment: {
        method: string;
        totalAmount: number;
        paidAmount: number;
        remainingAmount: number;
        installments: Installment[];
    };
}

