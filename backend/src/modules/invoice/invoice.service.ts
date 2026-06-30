import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './invoice.model';
import { EnrollmentService } from '../enrollment/enrollment.service';

import { DiscountCodeRepository } from '../discount-code/discount-code.repository';

export class InvoiceService {
  static async checkout(learnerId: string, classId: string, paymentPlan: string = 'full', discountCode?: string) {
    const classData = await InvoiceRepository.getClassAndCourse(classId);
    if (!classData || !classData.courses) {
      throw new Error('Class or Course not found');
    }

    // 1. Check for registration conflicts via EnrollmentService
    const targetCourseId = Array.isArray(classData.courses) ? classData.courses[0]?.id : classData.courses.id;
    await EnrollmentService.checkRegistrationConflicts(learnerId, classId, targetCourseId);

    // 2. Check if there is an existing PENDING invoice
    const pendingInvoice = await InvoiceRepository.getPendingInvoice(learnerId, classId);
    if (pendingInvoice) {
      // If the user attempts to enroll again, we delete the old pending invoice to reset the 15-minute window and apply any new discounts
      await InvoiceRepository.deleteInvoice(pendingInvoice.id);
    }

    // 3. Process discount code if provided
    let discountAmount = 0;
    let discountCodeId = null;

    if (discountCode) {
      const discountRepo = new DiscountCodeRepository();
      const codeData = await discountRepo.findByCode(discountCode);
      if (!codeData) {
        throw new Error('Invalid discount code');
      }
      if (codeData.status !== 'Active') {
        throw new Error('This discount code is inactive or expired');
      }
      const now = new Date();
      if (codeData.valid_from && new Date(codeData.valid_from) > now) {
        throw new Error('This discount code is not yet valid');
      }
      if (codeData.valid_until && new Date(codeData.valid_until) < now) {
        throw new Error('This discount code has expired');
      }

      const isUsed = await InvoiceRepository.checkDiscountCodeUsed(learnerId, codeData.id);
      if (isUsed) {
        throw new Error('You have already used this discount code');
      }

      discountAmount = codeData.value;
      discountCodeId = codeData.id;
    }

    // 4. Create new invoice
    const originalAmount = Array.isArray(classData.courses) ? classData.courses[0]?.price : classData.courses.price || 0;
    let finalAmount = originalAmount - discountAmount;
    if (finalAmount < 0) finalAmount = 0;

    const newInvoice = await InvoiceRepository.createInvoice(learnerId, classId, finalAmount, discountAmount, discountCodeId, paymentPlan);
    
    // Optionally handle installments if paymentPlan is 'installment'
    if (paymentPlan === 'installment') {
       await InvoiceRepository.generateInstallments(newInvoice.id, finalAmount);
    }
    
    return { invoice: newInvoice, isExisting: false };
  }

  static async cancelInvoice(invoiceId: string, learnerId: string) {
    const invoice = await InvoiceRepository.cancelInvoice(invoiceId, learnerId);
    
    // Delegate the enrollment cancellation to EnrollmentService
    await EnrollmentService.cancelEnrollmentByLearnerAndClass(learnerId, invoice.class_id);
    
    return true;
  }
}
