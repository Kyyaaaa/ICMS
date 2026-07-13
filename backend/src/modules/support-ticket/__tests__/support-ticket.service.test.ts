import { SupportTicketService } from '../support-ticket.service';
import { SupportTicketRepository } from '../support-ticket.repository';

jest.mock('../support-ticket.repository');

describe('SupportTicketService access control', () => {
  beforeEach(() => jest.clearAllMocks());

  it('rejects access to another user ticket', async () => {
    (SupportTicketRepository.getTicketById as jest.Mock).mockResolvedValue({
      id: 'ticket-1',
      sender_id: 'owner-1'
    });

    await expect(
      SupportTicketService.getTicketMessages('ticket-1', 'user-2', 'LEARNER')
    ).rejects.toMatchObject({ status: 403 });
  });

  it('allows staff to read any ticket', async () => {
    (SupportTicketRepository.getTicketById as jest.Mock).mockResolvedValue({
      id: 'ticket-1',
      sender_id: 'owner-1'
    });
    (SupportTicketRepository.getTicketMessages as jest.Mock).mockResolvedValue([]);

    await expect(
      SupportTicketService.getTicketMessages('ticket-1', 'staff-1', 'STAFF')
    ).resolves.toEqual([]);
  });

  it('rejects unsupported status values', async () => {
    (SupportTicketRepository.getTicketById as jest.Mock).mockResolvedValue({
      id: 'ticket-1',
      sender_id: 'owner-1'
    });

    await expect(
      SupportTicketService.updateTicketStatus('ticket-1', 'Deleted', 'admin-1', 'ADMIN')
    ).rejects.toMatchObject({ status: 400 });
  });
});
