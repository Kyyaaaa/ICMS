import pool from '../../../configs/database';
import { RefundRepository } from '../refund.repository';

jest.mock('../../../configs/database', () => ({
  __esModule: true,
  default: { connect: jest.fn() }
}));

describe('RefundRepository transaction safety', () => {
  const query = jest.fn();
  const release = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (pool.connect as jest.Mock).mockResolvedValue({ query, release });
  });

  it('validates payment, attendance and duplicate requests before inserting', async () => {
    query.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM invoices')) {
        return { rows: [{ id: 'invoice-1', learner_id: 'learner-1', class_id: 'class-1', amount: 1000, status: 'PAID' }] };
      }
      if (sql.includes('MAX(created_at)')) {
        return { rows: [{ paid_at: new Date().toISOString() }] };
      }
      if (sql.includes('FROM attendances')) return { rows: [] };
      if (sql.includes('FROM refund_requests') && sql.includes('status IN')) return { rows: [] };
      if (sql.includes('next_number')) return { rows: [{ next_number: 1 }] };
      if (sql.includes('INSERT INTO refund_requests')) return { rows: [{ id: 'refund-1' }] };
      return { rows: [] };
    });

    await RefundRepository.create({
      invoice_id: 'invoice-1',
      learner_id: 'learner-1',
      amount: 1000,
      reason: 'Schedule conflict',
      bank_name: 'Bank',
      bank_account_name: 'Learner',
      bank_account_number: '123456789'
    });

    expect(query.mock.calls.some(([sql, params]) =>
      String(sql).includes('FROM attendances') && params[0] === 'class-1' && params[1] === 'learner-1'
    )).toBe(true);
    expect(query).toHaveBeenCalledWith('COMMIT');
    expect(release).toHaveBeenCalled();
  });
});
