import express from 'express';
import { createTicket, getTickets, getTicketMessages, replyToTicket, updateTicketStatus } from './support-ticket.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = express.Router();

router.use(verifyToken);

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id/messages', getTicketMessages);
router.post('/:id/messages', replyToTicket);
router.patch('/:id/status', requireRole(['STAFF', 'ADMIN']), updateTicketStatus);

export default router;
