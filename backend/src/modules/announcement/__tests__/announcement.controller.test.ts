import request from 'supertest';
import app from '../../../app';
import { AnnouncementService } from '../announcement.service';

// Mock Auth Middleware to bypass authentication for tests
jest.mock('../../../middlewares/auth.middleware', () => ({
    verifyToken: (req: any, _res: any, next: any) => {
        req.user = { id: 'test_user', role: 'admin' };
        next();
    },
    requireRole: (_roles: any) => (_req: any, _res: any, next: any) => next(),
}));

describe('Announcement Controller', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /api/announcements', () => {
        it('should return all announcements', async () => {
            const mockAnnouncements: any[] = [{ id: '1', title: 'Test', content: 'Test Content' }];
            jest.spyOn(AnnouncementService, 'getAnnouncements').mockResolvedValue(mockAnnouncements);

            const res = await request(app).get('/api/announcements');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockAnnouncements);
        });

        it('should return 500 on error', async () => {
            jest.spyOn(AnnouncementService, 'getAnnouncements').mockRejectedValue(new Error('DB Error'));

            const res = await request(app).get('/api/announcements');

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('DB Error');
        });
    });

    describe('POST /api/announcements', () => {
        it('should create an announcement successfully', async () => {
            const mockData: any = { id: '1', title: 'New Ann' };
            jest.spyOn(AnnouncementService, 'createAnnouncement').mockResolvedValue(mockData);

            const res = await request(app).post('/api/announcements').send({
                title: 'New Ann',
                content: 'Content',
                audience: { scope: 'System Wide' }
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockData);
        });

        it('should return 400 on error', async () => {
            jest.spyOn(AnnouncementService, 'createAnnouncement').mockRejectedValue(new Error('Title is required'));

            const res = await request(app).post('/api/announcements').send({
                content: 'Missing title',
                audience: { scope: 'System Wide' }
            });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Title is required');
        });
    });
});
