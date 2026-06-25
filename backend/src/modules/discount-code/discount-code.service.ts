import { DiscountCodeRepository } from './discount-code.repository';
import { DiscountCode, CreateDiscountCodeDTO, UpdateDiscountCodeDTO } from './discount-code.model';

export class DiscountCodeService {
  private repository: DiscountCodeRepository;

  constructor() {
    this.repository = new DiscountCodeRepository();
  }

  async getAllDiscountCodes() {
    const codes = await this.repository.findAll();
    return codes.map(row => ({
      id: row.id,
      code: row.code,
      value: row.value,
      usageCount: row.usage_count,
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      status: row.status
    }));
  }

  async getDiscountCodeByCode(code: string) {
    const row = await this.repository.findByCode(code);
    if (!row) {
      throw new Error('Discount code not found');
    }
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

  async createDiscountCode(data: CreateDiscountCodeDTO) {
    const row = await this.repository.create(data);
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

  async updateDiscountCode(id: string, data: UpdateDiscountCodeDTO) {
    const row = await this.repository.update(id, data);
    if (!row) {
      throw new Error('Discount code not found');
    }
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

  async deleteDiscountCode(id: string) {
    const row = await this.repository.delete(id);
    if (!row) {
      throw new Error('Discount code not found');
    }
    return true;
  }
}
