import { Routes, Route } from "react-router-dom";

// Auth Routes
import Register from "@/features/auth/routes/register.tsx";
import Login from "@/features/auth/routes/login.tsx";
import ForgotPassword from "@/features/auth/routes/forgot-password.tsx";
import VerifyOTP from "@/features/auth/routes/verify-otp.tsx";
import ResetPassword from "@/features/auth/routes/reset-password.tsx";
import AuthCallback from "@/features/auth/routes/auth-callback.tsx";

// Global App Routes
import Homepage from "@/app/routes/homepage.tsx";
import Courses from "@/app/routes/courses.tsx";
import CourseDetail from "@/app/routes/course-detail.tsx";
import PublicNotifications from "@/app/routes/public-notifications.tsx";

// Learner Views
import LearnerLayout from "@/shared/components/layout/LearnerLayout.tsx";
import LearnerDashboard from "@/features/learner/routes/dashboard.tsx";
import LearnerProfile from "@/features/learner/routes/profile.tsx";
import LearnerClasses from "@/features/learner/routes/classes.tsx";
import ClassDetail from "@/features/learner/routes/class-detail.tsx";
import ClassFeedback from "@/features/learner/routes/class-feedback.tsx";
import AttendanceProgress from "@/features/learner/routes/attendance.tsx";
import LearnerSchedules from "@/features/learner/routes/schedules.tsx";
import ClassRegistration from "@/features/learner/routes/registration.tsx";
import PaymentHistory from "@/features/learner/routes/payments.tsx";
import PaymentDetail from "@/features/learner/routes/payment-detail.tsx";
import PaymentCheckout from "@/features/learner/routes/checkout.tsx";
import RefundRequest from "@/features/learner/routes/refund.tsx";
import LearnerGrades from "@/features/learner/routes/grades.tsx";
// Staff Views
import StaffLayout from "@/shared/components/layout/StaffLayout.tsx";
import StaffDashboard from "@/features/staff/routes/dashboard.tsx";
import ConsultationList from "@/features/staff/routes/consultations.tsx";

import ManageClasses from "@/features/staff/routes/classes.tsx";
import CreateClass from "@/features/staff/routes/create-class.tsx";
import StaffClassDetail from "@/features/staff/routes/class-detail.tsx";
import MasterSchedule from "@/features/staff/routes/master-schedule.tsx";
import ChangeRequests from "@/features/staff/routes/change-requests.tsx";
import InvoiceList from "@/features/staff/routes/invoices.tsx";
import InvoiceDetail from "@/features/staff/routes/invoice-detail.tsx";
import StaffProfile from "@/features/staff/routes/my-profile.tsx";
import StaffTutorAvailability from "@/features/staff/routes/tutor-availability.tsx";
import ManageAccounts from "@/features/staff/routes/accounts.tsx";
import StaffAccountDetail from "@/features/staff/routes/account-detail.tsx";
import SalaryHistory from "@/features/staff/routes/salary.tsx";
import StaffCertificates from "@/features/staff/routes/certificates.tsx";
import { StaffSupportTickets } from "@/features/staff/routes/support-tickets.tsx";

// Admin Views
import { AdminLayout } from "@/shared/components/layout/AdminLayout.tsx";
import AdminDashboard from "@/features/admin/routes/dashboard.tsx";
import AdminCourses from "@/features/admin/routes/courses.tsx";
import CreateCourse from "@/features/admin/routes/create-course.tsx";
import AdminCourseDetail from "@/features/admin/routes/course-detail.tsx";
import AdminDiscountCodes from "@/features/admin/routes/discount-codes.tsx";
import AdminClassrooms from "@/features/admin/routes/classrooms.tsx";
import AdminAccounts from "@/features/admin/routes/accounts.tsx";
import AdminAccountDetail from "@/features/admin/routes/account-detail.tsx";
import AdminRefunds from "@/features/admin/routes/refunds.tsx";
import AdminRefundDetail from "@/features/admin/routes/refund-detail.tsx";
import AdminPayroll from "@/features/admin/routes/payroll.tsx";
import AdminPayrollDetail from "@/features/admin/routes/payroll-detail.tsx";
import AdminAnnouncements from "@/features/admin/routes/announcements.tsx";
import AdminAuditLogs from "@/features/admin/routes/audit-logs.tsx";
import AdminProfile from "@/features/admin/routes/profile.tsx";
import AdminFinance from "@/features/admin/routes/finance.tsx";

// Tutor Views
import TutorLayout from "@/shared/components/layout/TutorLayout.tsx";
import TutorDashboard from "@/features/tutor/routes/dashboard.tsx";
import TutorProfile from "@/features/tutor/routes/profile.tsx";
import TutorCertificates from "@/features/tutor/routes/certificates.tsx";
import AvailabilityRegistration from "@/features/tutor/routes/availability.tsx";
import TeachingSchedule from "@/features/tutor/routes/schedule.tsx";
import TutorChangeRequests from "@/features/tutor/routes/change-requests.tsx";
import TutorSalaryHistory from "@/features/tutor/routes/salary.tsx";
// import { TutorSupportTickets } from "@/features/tutor/routes/support-tickets.tsx";
import TutorClasses from "@/features/tutor/routes/classes";
import TutorClassDetail from "@/features/tutor/routes/class-detail";
import TutorAttendance from "@/features/tutor/routes/attendance.tsx";
import TutorGradebook from "@/features/tutor/routes/gradebook.tsx";
// Shared Views
import { NotificationsPage } from "@/shared/components/common/NotificationsPage.tsx";
import { SupportTickets } from "@/shared/components/common/SupportTickets.tsx";

