## 1. Overall Requirements

### 1.1 Context Diagram
The IELTS Center Management System (ICMS) is built to completely replace traditional manual management methods. This solution helps avoid mistakes in daily operations and makes management tasks easier through a simple interface. As a result, users can quickly track important data such as class schedules, tuition fees, enrollment history, and attendance.

The context diagram below shows the external actors and main data flows interacting with the system in the first version (Release 1.0). In the future, the system will expand to more partner centers. Later versions will also include AI features to personalize learning paths based on each student's level, making high-quality education easier to access for everyone.

 ### 1.3 User Requirements

#### 1.3.1 Actors

|     |                        |                                                                                                                                                                                                                                                                                             |     |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| #   | Actor                  | Description                                                                                                                                                                                                                                                                                 |     |
| 1   | Guest                  | Represents the role played by unauthenticated users outside the system. They interact with the system by requesting public information (courses, tutors) and providing basic contact details to request consultation services or initiate a Learner account registration.                   |     |
| 2   | Learner                | Represents the role played by registered students. They provide the system with enrollment requests, complete automated payments via gateway, and submit tutor feedback. They check the system to track their class schedules and payment verification statuses.                            |     |
| 3   | Tutor                  | Represents the role played by the teaching personnel. They provide the system with professional qualifications, available time slots, and learner attendance data. They help the system complete training management tasks and request schedule modifications.                              |     |
| 4   | Staff                  | Represents the role played by operational personnel. They provide information and management inputs to help the system complete daily tasks, such as creating Tutor/Learner accounts, verifying Tutor profiles/qualifications, creating classes, and resolving support tickets.             |     |
| 5   | Admin                  | Represents the role played by system administrators. They provide the system with foundational configuration data (classrooms, courses, discount codes) and interact with the system to manage user accounts, trigger payroll calculations, and retrieve statistical reports.               |     |
| 6   | Authentication Service | An external system actor. It provides identity verification services to the system, helping it respond to and complete the secure login task for users opting for Single Sign-On (SSO).                                                                                                     |     |
| 7   | Email Service          | An external system actor. It provides automated email dispatch services, helping the main system respond to and complete specific tasks related to sending verification OTP codes and password reset links.                                                                                 |     |
| 8   | Payment Gateway        | An external third-party payment service integrated with the system to process online transactions securely. The Payment Gateway handles payment authorization, transaction processing, and payment status notifications when Learners make payments for tuition fees and class enrollments. |     |


#### 1.3.2 Use Cases (UC)

