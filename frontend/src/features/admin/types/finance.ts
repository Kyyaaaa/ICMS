export interface Installment {
    installment_number: number;
    amount: number;
    status: string;
    due_date: string;
    paid_date: string | null;
}

export interface Transaction {
    id: string;
    type: string;
    category: string;
    description: string;
    user: { name: string; role: string; accountCode?: string };
    date: string;
    amount: number;
    paidAmount: number;
    status: string;
    isInstallment?: boolean;
    installments?: Installment[];
}
