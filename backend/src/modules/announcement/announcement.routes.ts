import { Router } from 'express';
import { AnnouncementController } from './announcement.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Announcement
 *   description: API quản lý thông báo (Announcement)
 */

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: Lấy danh sách tất cả thông báo
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', verifyToken, AnnouncementController.getAnnouncements);

/**
 * @swagger
 * /api/announcements/public/notifications:
 *   get:
 *     summary: Lấy danh sách thông báo cho Guest (public)
 *     tags: [Announcement]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/public/notifications', AnnouncementController.getPublicNotifications);

/**
 * @swagger
 * /api/announcements/notifications:
 *   get:
 *     summary: Lấy danh sách thông báo theo role của user
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: true
 *         description: Role của user (VD Learner, Staff, Admin, Tutor)
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/notifications', verifyToken, AnnouncementController.getNotifications);

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: Tạo thông báo mới
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - audience
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               audience:
 *                 type: object
 *                 properties:
 *                   scope:
 *                     type: string
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                   classes:
 *                     type: array
 *                     items:
 *                       type: string
 *               scheduledFor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', verifyToken, requireRole(['ADMIN']), AnnouncementController.createAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}:
 *   put:
 *     summary: Cập nhật thông báo
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               audience:
 *                 type: object
 *               scheduledFor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', verifyToken, requireRole(['ADMIN']), AnnouncementController.updateAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}:
 *   delete:
 *     summary: Xóa thông báo
 *     tags: [Announcement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', verifyToken, requireRole(['ADMIN']), AnnouncementController.deleteAnnouncement);

export default router;
