import { Router } from 'express';
import { AvailableTimeSlotController } from './available-time-slot.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';

const router = Router();

// Cycles management
router.get(
  '/cycles',
  verifyToken,
  AvailableTimeSlotController.getCycles
);

router.get(
  '/cycles/by-month',
  verifyToken,
  AvailableTimeSlotController.getOrCreateCycleByMonth
);

router.patch(
  '/cycles/:id/status',
  verifyToken,
  requireRole(['STAFF', 'ACADEMIC_MANAGER']),
  AvailableTimeSlotController.updateCycleStatus
);

// Routes for Tutors to manage their own availability
router.get(
  '/my-availability',
  verifyToken,
  requireRole(['TUTOR']),
  AvailableTimeSlotController.getMyAvailability
);

router.post(
  '/submit',
  verifyToken,
  requireRole(['TUTOR']),
  AvailableTimeSlotController.submitAvailability
);

// Routes for Staff to manage tutor availabilities
router.get(
  '/staff/tutors',
  verifyToken,
  requireRole(['STAFF', 'ADMIN']),
  AvailableTimeSlotController.getAllTutorsAvailability
);

router.put(
  '/staff/tutors/:tutorId',
  verifyToken,
  requireRole(['STAFF', 'ADMIN']),
  AvailableTimeSlotController.staffUpdateTutorAvailability
);

export default router;
