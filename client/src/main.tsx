import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Register from './views/register.tsx'
import Login from './views/login.tsx'
import ForgotPassword from './views/forgot-password/forgot-password.tsx'
import VerifyOTP from './views/forgot-password/verify-otp.tsx'
import ResetPassword from './views/forgot-password/reset-password.tsx'
import Homepage from './views/homepage.tsx'
import AuthCallback from './views/auth-callback.tsx'

// Learner Views
import LearnerLayout from './components/layout/learner-layout.tsx'
import LearnerDashboard from './views/learner/dashboard.tsx'
import LearnerProfile from './views/learner/profile.tsx'
import LearnerClasses from './views/learner/classes.tsx'
import ClassDetail from './views/learner/class-detail.tsx'
import ClassFeedback from './views/learner/class-feedback.tsx'
import AttendanceProgress from './views/learner/attendance.tsx'
import LearnerSchedules from './views/learner/schedules.tsx'
import ClassRegistration from './views/learner/registration.tsx'
import PaymentHistory from './views/learner/payments.tsx'
import PaymentCheckout from './views/learner/checkout.tsx'
import RefundRequest from './views/learner/refund.tsx'
import { SupportTickets } from './views/shared/support-tickets.tsx'

// Staff Views
import StaffLayout from './components/layout/staff-layout.tsx'
import StaffDashboard from './views/staff/dashboard.tsx'
import ConsultationList from './views/staff/consultations.tsx'
import ProfileList from './views/staff/profiles.tsx'
import ProfileDetail from './views/staff/profile-detail.tsx'
import ManageClasses from './views/staff/classes.tsx'
import CreateClass from './views/staff/create-class.tsx'
import StaffClassDetail from './views/staff/class-detail.tsx'
import MasterSchedule from './views/staff/master-schedule.tsx'
import ChangeRequests from './views/staff/change-requests.tsx'
import InvoiceList from './views/staff/invoices.tsx'
import InvoiceDetail from './views/staff/invoice-detail.tsx'
import StaffProfile from './views/staff/my-profile.tsx'
import StaffTutorAvailability from './views/staff/tutor-availability.tsx'
import ManageAccounts from './views/staff/accounts.tsx'
import SalaryHistory from './views/staff/salary.tsx'
import { StaffSupportTickets } from './views/staff/support-tickets.tsx'

import Courses from './views/courses.tsx'
import CourseDetail from './views/course-detail.tsx'

// Admin Views
import { AdminLayout } from './components/layout/admin-layout.tsx'
import AdminDashboard from './views/admin/dashboard.tsx'
import AdminCourses from './views/admin/courses.tsx'
import AdminCourseDetail from './views/admin/course-detail.tsx'
import AdminDiscountCodes from './views/admin/discount-codes.tsx'
import AdminClassrooms from './views/admin/classrooms.tsx'
import AdminAccounts from './views/admin/accounts.tsx'
import AdminAccountDetail from './views/admin/account-detail.tsx'
import AdminRefunds from './views/admin/refunds.tsx'
import AdminRefundDetail from './views/admin/refund-detail.tsx'
import AdminPayroll from './views/admin/payroll.tsx'
import AdminPayrollDetail from './views/admin/payroll-detail.tsx'
import AdminAnnouncements from './views/admin/announcements.tsx'
import AdminAuditLogs from './views/admin/audit-logs.tsx'
import AdminProfile from './views/admin/profile.tsx'
import AdminFinance from './views/admin/finance.tsx'

// Tutor Views
import TutorLayout from './components/layout/tutor-layout.tsx'
import TutorDashboard from './views/tutor/dashboard.tsx'
import TutorProfile from './views/tutor/profile.tsx'
import TutorQualifications from './views/tutor/qualifications.tsx'
import AvailabilityRegistration from './views/tutor/availability.tsx'
import TeachingSchedule from './views/tutor/schedule.tsx'
import ClassAttendance from './views/tutor/attendance.tsx'
import TutorChangeRequests from './views/tutor/change-requests.tsx'
import TutorSalaryHistory from './views/tutor/salary.tsx'
import { TutorSupportTickets } from './views/tutor/support-tickets.tsx'

