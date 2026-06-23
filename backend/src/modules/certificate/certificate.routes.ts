import express from 'express';
import { CertificateController } from './certificate.controller';
import { verifyToken, requireRole } from '../../middlewares/auth.middleware';
import { 
  validateCertificateIdParam, 
  validateCreateCertificateInput, 
  validateUpdateCertificateInput 
} from '../../middlewares/validators/certificate.validator';

const router = express.Router();

// Require authentication for all Certificate routes
router.use(verifyToken);

/**
 * @swagger
 * /api/Certificates:
 *   get:
 *     summary: Get logged in tutor's Certificates
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Certificates
 */
router.get('/', requireRole(['TUTOR']), CertificateController.getMyCertificates);

/**
 * @swagger
 * /api/Certificates/all:
 *   get:
 *     summary: Get all Certificates (for Admin/Staff)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (e.g., Pending Verification)
 *     responses:
 *       200:
 *         description: List of all Certificates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Certificate'
 */
router.get('/all', requireRole(['ADMIN', 'STAFF']), CertificateController.getAllCertificates);


/**
 * @swagger
 * /api/Certificates:
 *   post:
 *     summary: Create a new Certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuer:
 *                 type: string
 *               issue_date:
 *                 type: string
 *                 format: date
 *               expiration_date:
 *                 type: string
 *                 format: date
 *               file_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/', requireRole(['TUTOR']), validateCreateCertificateInput, CertificateController.createCertificate);

/**
 * @swagger
 * /api/Certificates/{id}:
 *   put:
 *     summary: Update a Certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuer:
 *                 type: string
 *               issue_date:
 *                 type: string
 *                 format: date
 *               expiration_date:
 *                 type: string
 *                 format: date
 *               file_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put('/:id', requireRole(['TUTOR', 'ADMIN', 'STAFF']), validateCertificateIdParam, validateUpdateCertificateInput, CertificateController.updateCertificate);

/**
 * @swagger
 * /api/Certificates/{id}/status:
 *   patch:
 *     summary: Update a Certificate status (Admin/Staff only)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Verified, Rejected, Pending Verification]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch('/:id/status', requireRole(['ADMIN', 'STAFF']), validateCertificateIdParam, CertificateController.changeStatus);

/**
 * @swagger
 * /api/Certificates/{id}:
 *   delete:
 *     summary: Delete a Certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete('/:id', requireRole(['TUTOR', 'ADMIN']), validateCertificateIdParam, CertificateController.deleteCertificate);

export default router;
