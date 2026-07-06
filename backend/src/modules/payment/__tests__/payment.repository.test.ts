import pool from '../../../configs/database';
import { PaymentRepository } from '../payment.repository';

jest.mock('../../../configs/database', () => ({
  __esModule: true,
  default: { connect: jest.fn() }
}));

describe('PaymentRepository transaction safety', () => {
  const release = jest.fn();
  const query = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (pool.connect as jest.Mock).mockResolvedValue({ query, release });
  });

  it('rolls back when the paid amount differs from the invoice', async () => {
    query.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM invoices i')) {
        return {
          rows: [{ id: 'invoice-1', invoice_code: 'IN0001', learner_id: 'learner-1', class_id: 'class-1', amount: 500, status: 'PENDING', capacity: 10 }]
        };
      }
      return { rows: [] };
    });

    await expect(
      PaymentRepository.recordPaymentAndEnroll('IN0001', 400, 'txn-1')
    ).rejects.toThrow('Payment amount does not match invoice amount');

    expect(query).toHaveBeenCalledWith('ROLLBACK');
    expect(release).toHaveBeenCalled();
  });

  it('commits payment and enrollment together', async () => {
    query.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM invoices i')) {
        return {
          rows: [{ id: 'invoice-1', invoice_code: 'IN0001', learner_id: 'learner-1', class_id: 'class-1', amount: 500, status: 'PENDING', capacity: 10 }]
        };
      }
      if (sql.includes('SELECT count(*) FROM enrollments')) return { rows: [{ count: '0' }] };
      if (sql.includes('SELECT id, status FROM enrollments')) return { rows: [] };
      if (sql.includes('INSERT INTO enrollments')) return { rows: [{ id: 'enrollment-1' }] };
      return { rows: [] };
    });

    await PaymentRepository.recordPaymentAndEnroll('IN0001', 500, 'txn-1');

    expect(query.mock.calls.some(([sql]) => String(sql).includes('INSERT INTO payments'))).toBe(true);
    expect(query).toHaveBeenCalledWith('COMMIT');
    expect(release).toHaveBeenCalled();
  });

  it('rejects a successful callback for a cancelled invoice', async () => {
    query.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM invoices i')) {
        return {
          rows: [{ id: 'invoice-1', invoice_code: 'IN0001', learner_id: 'learner-1', class_id: 'class-1', amount: 500, status: 'CANCELLED', capacity: 10 }]
        };
      }
      return { rows: [] };
    });

    await expect(
      PaymentRepository.recordPaymentAndEnroll('IN0001', 500, 'txn-cancelled')
    ).rejects.toThrow('Invoice is not payable');

    expect(query).toHaveBeenCalledWith('ROLLBACK');
    expect(query.mock.calls.some(([sql]) => String(sql).includes('INSERT INTO payments'))).toBe(false);
  });

  it('treats a repeated successful transaction as idempotent', async () => {
    query.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM invoices i')) {
        return {
          rows: [{ id: 'invoice-1', invoice_code: 'IN0001', learner_id: 'learner-1', class_id: 'class-1', amount: 500, status: 'PENDING', capacity: 10 }]
        };
      }
      if (sql.includes('FROM payments')) {
        return { rows: [{ invoice_id: 'invoice-1', amount: 500, status: 'SUCCESS' }] };
      }
      return { rows: [] };
    });

    await PaymentRepository.recordPaymentAndEnroll('IN0001', 500, 'txn-existing');

    expect(query).toHaveBeenCalledWith('COMMIT');
    expect(query.mock.calls.some(([sql]) => String(sql).includes('INSERT INTO payments'))).toBe(false);
  });

  it('serializes callbacks by VNPay transaction number', async () => {
    query.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM invoices i')) {
        return {
          rows: [{ id: 'invoice-1', invoice_code: 'IN0001', learner_id: 'learner-1', class_id: 'class-1', amount: 500, status: 'PAID', capacity: 10 }]
        };
      }
      return { rows: [] };
    });

    await PaymentRepository.recordPaymentAndEnroll('IN0001', 500, 'txn-locked');

    expect(query).toHaveBeenCalledWith(
      'SELECT pg_advisory_xact_lock(hashtext($1))',
      ['txn-locked']
    );
  });
});