|       |                                 |                                     |                          |                                                                                                                                                                                                    |
| ----- | ------------------------------- | ----------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID    | Use Case                        | Actor                               | Feature                  | Use Case Description                                                                                                                                                                               |
| UC-01 | View Home Page                  | Guest, Learner, Tutor, Staff, Admin | Public Access            | Allows all users to access the landing page to view general center information, promotional banners, and contact details.                                                                          |
| UC-02 | View System Announcements       | Guest, Learner, Tutor, Staff, Admin | Public Access            | Allows all users to view global news, operational updates, and general announcements broadcasted by the center administration.                                                                     |
| UC-03 | Manage Announcements            | Admin                               | Public Access            | Allows the Administrator to publish, edit, or pin critical global news and notifications to the home page for all users to read.                                                                   |
| UC-04 | Register Account                | Guest                               | Authentication           | Allows an unregistered guest to provide personal information (name, email, phone number) to create a new Learner account in the system.                                                            |
| UC-05 | Log In                          | Learner, Tutor, Staff, Admin        | Authentication           | Allows users to authenticate their credentials using a registered system account (username and password) or via Google Single Sign-On (SSO) to access authorized features.                         |
| UC-06 | Log Out                         | Learner, Tutor, Staff, Admin        | Authentication           | Allows authenticated users to safely terminate their current active session and clear authentication tokens to secure the account.                                                                 |
| UC-07 | Reset Password                  | Learner, Tutor, Staff, Admin        | Authentication           | Allows users to request a password reset link or OTP via their registered email address in case they forget their login credentials.                                                               |
| UC-08 | View Personal Profile           | Learner, Tutor, Staff, Admin        | Profile Management       | Allows logged-in users to view their own detailed personal information, contact details, and account settings.                                                                                     |
| UC-09 | Update Personal Profile         | Learner, Tutor, Staff, Admin        | Profile Management       | Allows logged-in users to modify their personal contact information, address, and upload a new avatar image.                                                                                       |
| UC-10 | Change Password                 | Learner, Tutor, Staff, Admin        | Profile Management       | Allows logged-in users to change their current login password by providing the old password and confirming a new one.                                                                              |
| UC-11 | View Accounts                   | Staff, Admin                        | Account Management       | Allows Staff to view and search the list of Learner and Tutor accounts, and Admin to view all accounts across the entire system.                                                                   |
| UC-12 | Create Account                  | Staff, Admin                        | Account Management       | Allows Staff to manually create new Learner or Tutor accounts, and Admin to create accounts for any role including Staff.                                                                          |
| UC-13 | Update Account Details          | Staff, Admin                        | Account Management       | Allows Staff to modify Learner or Tutor account information, and Admin to modify any user’s account details across the system.                                                                     |
| UC-14 | Change Account Status           | Staff, Admin                        | Account Management       | Allows Staff to activate or suspend Learner and Tutor accounts, and Admin to manage the status of any account in the system.                                                                       |
| UC-15 | View Courses                    | Guest, Learner, Tutor, Staff, Admin | Course Management        | Allows users to browse, search, and filter the catalog of available offline IELTS training courses offered by the center.                                                                          |
| UC-16 | View Course Details             | Guest, Learner, Tutor, Staff, Admin | Course Management        | Allows users to view specific information about a selected course, including the curriculum description, target band score, total sessions, and tuition fee.                                       |
| UC-17 | Create Course                   | Admin                               | Course Management        | Allows the Administrator to define and publish a new IELTS course program, configuring its standard price, total duration, and description.                                                        |
| UC-18 | Update Course Details           | Admin                               | Course Management        | Allows the Administrator to modify an existing course’s syllabus, adjust the tuition fee, or change the total number of required sessions.                                                         |
| UC-19 | Change Course Visibility        | Admin                               | Course Management        | Allows the Administrator to toggle the display status of a course (Show/Hide) on the public-facing guest portal.                                                                                   |
| UC-20 | View Classrooms                 | Admin                               | Facility Management      | Allows the Administrator to view the list of physical classrooms at the center, including details like room name and maximum student capacity.                                                     |
| UC-21 | Add Classroom                   | Admin                               | Facility Management      | Allows the Administrator to register a new physical classroom into the system, specifying the room identifier and seating capacity.                                                                |
| UC-22 | Update Classroom Status         | Admin                               | Facility Management      | Allows the Administrator to edit classroom details or change its operational status (e.g., Available, Under Maintenance).                                                                          |
| UC-23 | Update Qualifications           | Tutor                               | Tutor Profile Management | Allows a Tutor to upload digital copies of their academic degrees, IELTS certificates, and update their teaching experience for Staff verification.                                                |
| UC-24 | View Tutor Certificates         | Staff                               | Tutor Profile Management | Allows Staff members to browse the list of Tutor Certificates and review their current verification status.                                                                                        |
| UC-25 | Approve Qualification           | Staff                               | Tutor Profile Management | Allows Staff members to verify the authenticity of a Tutor’s uploaded certificates and officially approve or reject their qualification.                                                           |
| UC-26 | View Classes                    | Staff                               | Class Management         | Allows Staff to view the list of all currently active, upcoming, or completed offline classes for management purposes.                                                                             |
| UC-27 | Create Class                    | Staff                               | Class Management         | Allows Staff to initialize a new offline class linked to a specific course, assigning a physical classroom, a default Tutor, and setting a maximum capacity constraint.                            |
| UC-28 | Update Class Details            | Staff                               | Class Management         | Allows Staff to reassign a different Tutor, change the physical classroom, or modify the status of an existing class.                                                                              |
| UC-29 | View Class Details              | Learner, Tutor, Staff               | Class Management         | Allows users to view specific offline class information including the Learner roster, assigned physical room, and Tutor details.                                                                   |
| UC-30 | View Tutor Availability         | Staff                               | Class Management         | Allows Staff members to check the aggregated availability matrix of all Tutors to assist in scheduling new classes.                                                                                |
| UC-31 | Register Available Time Slots   | Tutor                               | Schedule Management      | Allows a Tutor to select and submit their weekly or monthly available time slots to inform the center of their teaching availability.                                                              |
| UC-32 | View Overall Teaching Schedule  | Staff                               | Schedule Management      | Allows Staff members to view a master calendar displaying the teaching schedules of all Tutors across all physical classrooms.                                                                     |
| UC-33 | View Personal Teaching Schedule | Tutor                               | Schedule Management      | Allows a Tutor to view their personalized timetable containing assigned classes, specific dates, times, and designated room numbers.                                                               |
| UC-34 | Request Schedule Change         | Tutor                               | Schedule Management      | Allows a Tutor to submit a formal request to cancel a specific assigned teaching session or request a substitute teacher due to emergencies.                                                       |
| UC-35 | Process Schedule Change Request | Staff                               | Schedule Management      | Allows Staff members to review, verify classroom availability, and approve or deny Tutor schedule change requests to maintain continuity.                                                          |
| UC-36 | View Personal Class Schedule    | Learner                             | Schedule Management      | Allows a Learner to view their personalized timetable containing their enrolled classes, session dates, times, and assigned physical room numbers.                                                 |
| UC-37 | Register for Class              | Learner                             | Enrollment Management    | Allows a Learner to select an available offline class that has empty slots and enroll in it, generating a pending tuition invoice.                                                                 |
| UC-38 | View Enrolled Classes           | Learner                             | Enrollment Management    | Allows a Learner to view a comprehensive list of all their currently active and completed offline classes.                                                                                         |
| UC-39 | Take Class Attendance           | Tutor                               | Training Management      | Allows a Tutor to mark the attendance status (Present, Absent with permission, Absent without permission) for each enrolled Learner during an offline session.                                     |
| UC-40 | View Attendance Progress        | Learner                             | Training Management      | Allows a Learner to track personal attendance statistics across all enrolled classes to monitor academic progress and eligibility.                                                                 |
| UC-41 | View Attendance Reports         | Staff                               | Training Management      | Allows Staff members to view and monitor attendance records across all classes to track training quality and learner engagement.                                                                   |
| UC-42 | Manage Academic Grades          | Tutor                               | Training Management      | Allows a Tutor to input, edit, and submit final course grades for each Learner in their assigned offline class.                                                                                    |
| UC-43 | View Academic Transcript        | Learner                             | Training Management      | Allows a Learner to view their academic grades and final performance transcript upon course completion.                                                                                            |
| UC-44 | Submit Consultation Request     | Guest                               | CRM                      | Allows a guest to fill out an online form with their contact details and specific inquiries to request a callback or course consultation.                                                          |
| UC-45 | View Consultation Requests      | Staff                               | CRM                      | Allows Staff members to view the list of submitted consultation forms from potential customers, sorted by submission date and status.                                                              |
| UC-46 | Update Consultation Status      | Staff                               | CRM                      | Allows Staff members to log call notes and change the status of a consultation request (e.g., Pending, Contacted, Converted, Canceled).                                                            |
| UC-47 | View Discount Codes             | Admin                               | Promotion Management     | Allows the Administrator to view the list of all active, expired, or deactivated promotional vouchers and discount codes.                                                                          |
| UC-48 | Create Discount Code            | Admin                               | Promotion Management     | Allows the Administrator to generate a new promotional code, setting the discount value (percentage or fixed amount), expiration date, and usage limits.                                           |
| UC-49 | Deactivate Discount Code        | Admin                               | Promotion Management     | Allows the Administrator to manually disable or delete an active discount code before its scheduled expiration date.                                                                               |
| UC-50 | Pay Tuition                     | Learner                             | Financial Management     | Allows a Learner to be redirected to an external Payment Gateway to complete their tuition payment. The ICMS automatically updates the invoice status to “Paid” upon successful callback.          |
| UC-51 | View Payment History            | Learner                             | Financial Management     | Allows a Learner to view a historical log of all their tuition invoices, payment dates, applied discounts, and current payment statuses.                                                           |
| UC-52 | Submit Refund Request           | Learner                             | Financial Management     | Allows a Learner to submit a formal request to refund their tuition fee if they haven’t attended classes or if they cancel within 24 hours of successful registration.                             |
| UC-53 | Process Refund Request          | Admin                               | Financial Management     | Allows the Administrator to validate the refund conditions (e.g., checking the 24-hour rule or attendance records), calculate the refundable amount, and approve or reject the request.            |
| UC-54 | View Invoices                   | Staff                               | Financial Management     | Allows Staff members to track all tuition invoices, monitor revenue pipelines, and send automated payment reminders to Learners.                                                                   |
| UC-55 | Calculate Payroll               | Admin                               | Payroll Management       | Allows the Administrator to trigger the monthly payroll calculation, which aggregates validated attendance records and applies predefined hourly rates to compute salary for all Tutors and Staff. |
| UC-56 | View Overall Payroll            | Admin                               | Payroll Management       | Allows the Administrator to view the aggregated monthly payroll report detailing total salary expenses for all Staff and Tutors.                                                                   |
| UC-57 | Confirm Salary Payment          | Admin                               | Payroll Management       | Allows the Administrator to update the status of individual or bulk payroll records to “Paid” after executing actual bank transfers to employees.                                                  |
| UC-58 | View Salary History             | Tutor, Staff                        | Payroll Management       | Allows Tutors to view their detailed monthly income statements, and Staff to view these records for operational support and verification.                                                          |
| UC-59 | Submit Tutor Review             | Learner                             | Feedback Management      | Allows a Learner to submit a star rating and written feedback evaluating the teaching quality of a Tutor upon completing a course.                                                                 |
| UC-60 | View Tutor Reviews              | Admin                               | Feedback Management      | Allows the Administrator to aggregate and view all feedback submitted by Learners to monitor and evaluate the overall performance of Tutors.                                                       |
| UC-61 | Submit Support Ticket           | Learner, Tutor                      | Customer Support         | Allows Learners and Tutors to create and submit a support ticket to report facility issues, technical bugs, or file a complaint.                                                                   |
| UC-62 | Resolve Support Ticket          | Staff                               | Customer Support         | Allows Staff members to read incoming support tickets, log communication or actions taken, and mark the issue as resolved or closed.                                                               |
| UC-63 | View Revenue Statistics         | Admin                               | Reporting & Analytics    | Allows the Administrator to view graphical dashboards and detailed reports summarizing incoming tuition revenue and financial growth trends.                                                       |
| UC-64 | View Enrollment Statistics      | Admin                               | Reporting & Analytics    | Allows the Administrator to view graphical dashboards tracking new Learner registrations, class fill rates, and overall student retention.                                                         |
| UC-65 | View System Audit Logs          | Admin                               | System Administration    | Allows the Administrator to monitor a secure log of critical data manipulations (e.g., changes to financial records, grade edits) to ensure system integrity.                                      |

