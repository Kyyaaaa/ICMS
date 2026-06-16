import express from 'express';
import { createTicket, getTickets, getTicketMessages, replyToTicket, updateTicketStatus } from './support-ticket.controller';
// import { authMiddleware } from '../../middlewares/auth.middleware'; // Assuming there's an auth middleware, we'll keep it simple or uncomment if it exists

const router = express.Router();

// Currently leaving routes open or expecting sender_id in body/query for easy testing if auth middleware isn't wired up.
// Normally, we'd use router.use(authMiddleware)

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id/messages', getTicketMessages);
router.post('/:id/messages', replyToTicket);
router.patch('/:id/status', updateTicketStatus);

export default router;
