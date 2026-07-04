import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);

// Learner Dashboard
router.get('/learner/stats', requireRole(['LEARNER']), DashboardController.getLearnerStats);
router.get('/learner/upcoming-classes', requireRole(['LEARNER']), DashboardController.getLearnerUpcomingClasses);
router.get('/learner/pending-tasks', requireRole(['LEARNER']), DashboardController.getLearnerPendingTasks);

// Tutor Dashboard
router.get('/tutor/stats', requireRole(['TUTOR']), DashboardController.getTutorStats);
router.get('/tutor/upcoming-classes', requireRole(['TUTOR']), DashboardController.getTutorUpcomingClasses);
router.get('/tutor/pending-tasks', requireRole(['TUTOR']), DashboardController.getTutorPendingTasks);

// Staff Dashboard
router.get('/staff/stats', requireRole(['STAFF', 'ADMIN']), DashboardController.getStaffStats);
router.get('/staff/upcoming-classes', requireRole(['STAFF', 'ADMIN']), DashboardController.getStaffUpcomingClasses);
router.get('/staff/pending-tasks', requireRole(['STAFF', 'ADMIN']), DashboardController.getStaffPendingTasks);

// Admin Dashboard
router.get('/admin/stats', requireRole(['ADMIN']), DashboardController.getAdminStats);

export default router;