# Mô tả các mối quan hệ
## Ngắn
- Account - Learner: 1 - 1 (Nét liền)
- Account - Tutor: 1 - 1 (Nét liền)
- Account - Staff: 1 - 1 (Nét liền)
- Account - Admin: 1 - 1 (Nét liền)
- Tutor - Tutor Profile: 1 - 1 (Nét liền)
- Course - Class: 1 - N (Nét đứt)
- Classroom - Class: 1 - N (Nét đứt)
- Tutor - Class: 1 - N (Nét đứt)
- Class - Session: 1 - N (Nét đứt)
- Session - Attendance: 1 - N (Nét liền)
- Learner - Attendance: 1 - N (Nét liền)
- Tutor - Available Time Slot: 1 - N (Nét đứt)
- Tutor - Schedule Change Request: 1 - N (Nét đứt)
- Staff - Schedule Change Request: 1 - N (Nét đứt)
- Class - Enrollment: 1 - N (Nét liền)
- Learner - Enrollment: 1 - N (Nét liền)
- Enrollment - Invoice: 1 - 1 (Nét liền)
- Invoice - Transaction: 1 - N (Nét đứt)
- Discount Code - Invoice: 1 - N (Nét đứt)
- Invoice - Refund Request: 1 - N (Nét đứt)
- Admin - Refund Request: 1 - N (Nét đứt)
- Tutor - Payroll: 1 - N (Nét đứt)
- Staff - Payroll: 1 - N (Nét đứt)
- Admin - Payroll: 1 - N (Nét đứt)
- Learner - Tutor Review: 1 - N (Nét liền)
- Class - Tutor Review: 1 - N (Nét liền)
- Account - Support Ticket: 1 - N (Nét đứt)
- Staff - Support Ticket: 1 - N (Nét đứt)
- Staff - Consulation Request: 1 - N (Nét đứt)
- Admin - Announcement: 1 - N (Nét đứt)
- Admin - Audit log: 1 - N (Nét đứt)

