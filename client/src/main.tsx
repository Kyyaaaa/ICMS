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

// Learner Views
import LearnerLayout from './components/layout/learner-layout.tsx'
import LearnerDashboard from './views/learner/dashboard.tsx'
import LearnerProfile from './views/learner/profile.tsx'
import LearnerChangePassword from './views/learner/change-password.tsx'
import LearnerAnnouncements from './views/learner/announcements.tsx'
import LearnerClasses from './views/learner/classes.tsx'
import ClassDetail from './views/learner/class-detail.tsx'
import ClassFeedback from './views/learner/class-feedback.tsx'
import AttendanceProgress from './views/learner/attendance.tsx'
import LearnerSchedules from './views/learner/schedules.tsx'
import ClassRegistration from './views/learner/registration.tsx'
import PaymentHistory from './views/learner/payments.tsx'
import PaymentCheckout from './views/learner/checkout.tsx'
import RefundRequest from './views/learner/refund.tsx'
import SupportTickets from './views/learner/support.tsx'
import CreateSupportTicket from './views/learner/create-ticket.tsx'
import TicketDetail from './views/learner/ticket-detail.tsx'
import Courses from './views/courses.tsx'
import CourseDetail from './views/course-detail.tsx'
import Checkout from './views/checkout.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Learner Routes wrapped in Layout */}
        <Route element={<LearnerLayout />}>
            <Route path="/learner/dashboard" element={<LearnerDashboard />} />
            <Route path="/learner/profile" element={<LearnerProfile />} />
            <Route path="/learner/change-password" element={<LearnerChangePassword />} />
            <Route path="/learner/announcements" element={<LearnerAnnouncements />} />
            
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
            <Route path="/learner/support/new" element={<CreateSupportTicket />} />
            <Route path="/learner/support/:id" element={<TicketDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)