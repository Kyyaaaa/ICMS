import pool from '../../configs/database';
import { DiscountCode, CreateDiscountCodeDTO, UpdateDiscountCodeDTO } from './discount-code.model';

export class DiscountCodeRepository {
  async findAll(): Promise<DiscountCode[]> {
    const result = await pool.query('SELECT * FROM discount_codes ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: string): Promise<DiscountCode | null> {
    const result = await pool.query('SELECT * FROM discount_codes WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByCode(code: string): Promise<DiscountCode | null> {
    const result = await pool.query('SELECT * FROM discount_codes WHERE code = $1', [code]);
    return result.rows[0] || null;
  }

  async create(data: CreateDiscountCodeDTO): Promise<DiscountCode> {
    const { code, value, validFrom, validUntil, status } = data;
    const result = await pool.query(
      `INSERT INTO discount_codes (code, value, valid_from, valid_until, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [code, value, validFrom, validUntil, status || 'Active']
    );
    return result.rows[0];
  }

  async update(id: string, data: UpdateDiscountCodeDTO): Promise<DiscountCode | null> {
    const { code, value, validFrom, validUntil, status } = data;
    const result = await pool.query(
      `UPDATE discount_codes 
       SET code = $1, value = $2, valid_from = $3, valid_until = $4, status = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [code, value, validFrom, validUntil, status, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<DiscountCode | null> {
    const result = await pool.query('DELETE FROM discount_codes WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
}