## Chi tiết
- **Account - Learner: 1 - 1 (Nét liền)**
    - Mô tả: Mỗi tài khoản có thể liên kết với duy nhất một hồ sơ học viên. Thực thể học viên phụ thuộc hoàn toàn vào tài khoản để tồn tại (khóa chính của Account là một phần hoặc toàn bộ khóa của Learner).
- **Account - Tutor: 1 - 1 (Nét liền)**
    - Mô tả: Mỗi tài khoản có thể đóng vai trò là một gia sư. Dữ liệu gia sư không thể tồn tại độc lập trong hệ thống nếu không gắn với một tài khoản gốc.
- **Account - Staff: 1 - 1 (Nét liền)**
    - Mô tả: Mỗi tài khoản có thể là một nhân viên hệ thống. Nhân viên phụ thuộc hoàn toàn vào thực thể tài khoản để xác thực và tồn tại.
- **Account - Admin: 1 - 1 (Nét liền)**
    - Mô tả: Mỗi tài khoản có thể là một quản trị viên. Tương tự các role khác, đây là quan hệ xác định sự tồn tại phụ thuộc của Admin vào Account.
- **Tutor - Tutor Profile: 1 - 1 (Nét liền)**
    - Mô tả: Mỗi gia sư có duy nhất một hồ sơ chi tiết (bằng cấp, kinh nghiệm, v.v.). Hồ sơ này phụ thuộc bắt buộc vào thực thể gia sư đó.
