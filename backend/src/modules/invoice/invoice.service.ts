import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './invoice.model';
import { EnrollmentService } from '../enrollment/enrollment.service';

export class InvoiceService {
  static async checkout(learnerId: string, classId: string, paymentPlan: string = 'full') {
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
      return { invoice: pendingInvoice, isExisting: true };
    }

    // 3. Create new invoice
    const amount = Array.isArray(classData.courses) ? classData.courses[0]?.price : classData.courses.price || 0;
    const newInvoice = await InvoiceRepository.createInvoice(learnerId, classId, amount, paymentPlan);
    
    // Optionally handle installments if paymentPlan is 'installment'
    if (paymentPlan === 'installment') {
       await InvoiceRepository.generateInstallments(newInvoice.id, amount);
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