// Auth Components
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute.tsx";
import { GuestRoute } from "@/features/auth/components/GuestRoute.tsx";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route element={<GuestRoute />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/courses/:courseId/register" element={<ClassRegistration />} />
      <Route path="/notifications" element={<PublicNotifications />} />

      {/* Learner Routes wrapped in Layout */}
      <Route element={<ProtectedRoute allowedRoles={["LEARNER"]} />}>
        <Route element={<LearnerLayout />}>
          <Route path="/learner/dashboard" element={<LearnerDashboard />} />
          <Route path="/learner/profile" element={<LearnerProfile />} />
          <Route
            path="/learner/notifications"
            element={<NotificationsPage />}
          />

          <Route path="/learner/classes" element={<LearnerClasses />} />
          <Route path="/learner/classes/:id" element={<ClassDetail />} />
          <Route
            path="/learner/classes/:id/feedback"
            element={<ClassFeedback />}
          />
          <Route
            path="/learner/classes/:id/attendance"
            element={<AttendanceProgress />}
          />

          <Route path="/learner/grades" element={<LearnerGrades />} />

          <Route path="/learner/schedules" element={<LearnerSchedules />} />


          <Route path="/learner/payments" element={<PaymentHistory />} />
          <Route path="/learner/payments/:id" element={<PaymentDetail />} />
          <Route
            path="/learner/payments/:id/checkout"
            element={<PaymentCheckout />}
          />
          <Route
            path="/learner/payments/:id/refund"
            element={<RefundRequest />}
          />

          <Route path="/learner/support" element={<SupportTickets />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["STAFF"]} />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/profile" element={<StaffProfile />} />
          <Route path="/staff/notifications" element={<NotificationsPage />} />

          <Route path="/staff/consultations" element={<ConsultationList />} />

          <Route path="/staff/classes" element={<ManageClasses />} />
          <Route path="/staff/classes/create" element={<CreateClass />} />
          <Route path="/staff/classes/edit/:id" element={<CreateClass />} />
          <Route path="/staff/classes/:id" element={<StaffClassDetail />} />
          <Route path="/staff/master-schedule" element={<MasterSchedule />} />
          <Route
            path="/staff/tutor-availability"
            element={<StaffTutorAvailability />}
          />

          <Route path="/staff/change-requests" element={<ChangeRequests />} />

          <Route path="/staff/invoices" element={<InvoiceList />} />
          <Route path="/staff/invoices/:id" element={<InvoiceDetail />} />

          <Route path="/staff/certificates" element={<StaffCertificates />} />
          <Route path="/staff/accounts" element={<ManageAccounts />} />
          <Route path="/staff/accounts/:id" element={<StaffAccountDetail />} />
          <Route path="/staff/salary" element={<SalaryHistory />} />

          <Route path="/staff/support" element={<StaffSupportTickets />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/new" element={<CreateCourse />} />
          <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route
            path="/admin/discount-codes"
            element={<AdminDiscountCodes />}
          />
          <Route path="/admin/classrooms" element={<AdminClassrooms />} />
          <Route path="/admin/accounts" element={<AdminAccounts />} />
          <Route path="/admin/accounts/:id" element={<AdminAccountDetail />} />
          <Route path="/admin/refunds" element={<AdminRefunds />} />
          <Route path="/admin/refunds/:id" element={<AdminRefundDetail />} />
          <Route path="/admin/payroll" element={<AdminPayroll />} />
          <Route path="/admin/payroll/:id" element={<AdminPayrollDetail />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        </Route>
      </Route>

      {/* Tutor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["TUTOR"]} />}>
        <Route element={<TutorLayout />}>
          <Route path="/tutor/dashboard" element={<TutorDashboard />} />
          <Route path="/tutor/profile" element={<TutorProfile />} />
          <Route path="/tutor/notifications" element={<NotificationsPage />} />
          <Route path="/tutor/certificates" element={<TutorCertificates />} />
          <Route
            path="/tutor/availability"
            element={<AvailabilityRegistration />}
          />
          <Route path="/tutor/schedule" element={<TeachingSchedule />} />
          <Route path="/tutor/classes" element={<TutorClasses />} />
          <Route path="/tutor/classes/:id" element={<TutorClassDetail />}>
            <Route path="attendance" element={<TutorAttendance />} />
            <Route path="grades" element={<TutorGradebook />} />
          </Route>
          <Route
            path="/tutor/change-requests"
            element={<TutorChangeRequests />}
          />
          <Route
            path="/tutor/support-tickets"
            element={<SupportTickets />}
          />
          <Route path="/tutor/salary" element={<TutorSalaryHistory />} />
        </Route>
      </Route>
    </Routes>
  );
};