- **Course - Class: 1 - N (Nét đứt)**
    - Mô tả: Một khóa học có thể mở ra nhiều lớp học khác nhau, nhưng mỗi lớp chỉ thuộc về một khóa học. Lớp học có thể tồn tại với khóa chính riêng biệt.
- **Classroom - Class: 1 - N (Nét đứt)**
    - Mô tả: Một phòng học (phòng vật lý hoặc link phòng ảo) có thể được tái sử dụng cho nhiều lớp học ở các khung giờ khác nhau.
- **Tutor - Class: 1 - N (Nét đứt)**
    - Mô tả: Một gia sư có thể được phân công giảng dạy nhiều lớp học khác nhau trong hệ thống.
- **Class - Session: 1 - N (Nét đứt)**
    - Mô tả: Mỗi lớp học bao gồm nhiều buổi học (Session) cụ thể. Các buổi học này mang khóa chính riêng và tồn tại độc lập tương đối với lớp.
- **Session - Attendance: 1 - N (Nét liền)**
    - Mô tả: Trong mỗi buổi học sẽ có nhiều bản ghi điểm danh (tương ứng với các học viên tham gia). Bản ghi điểm danh sẽ vô nghĩa và không thể tồn tại nếu buổi học bị xóa.
- **Learner - Attendance: 1 - N (Nét liền)**
    - Mô tả: Một học viên sẽ có nhiều bản ghi điểm danh trong suốt thời gian học. Bản ghi điểm danh phụ thuộc trực tiếp vào học viên đó.
- **Tutor - Available Time Slot: 1 - N (Nét đứt)**
    - Mô tả: Một gia sư có thể đăng ký nhiều khung giờ rảnh để nhận lớp. Khung giờ được lưu trữ độc lập để thuận tiện cho việc đối chiếu, xếp lịch.
- **Tutor - Schedule Change Request: 1 - N (Nét đứt)**
    - Mô tả: Một gia sư có quyền gửi nhiều yêu cầu xin thay đổi lịch dạy khi phát sinh sự cố hoặc việc bận đột xuất.
- **Staff - Schedule Change Request: 1 - N (Nét đứt)**
    - Mô tả: Một nhân viên (điều phối viên học thuật) có thể tiếp nhận, xử lý và phê duyệt nhiều yêu cầu thay đổi lịch từ các gia sư.
- **Class - Enrollment: 1 - N (Nét liền)**
    - Mô tả: Mỗi lớp học có thể có nhiều hồ sơ ghi danh của các học viên. Thực thể ghi danh bắt buộc phải gắn liền với một lớp học cụ thể.
- **Learner - Enrollment: 1 - N (Nét liền)**
    - Mô tả: Một học viên có thể đăng ký (ghi danh) vào nhiều lớp học. Bản ghi danh phụ thuộc hoàn toàn vào sự tồn tại của người học viên thực hiện việc đăng ký đó.
- **Enrollment - Invoice: 1 - 1 (Nét liền)**
    - Mô tả: Mỗi một hồ sơ ghi danh thành công sẽ phát sinh duy nhất một hóa đơn học phí tương ứng. Hóa đơn bắt buộc phải dựa trên cơ sở của việc ghi danh.
- **Invoice - Transaction: 1 - N (Nét đứt)**
    - Mô tả: Một hóa đơn có thể được chia nhỏ và thanh toán qua nhiều giao dịch thực tế (ví dụ: thanh toán trả góp, thanh toán nhiều đợt).
