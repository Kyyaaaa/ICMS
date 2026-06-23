export interface Transaction {
    id: string;
    type: string;
    category: string;
    description: string;
    user: { name: string; role: string };
    date: string;
    amount: number;
    status: string;
}
