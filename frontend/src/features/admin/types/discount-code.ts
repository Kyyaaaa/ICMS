export interface DiscountCode {
    id: string;
    code: string;
    value: number;
    usageCount: number;
    validFrom: string;
    validUntil: string;
    status: 'Active' | 'Expired' | 'Disabled';
}
