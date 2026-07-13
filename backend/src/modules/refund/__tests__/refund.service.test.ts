import { RefundService } from '../refund.service';
import { RefundRepository } from '../refund.repository';
import { InvoiceRepository } from '../../invoice/invoice.repository';

jest.mock('../refund.repository');
jest.mock('../../invoice/invoice.repository');

describe('RefundService financial validation', () => {
  const request = {
    invoice_id: 'invoice-1',
    learner_id: 'learner-1',
    amount: 1000,
    reason: 'Schedule conflict',
    bank_name: 'Bank',
    bank_account_name: 'Learner',
    bank_account_number: '123456789'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (InvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue({
      id: 'invoice-1',
      learner_id: 'learner-1',
      amount: 1000,
      status: 'PAID'
    });
    (RefundRepository.create as jest.Mock).mockResolvedValue({ id: 'refund-1' });
  });

  it('rejects a client-supplied partial refund amount', async () => {
    await expect(
      RefundService.createRefundRequest({ ...request, amount: 500 })
    ).rejects.toThrow('Refund amount must equal the fully paid invoice amount');

    expect(RefundRepository.create).not.toHaveBeenCalled();
  });

  it('rejects refunds for invoices that are not fully paid', async () => {
    (InvoiceRepository.getInvoiceById as jest.Mock).mockResolvedValue({
      id: 'invoice-1',
      learner_id: 'learner-1',
      amount: 1000,
      status: 'PARTIAL'
    });

    await expect(RefundService.createRefundRequest(request)).rejects.toThrow(
      'Only PAID invoices can be refunded'
    );
  });

  it('creates a full refund using the invoice amount', async () => {
    await RefundService.createRefundRequest(request);

    expect(RefundRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1000 })
    );
  });
});