- **Discount Code - Invoice: 1 - N (Nét đứt)**
    - Mô tả: Một mã giảm giá có thể được áp dụng chung cho nhiều hóa đơn khác nhau của các học viên đủ điều kiện.
- **Invoice - Refund Request: 1 - N (Nét đứt)**
    - Mô tả: Một hóa đơn có thể phát sinh nhiều yêu cầu hoàn tiền (ví dụ yêu cầu hoàn tiền theo từng phần hoặc cho từng đợt hủy lớp).
- **Admin - Refund Request: 1 - N (Nét đứt)**
    - Mô tả: Một quản trị viên có thẩm quyền xem xét và phê duyệt nhiều yêu cầu hoàn tiền từ phía học viên.
- **Tutor - Payroll: 1 - N (Nét đứt)**
    - Mô tả: Một gia sư sẽ nhận được nhiều bảng lương qua các kỳ thanh toán khác nhau (theo tháng, tuần).
- **Staff - Payroll: 1 - N (Nét đứt)**
    - Mô tả: Một nhân viên sẽ nhận được nhiều bảng lương qua các kỳ thanh toán khác nhau (theo tháng, tuần).
- **Admin - Payroll: 1 - N (Nét đứt)**
    - Mô tả: Một quản trị viên chịu trách nhiệm tổng hợp và quản lý nhiều bảng lương cho các gia sư và nhân viên trong hệ thống.
- **Learner - Tutor Review: 1 - N (Nét liền)**
    - Mô tả: Một học viên có thể viết nhiều nhận xét, đánh giá cho các gia sư. Đánh giá này phụ thuộc hoàn toàn vào việc tồn tại của học viên trong hệ thống.
- **Class - Tutor Review: 1 - N (Nét liền)**
    - Mô tả: Các đánh giá dành cho gia sư phải dựa trên ngữ cảnh của một lớp học cụ thể. Nếu lớp học bị xóa bỏ, đánh giá này cũng mất đi cơ sở tồn tại.
- **Account - Support Ticket: 1 - N (Nét đứt)**
    - Mô tả: Mọi tài khoản trên hệ thống đều có thể tạo và gửi đi nhiều yêu cầu hỗ trợ kỹ thuật hoặc dịch vụ (Support Ticket).
- **Staff - Support Ticket: 1 - N (Nét đứt)**
    - Mô tả: Một nhân viên chăm sóc khách hàng có thể được phân công tiếp nhận và giải quyết nhiều yêu cầu hỗ trợ khác nhau.
- **Staff - Consulation Request: 1 - N (Nét đứt)**
    - Mô tả: Một nhân viên phòng Sales/Tư vấn có thể gọi điện, chăm sóc và xử lý nhiều yêu cầu tư vấn khóa học từ khách hàng mới.
- **Admin - Announcement: 1 - N (Nét đứt)**
    - Mô tả: Một quản trị viên có thể biên soạn và đăng tải nhiều thông báo, tin tức chung đến toàn bộ người dùng.
- **Admin - Audit log: 1 - N (Nét đứt)**
    - Mô tả: Mỗi hành động cấu hình hoặc thao tác nhạy cảm của quản trị viên sẽ tạo ra các bản ghi nhật ký hệ thống (Audit log) để phục vụ cho việc theo dõi, truy vết bảo mật.

# Mô tả các thực thể

