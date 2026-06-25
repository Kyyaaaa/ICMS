export interface DiscountCode {
  id: string;
  code: string;
  value: number;
  usage_count: number;
  valid_from: Date | string;
  valid_until: Date | string;
  status: 'Active' | 'Expired' | 'Disabled';
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface CreateDiscountCodeDTO {
  code: string;
  value: number;
  validFrom: string;
  validUntil: string;
  status?: 'Active' | 'Expired' | 'Disabled';
}

export interface UpdateDiscountCodeDTO {
  code: string;
  value: number;
  validFrom: string;
  validUntil: string;
  status: 'Active' | 'Expired' | 'Disabled';
}
