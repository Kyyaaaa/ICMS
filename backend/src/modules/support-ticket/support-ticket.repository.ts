import pool from '../../configs/database';
import { CreateSupportTicketDTO, CreateTicketMessageDTO, } from './support-ticket.model';

const TICKET_SELECT_FIELDS = `
    t.*, a.full_name as sender_name,
    (SELECT text FROM ticket_messages m WHERE m.ticket_id = t.id ORDER BY created_at DESC LIMIT 1) as last_message,
    (SELECT sender_id FROM ticket_messages m WHERE m.ticket_id = t.id ORDER BY created_at DESC LIMIT 1) as last_message_sender_id
`;

export const SupportTicketRepository = {
    async createTicket(data: CreateSupportTicketDTO) {
        const query = `
            INSERT INTO support_tickets (ticket_number, title, category, description, sender_id, sender_role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [data.ticket_number, data.title, data.category, data.description, data.sender_id, data.sender_role];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getTicketsBySender(sender_id: string) {
        const query = `
            SELECT ${TICKET_SELECT_FIELDS}
            FROM support_tickets t
            LEFT JOIN account a ON t.sender_id = a.id
            WHERE t.sender_id = $1
            ORDER BY t.updated_at DESC;
        `;
        const result = await pool.query(query, [sender_id]);
        return result.rows;
    },

    async getAllTickets() {
        const query = `
            SELECT ${TICKET_SELECT_FIELDS}
            FROM support_tickets t
            LEFT JOIN account a ON t.sender_id = a.id
            ORDER BY t.updated_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    async getTicketById(id: string) {
        const query = `
            SELECT ${TICKET_SELECT_FIELDS}
            FROM support_tickets t
            LEFT JOIN account a ON t.sender_id = a.id
            WHERE t.id = $1;
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async updateTicketStatus(id: string, status: string) {
        const query = `
            UPDATE support_tickets
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [status, id]);
        return result.rows[0];
    },

    async createMessage(data: CreateTicketMessageDTO) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const messageQuery = `
                INSERT INTO ticket_messages (ticket_id, sender_id, sender_role, text)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const messageValues = [data.ticket_id, data.sender_id, data.sender_role, data.text];
            const messageResult = await client.query(messageQuery, messageValues);
            
            const updateTicketQuery = `
                UPDATE support_tickets
                SET updated_at = NOW(),
                    status = CASE WHEN status = 'Open' AND $2 IN ('STAFF', 'ADMIN') THEN 'In Progress' ELSE status END
                WHERE id = $1;
            `;
            await client.query(updateTicketQuery, [data.ticket_id, data.sender_role]);
            
            await client.query('COMMIT');
            return messageResult.rows[0];
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    async getTicketMessages(ticket_id: string) {
        const query = `
            SELECT * FROM ticket_messages
            WHERE ticket_id = $1
            ORDER BY created_at ASC;
        `;
        const result = await pool.query(query, [ticket_id]);
        return result.rows;
    }
};