||||
|---|---|---|
|#|Entity|Description|
|1|Account|Thông tin tài khoản gốc dùng để xác thực và định danh các vai trò trên hệ thống.|
|2|Learner|Hồ sơ chi tiết của học viên, phụ thuộc hoàn toàn vào một tài khoản gốc để tồn tại.|
|3|Tutor|Thông tin cơ bản và vai trò của gia sư, gắn liền với một tài khoản gốc trên hệ thống.|
|4|Staff|Thông tin của nhân viên hệ thống đảm nhiệm các chức năng như hỗ trợ, tư vấn, học thuật hoặc kế toán.|
|5|Admin|Thông tin của quản trị viên hệ thống có quyền hạn tổng hợp, quản lý và phê duyệt.|
|6|Tutor Profile|Hồ sơ chi tiết của gia sư bao gồm các thông tin như bằng cấp, kinh nghiệm giảng dạy.|
|7|Course|Thông tin về khóa học tổng quát, được sử dụng để mở ra nhiều lớp học khác nhau.|
|8|Class|Thông tin về một lớp học cụ thể thuộc một khóa học, bao gồm nhiều buổi học và hồ sơ ghi danh.|
|9|Classroom|Thông tin về phòng học vật lý hoặc đường dẫn phòng học trực tuyến được sử dụng cho các lớp học.|
|10|Session|Thông tin chi tiết về một buổi học cụ thể nằm trong một lớp học.|
|11|Attendance|Bản ghi dữ liệu điểm danh của học viên trong một buổi học cụ thể.|
|12|Available Time Slot|Thông tin các khung giờ rảnh mà gia sư đã đăng ký để hệ thống đối chiếu và sắp xếp lịch dạy.|
|13|Schedule Change Request|Yêu cầu xin thay đổi lịch dạy từ phía gia sư khi có sự cố hoặc việc bận đột xuất.|
|14|Enrollment|Hồ sơ đăng ký của một học viên vào một lớp học cụ thể.|
|15|Invoice|Hóa đơn học phí phát sinh tương ứng từ một hồ sơ ghi danh thành công của học viên.|
|16|Transaction|Giao dịch thanh toán thực tế (có thể là trả góp hoặc thanh toán nhiều đợt) cho một hóa đơn.|
|17|Discount Code|Mã giảm giá được áp dụng trên hóa đơn của các học viên đủ điều kiện.|
|18|Refund Request|Yêu cầu hoàn tiền từ phía học viên đối với một hóa đơn.|
|19|Payroll|Bảng lương lưu trữ thông tin thanh toán định kỳ cho gia sư hoặc nhân viên.|
|20|Tutor Review|Bản nhận xét, đánh giá của học viên dành cho gia sư dựa trên ngữ cảnh của một lớp học cụ thể.|
|21|Support Ticket|Yêu cầu hỗ trợ kỹ thuật hoặc dịch vụ từ bất kỳ tài khoản người dùng nào gửi đến hệ thống.|
|22|Consulation Request|Yêu cầu tư vấn khóa học từ khách hàng mới hoặc tiềm năng gửi đến bộ phận Sales/Tư vấn.|
|23|Announcement|Thông báo, tin tức chung do quản trị viên biên soạn và đăng tải gửi đến người dùng.|
|24|Audit log|Bản ghi nhật ký hệ thống lưu lại mọi hành động cấu hình hoặc thao tác nhạy cảm của quản trị viên để truy vết.|

# System Functionalities
## Screen Authorization

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|Screen|Guest|Learner|Tutor|Staff|Admin|
|Home Page|X|X|X|X|X|
|Course List|X|X|X|X|X|
|Course Detail|X|X|X|X|X|
|Notifications|X|X|X|X|X|
|Register|X|||||
|Login||X|X|X|X|
|Forgot Password||X|X|X|X|
|Verify OTP||X|X|X|X|
|Reset Password||X|X|X|X|
|Auth Callback||X|X|X|X|
|User Profile||X|X|X|X|
|My Support Tickets||X|X|||
|Personal Salary History|||X|X||
|Manage Accounts||||X|X|
|Account Detail||||X|X|
|Learner Dashboard||X||||
|Learner Classes||X||||
|Learner Class Detail||X||||
|Learner Class Feedback||X||||
|Learner Class Attendance||X||||
|Learner Grades||X||||
|Learner Schedules||X||||
|Class Registration||X||||
|Learner Payment History||X||||
|Learner Payment Detail||X||||
|Learner Payment Checkout||X||||
|Learner Refund Request||X||||
|Tutor Dashboard|||X|||
|My Certificates|||X|||
|Availability Registration|||X|||
|Teaching Schedule|||X|||
|Tutor Classes|||X|||
|Tutor Class Detail|||X|||
|Tutor Attendance Marking|||X|||
|Tutor Gradebook|||X|||
|Tutor Change Requests|||X|||
|Staff Dashboard||||X||
|Staff Consultations||||X||
|Manage Classes||||X||
|Create Class||||X||
|Edit Class||||X||
|Staff Class Detail||||X||
|Master Schedule||||X||
|Tutor Availability View||||X||
|Manage Change Requests||||X||
|Invoice List||||X||
|Invoice Detail||||X||
|Verify Certificates||||X||
|Manage Support Tickets||||X||
|Admin Dashboard|||||X|
|Manage Courses|||||X|
|Create Course|||||X|
|Admin Course Detail|||||X|
|Admin Finance|||||X|
|Manage Discount Codes|||||X|
|Manage Classrooms|||||X|
|Manage Refunds|||||X|
|Refund Detail|||||X|
|Manage Payroll|||||X|
|Payroll Detail|||||X|
|Manage Announcements|||||X|
|Audit Logs|||||X|


