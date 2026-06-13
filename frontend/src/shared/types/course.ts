export interface Course {
    id: string;
    title: string;
    code: string;
    category: string;
    status: 'Active' | 'Hidden' | 'Draft';
    price: string | number;
    classes?: number;
    type?: string;
    description?: string;
    duration?: string;
    sessions?: number | string;
    format?: string;
    band?: string;
    original_price?: string | number;
    next_cohort?: string;
    image_url?: string;
    modules?: any[];
}
