import type { DiscountCode } from '../types/discount-code';

let MOCK_DISCOUNT_CODES: DiscountCode[] = [
    { id: '1', code: 'SUMMER26', value: 150000, usageCount: 45, validFrom: '2026-06-01T00:00', validUntil: '2026-06-30T23:59', status: 'Active' },
    { id: '2', code: 'EARLYBIRD', value: 50000, usageCount: 10, validFrom: '2026-05-15T08:00', validUntil: '2026-05-20T12:00', status: 'Active' },
    { id: '3', code: 'WELCOME10', value: 100000, usageCount: 120, validFrom: '2026-01-01T00:00', validUntil: '2026-12-31T23:59', status: 'Active' },
    { id: '4', code: 'FLASHSALE', value: 300000, usageCount: 200, validFrom: '2026-05-10T10:00', validUntil: '2026-05-10T14:00', status: 'Expired' },
    { id: '5', code: 'STAFFONLY', value: 500000, usageCount: 5, validFrom: '2026-01-01T00:00', validUntil: '2026-12-31T23:59', status: 'Disabled' },
];

export const AdminDiscountCodesService = {
    getDiscountCodes: async (): Promise<DiscountCode[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_DISCOUNT_CODES]), 300));
    },

    createDiscountCode: async (code: Omit<DiscountCode, 'id' | 'usageCount'>): Promise<DiscountCode> => {
        return new Promise(resolve => setTimeout(() => {
            const newCode: DiscountCode = {
                ...code,
                id: Date.now().toString(),
                usageCount: 0
            };
            MOCK_DISCOUNT_CODES.push(newCode);
            resolve(newCode);
        }, 300));
    },

    updateDiscountCode: async (id: string, updates: Partial<DiscountCode>): Promise<DiscountCode> => {
        return new Promise(resolve => setTimeout(() => {
            const index = MOCK_DISCOUNT_CODES.findIndex(c => c.id === id);
            if (index !== -1) {
                MOCK_DISCOUNT_CODES[index] = { ...MOCK_DISCOUNT_CODES[index], ...updates };
                resolve(MOCK_DISCOUNT_CODES[index]);
            } else {
                throw new Error('Discount code not found');
            }
        }, 300));
    },

    deleteDiscountCode: async (id: string): Promise<boolean> => {
        return new Promise(resolve => setTimeout(() => {
            MOCK_DISCOUNT_CODES = MOCK_DISCOUNT_CODES.filter(c => c.id !== id);
            resolve(true);
        }, 300));
    }
};