## Non-UI Functions

|     |                       |                                   |                                                                                                                                                                                                                                               |
| -----| -----------------------| -----------------------------------| -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #   | Feature               | System Function                   | Description                                                                                                                                                                                                                                   |
| 1   | Authentication        | Password Hashing                  | Secures user passwords by hashing them using modern algorithms (e.g., bcrypt or Argon2) with dynamic salts before persisting to the database. This prevents plain-text exposure even in the event of a database breach.                       |
| 2   | Authentication        | Auto Cleanup Expired Tokens       | Automatically scans and removes expired JWT refresh tokens, unused OTPs, and expired password reset links from the database to optimize storage and maintain system security.                                                                 |
| 3   | Authentication        | Auto-Redirect User Tracing        | Automatically saves the Guest’s trace when they click “Register” on a specific Course Detail screen, and transparently redirects them to that exact Class Registration form immediately after successful login.                               |
| 4   | Notification          | Send Email OTP                    | Interfaces securely with the configured Email Service via SMTP to dispatch highly secure, time-sensitive 6-digit OTPs (One-Time Passwords) required for password recovery and initial account verification.                                   |
| 5   | Notification          | Auto Trigger System Notifications | Automatically pushes in-app notifications upon specific system triggers (e.g., when Staff updates a schedule, when Admin creates an announcement, or when a refund is processed).                                                             |
| 6   | Class Management      | Auto Update Class Status          | Automatically transitions class status to ONGOING when the current date matches the start_date, and to COMPLETED when the current date exceeds the end_date.                                                                                  |
| 7   | Class Management      | Auto Lock Past Attendance         | Automatically locks the attendance recording window for Tutors once the class session date has passed, preventing retrospective modification of attendance data without Staff approval.                                                       |
| 8   | Schedule Management   | Auto-generate Sessions            | Automatically calculates and generates individual class dates (Sessions) by taking the class start date, evaluating the weekly frequency, and skipping configured national holidays to build a complete academic timetable.                   |
| 9   | Schedule Management   | Auto Resolve Schedule Conflicts   | An internal algorithm that automatically validates and prevents any scheduling actions that would result in a Tutor or a physical Classroom being assigned to overlapping time slots.                                                         |
| 10  | Enrollment & Payment  | Auto-calculate Invoice            | Automatically evaluates the final tuition amount in real-time by verifying and deducting any applied Discount Codes from the base course price, ensuring accurate billing before triggering the payment gateway.                              |
| 11  | Enrollment & Payment  | Process Payment Callback          | Exposes a secure webhook endpoint to listen to Payment Gateway IPN signals. It instantly verifies the transaction signature and updates the Invoice status to ‘Paid’, activating the Learner’s enrollment.                                    |
| 12  | Enrollment & Payment  | Auto Cancel Unpaid Registrations  | Automatically cancels class registrations and releases the reserved seats if the Learner fails to complete the payment transaction within 24 hours.                                                                                           |
| 13  | Enrollment & Payment  | Auto Expire Discount Codes        | Automatically invalidates and disables discount codes when their predetermined expiration date passes or when the usage limits are exhausted.                                                                                                 |
| 14  | Enrollment & Payment  | Auto Reject Expired Refunds       | Automatically calculates the elapsed time from the payment timestamp and rejects any refund requests submitted beyond the allowed policy window (e.g., 24-hour window).                                                                       |
| 15  | Financial & Payroll   | Auto Payroll Calculation          | A background cron job that runs automatically on the last day of the month to calculate salaries for Tutors based strictly on the number of sessions taught and substituted sessions.                                                         |
| 16  | Support & Operations  | Auto Escalate Overdue Tickets     | Automatically escalates Learner/Tutor Support Tickets to Urgent status or flags them for Admin review if they remain unresolved by Staff for more than 48 hours.                                                                              |
| 17  | Dashboard & Analytics | Auto Sync System Analytics        | Automatically aggregates and updates the total revenue, total active learners, and payroll cost records in the analytics table to reflect real-time financial data for Admin and Staff Dashboards.                                            |
| 18  | System Audit          | Log Critical Actions              | An invisible interceptor that automatically captures the User ID, Timestamp, IP Address, HTTP Method, and full action payload whenever an Admin modifies sensitive system data, storing it in an immutable audit log for security compliance. |



