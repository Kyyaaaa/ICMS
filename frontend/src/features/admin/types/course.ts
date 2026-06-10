export interface Course {
    id: string;
    title: string;
    code: string;
    category: string;
    status: 'Active' | 'Hidden' | 'Draft';
    price: string;
    classes: number;
}
