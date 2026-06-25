import { DiscountCodeRepository } from './discount-code.repository';
import { DiscountCode, CreateDiscountCodeDTO, UpdateDiscountCodeDTO } from './discount-code.model';

export class DiscountCodeService {
  private repository: DiscountCodeRepository;

  constructor() {
    this.repository = new DiscountCodeRepository();
  }

  private mapToDTO(row: any) {
    return {
      id: row.id,
      code: row.code,
      value: row.value,
      usageCount: row.usage_count,
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      status: row.status
    };
  }

  async getAllDiscountCodes() {
    const codes = await this.repository.findAll();
    return codes.map(row => this.mapToDTO(row));
  }

  async getDiscountCodeByCode(code: string) {
    const row = await this.repository.findByCode(code);
    if (!row) {
      throw new Error('Discount code not found');
    }
    return this.mapToDTO(row);
  }

  async validateDiscountCode(code: string) {
    const discount = await this.getDiscountCodeByCode(code);
    
    if (discount.status !== 'Active') {
      throw new Error('This discount code is inactive or expired');
    }

    const now = new Date();
    if (discount.validFrom && new Date(discount.validFrom) > now) {
      throw new Error('This discount code is not yet valid');
    }

    if (discount.validUntil && new Date(discount.validUntil) < now) {
      throw new Error('This discount code has expired');
    }

    return discount;
  }

  async createDiscountCode(data: CreateDiscountCodeDTO) {
    const row = await this.repository.create(data);
    return this.mapToDTO(row);
  }

  async updateDiscountCode(id: string, data: UpdateDiscountCodeDTO) {
    const row = await this.repository.update(id, data);
    if (!row) {
      throw new Error('Discount code not found');
    }
    return this.mapToDTO(row);
  }

  async deleteDiscountCode(id: string) {
    const row = await this.repository.delete(id);
    if (!row) {
      throw new Error('Discount code not found');
    }
    return true;
  }
}