// Shared Views
import { NotificationsPage } from './views/shared/notifications.tsx'
import PublicNotifications from './views/public-notifications.tsx'

import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx'
import { GuestRoute } from './components/auth/GuestRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
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
        <Route path="/notifications" element={<PublicNotifications />} />


        {/* Learner Routes wrapped in Layout */}
        <Route element={<ProtectedRoute allowedRoles={['LEARNER']} />}>
            <Route element={<LearnerLayout />}>
                <Route path="/learner/dashboard" element={<LearnerDashboard />} />
                <Route path="/learner/profile" element={<LearnerProfile />} />
                <Route path="/learner/notifications" element={<NotificationsPage />} />
                
                <Route path="/learner/classes" element={<LearnerClasses />} />
                <Route path="/learner/classes/:id" element={<ClassDetail />} />
                <Route path="/learner/classes/:id/feedback" element={<ClassFeedback />} />
                <Route path="/learner/classes/:id/attendance" element={<AttendanceProgress />} />
                
                <Route path="/learner/schedules" element={<LearnerSchedules />} />
                
                <Route path="/courses/:courseId/register" element={<ClassRegistration />} />
                
                <Route path="/learner/payments" element={<PaymentHistory />} />
                <Route path="/learner/payments/:id/checkout" element={<PaymentCheckout />} />
                <Route path="/learner/payments/:id/refund" element={<RefundRequest />} />
                
                <Route path="/learner/support" element={<SupportTickets />} />
            </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
            <Route element={<StaffLayout />}>
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/staff/profile" element={<StaffProfile />} />
                <Route path="/staff/notifications" element={<NotificationsPage />} />
                
                <Route path="/staff/consultations" element={<ConsultationList />} />
                
                <Route path="/staff/profiles" element={<ProfileList />} />
                <Route path="/staff/profiles/:id" element={<ProfileDetail />} />
                
                <Route path="/staff/classes" element={<ManageClasses />} />
                <Route path="/staff/classes/create" element={<CreateClass />} />
                <Route path="/staff/classes/edit/:id" element={<CreateClass />} />
                <Route path="/staff/classes/:id" element={<StaffClassDetail />} />
                <Route path="/staff/master-schedule" element={<MasterSchedule />} />
                <Route path="/staff/tutor-availability" element={<StaffTutorAvailability />} />
                
                <Route path="/staff/change-requests" element={<ChangeRequests />} />
                
                <Route path="/staff/invoices" element={<InvoiceList />} />
                <Route path="/staff/invoices/:id" element={<InvoiceDetail />} />
                
                <Route path="/staff/accounts" element={<ManageAccounts />} />
                <Route path="/staff/salary" element={<SalaryHistory />} />
                
                <Route path="/staff/support" element={<StaffSupportTickets />} />
            </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
                <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/discount-codes" element={<AdminDiscountCodes />} />
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
        <Route element={<ProtectedRoute allowedRoles={['TUTOR']} />}>
            <Route element={<TutorLayout />}>
                <Route path="/tutor/dashboard" element={<TutorDashboard />} />
                <Route path="/tutor/profile" element={<TutorProfile />} />
                <Route path="/tutor/notifications" element={<NotificationsPage />} />
                <Route path="/tutor/qualifications" element={<TutorQualifications />} />
                <Route path="/tutor/availability" element={<AvailabilityRegistration />} />
                <Route path="/tutor/schedule" element={<TeachingSchedule />} />
                <Route path="/tutor/attendance" element={<ClassAttendance />} />
                <Route path="/tutor/change-requests" element={<TutorChangeRequests />} />
                <Route path="/tutor/support-tickets" element={<TutorSupportTickets />} />
                <Route path="/tutor/salary" element={<TutorSalaryHistory />} />
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
