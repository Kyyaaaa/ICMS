## 📞 11. Kế hoạch thực hiện tính năng Tư vấn Khách hàng tiềm năng (CRM)

Dựa trên tài liệu \project.md\, tính năng này bao gồm các Use Case cốt lõi:
- **UC-36 (Guest):** Submit Consultation Request (Gửi form yêu cầu tư vấn).
- **UC-37 (Staff):** View Consultation Requests (Xem danh sách yêu cầu tư vấn).
- **UC-38 (Staff):** Update Consultation Status (Cập nhật trạng thái và ghi chú cuộc gọi).

### 🗄️ DB Agent
Chịu trách nhiệm thiết kế nền tảng dữ liệu cho module CRM.

- \[x]\ **DB-01: Thiết kế Schema \Consultation_Requests\**
  - Các trường dữ liệu: \id\ (PK), \guest_name\ (String), \guest_email\ (String, Nullable), \guest_phone\ (String), \inquiry_details\ (Text), \status\ (Enum: 'Pending', 'Contacted', 'Converted', 'Canceled'), \call_notes\ (Text), \handled_by_staff_id\ (FK to Account/Staff, Nullable).
  - Khẳng định: KHÔNG tạo khóa ngoại \course_id\ (Bảng nhận yêu cầu tư vấn độc lập, sử dụng text/văn bản làm giao tiếp chính).
  - Audit Timestamps: \created_at\, \updated_at\.
- \[x]\ **DB-02: Thiết lập Quan hệ (Relationships) & Seeder**
  - Quan hệ 1-N: Một Staff xử lý nhiều Consultation Requests.
  - Setup sẵn file Seeder với vài bản ghi mẫu trạng thái \Pending\ để phục vụ phát triển FE.

### 🧑‍💻 Backend Agent
Chịu trách nhiệm xây dựng RESTful APIs theo chuẩn.

- \[x]\ **BE-19: API Khách gửi yêu cầu (\POST /api/consultations\)**
  - Public API, cho phép Guest gọi không cần Token.
  - Validate payload (Bắt buộc phải có Tên và SĐT). Gán giá trị mặc định \status = 'Pending'\.
- \[x]\ **BE-20: API Lấy danh sách yêu cầu (\GET /api/staff/consultations\)**
  - Private API, yêu cầu phân quyền Role = Staff.
  - Hỗ trợ tính năng Pagination (Phân trang) và Filter theo biến \status\. Sắp xếp giảm dần theo \created_at\.
- \[x]\ **BE-21: API Xử lý yêu cầu (\PATCH /api/staff/consultations/:id\)**
  - Private API, yêu cầu phân quyền Role = Staff.
  - **Logic xử lý Race Condition:** Trước khi cập nhật, kiểm tra xem yêu cầu này có đang được nhân viên khác tiếp nhận không (dựa trên \handled_by_staff_id\ khác null và khác ID người đang thao tác). Nếu có nhân viên khác đã/đang xử lý, ném ra lỗi HTTP 409 Conflict: *"Yêu cầu đã được nhân viên khác tiếp nhận"*.
  - Cho phép Staff cập nhật `status` và `call_notes`. Tự động gán `handled_by_staff_id` bằng ID của Staff hiện tại nếu chưa có.

### 🎨 Frontend Agent
Chịu trách nhiệm triển khai giao diện và kết nối APIs.

- [x] **FE-21: Form Đăng ký Tư vấn (Guest Screen)**
  - Dựng UI Form "Nhận Tư Vấn Ngay" gắn vào màn hình Home Page hoặc Course Detail.
  - Tích hợp API BE-19. Hiển thị Alert/Toast cảm ơn sau khi gửi thành công.
- [x] **FE-22: Màn hình Danh sách Yêu cầu (Staff Dashboard)**
  - Xây dựng màn hình `Consultation List`.
  - Hiển thị bảng (Table) danh sách yêu cầu, có tính năng lọc bằng Tabs (Tất cả, Pending, Đã liên hệ).
- [x] **FE-23: Modal Chi tiết & Cập nhật (Staff Screen)**
  - Bắt sự kiện click vào một hàng (row) trên Table để mở Modal Detail.
  - Hiển thị Textarea nhập `call_notes` và Select Dropdown để đổi trạng thái. 
  - Lắng nghe response từ API BE-21: Nếu nhận được lỗi *"Yêu cầu đã được nhân viên khác tiếp nhận"*, hiển thị thông báo lỗi rõ ràng bằng Modal Alert và refresh lại danh sách.

### 🕵️‍♂️ QA Agent
Chịu trách nhiệm đảm bảo chất lượng API và nghiệp vụ.

- `[x]` **QA-17: Kiểm thử Public API Form Tư vấn**
  - Bắn payload thiếu thông tin bắt buộc (SĐT) -> Kỳ vọng HTTP 400.
- `[x]` **QA-18: Kiểm thử Phân quyền Staff**
  - Đăng nhập Learner/Tutor thử gọi API Staff -> Kỳ vọng HTTP 403 Forbidden.
- `[x]` **QA-19: Kiểm thử Race Condition (Xung đột Đồng thời)**
  - Mở 2 trình duyệt với 2 tài khoản Staff khác nhau, cùng mở 1 ID Consultation.
  - Staff 1 bấm lưu -> Thành công.
  - Staff 2 bấm lưu sau đó -> Kỳ vọng API chặn và giao diện hiển thị báo lỗi *"Yêu cầu đã được nhân viên khác tiếp nhận"*.

---

## 🏫 12. Kế hoạch thực hiện tính năng Khởi tạo & Quản lý Lớp học (Class Management)

Dựa trên tài liệu `project.md`, module Class Management bao gồm các Use Case cốt lõi dành cho **Staff**:
- **UC-25:** View Classes (Xem danh sách các lớp học hiện tại, sắp tới hoặc đã hoàn thành).
- **UC-26:** Create Class (Tạo lớp học mới: liên kết với Khóa học, gán Phòng học, gán Gia sư, thiết lập Sĩ số tối đa).
- **UC-27:** Update Class Details (Cập nhật thông tin: đổi Gia sư, đổi Phòng học, đổi trạng thái lớp).

### 🗄️ DB Agent
Chịu trách nhiệm khởi tạo nền tảng dữ liệu cho Lớp học.

- `[x]` **DB-03: Thiết kế Schema bảng `Class`**
  - Các trường dữ liệu: `id` (PK), `name` (String, mã/tên lớp), `course_id` (FK to Course, Not Null), `tutor_id` (FK to Account/Tutor, Nullable), `classroom_id` (FK to Classroom, Nullable), `start_date` (Date), `end_date` (Date), `capacity` (Int, sĩ số tối đa), `status` (Enum: 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELED').
  - Audit Timestamps: `created_at`, `updated_at`.
- `[x]` **DB-04: Thiết lập Constraints và Seeder**
  - Đảm bảo tính toàn vẹn Referential Integrity cho các khóa ngoại.
  - Khởi tạo file Seeder mock một vài dữ liệu mẫu cho Lớp học.

### 🧑‍💻 Backend Agent
Xây dựng logic nghiệp vụ. Tuân thủ Rule: **Validate ở Service, throw Error tại Service**.

- `[x]` **BE-22: API Lấy danh sách lớp học (`GET /api/staff/classes`)**
  - Hỗ trợ Pagination và Filter (`status`, `course_id`, `tutor_id`). 
  - Thực hiện JOIN (hoặc populate) để trả về tên Khóa học, tên Gia sư, phòng học thay vì chỉ trả ID.
- `[x]` **BE-23: API Khởi tạo lớp học (`POST /api/staff/classes`)**
  - Validate chặt chẽ payload ở Service (`end_date > start_date`, `capacity > 0`).
  - **Logic Session:** Admin quy định số lượng/nội dung Session theo Course. Khi Staff tạo Lớp (Class), API sẽ tự động lấy template Session từ Course để clone ra thành các records Session riêng cho Class đó. Staff có thể truyền mảng cấu hình thời gian/slot ban đầu cho các Session này trong payload.
- `[x]` **BE-24: API Cập nhật lớp học (`PATCH /api/staff/classes/:id`)**
  - Cho phép thay đổi `tutor_id`, `classroom_id`, `status`.
  - Cung cấp API cập nhật Session (`PATCH /api/staff/classes/:class_id/sessions/:session_id`) để Staff thay đổi linh hoạt thông tin thời gian (date), slot học của từng buổi học.
  - **Logic Cốt lõi (Validate Conflict):** Khi gán Phòng học, Gia sư mới, hoặc sửa slot/date của Session, gọi logic kiểm tra Conflict. Nếu vướng lịch, `throw new Error("Conflict Schedule")` ngay tại Service.
- `[x]` **BE-25: Cài đặt Cron Job tự động cập nhật Status**
  - Setup Background task (node-cron) chạy hằng ngày lúc 00:00.
  - Logic: Chuyển lớp từ `UPCOMING` -> `ONGOING` nếu `start_date <= today`. Chuyển từ `ONGOING` -> `COMPLETED` nếu `end_date < today`.

### 🎨 Frontend Agent
Xây dựng giao diện bảng điều khiển cho Staff.

- `[x]` **FE-24: Màn hình Quản lý Lớp học**
  - Bảng danh sách các lớp học, tích hợp tìm kiếm và các bộ lọc (Dropdown filter).
- `[x]` **FE-25: Giao diện Tạo Lớp học mới**
  - Form chọn: `Course` (Select), `Tutor` (Select), `Classroom` (Select), Ngày bắt đầu/kết thúc (Date Picker).
  - Tích hợp thêm section nhập liệu nâng cao cho phép Staff thiết lập sơ bộ thời gian/slot cho các Session sẽ được sinh ra từ Course template.
  - Áp dụng Global Modal báo lỗi từ API.
- `[x]` **FE-26: Giao diện Chi tiết & Cập nhật Lớp học**
  - Màn hình hiển thị chi tiết Lớp học kèm danh sách các Buổi học (Session) trực thuộc.
  - Modal cập nhật thông tin chung (`Tutor`, `Classroom`, `Status`).
  - Nút/Modal chỉnh sửa riêng (Edit Date/Slot) nằm trên từng dòng của danh sách Session để Staff tinh chỉnh lịch học linh hoạt.
  - Xử lý Modal Alert Conflict Lịch học một cách rõ ràng.

### 🕵️‍♂️ QA Agent
Bảo vệ tính đúng đắn của logic nghiệp vụ phức tạp.

- `[x]` **QA-20: Kịch bản kiểm thử Xung đột lịch (Schedule Conflict)**
  - Cố tình gán một Lớp học (hoặc sửa slot của Session) vào phòng học/gia sư đã kẹt lịch khác -> Kỳ vọng: Backend văng lỗi HTTP 400/409 và giao diện chặn lại.
- `[x]` **QA-21: Kiểm thử luồng Clone Session**
  - Tạo Lớp học thành công -> Kiểm tra trong DB xem số lượng Session được sinh ra có khớp chính xác với thiết kế Session của Khóa học (Course) không.
- `[x]` **QA-22: Kiểm thử tự động cập nhật Trạng thái (Cron Job)**
  - Cập nhật thủ công ngày hiện tại hoặc trigger Cron chạy tay -> Kiểm tra trạng thái nhảy đúng logic Up coming -> Ongoing -> Completed.
- `[x]` **QA-23: Bổ sung HTTP Testing**
  - Tạo file `class.http` chứa các request khởi tạo lớp, sửa lịch học để team Backend dễ dàng maintain.

---

## 🌐 13. Chuẩn hóa Ngôn ngữ Hệ thống (Language Standardization)

Dựa trên Rule trong tài liệu `.agent/language.md`: **Code 100% tiếng Anh, Comment 100% tiếng Việt**.
Toàn bộ mã nguồn, các câu báo lỗi, và văn bản hiển thị trên UI cần được đổi sang tiếng Anh.

### 🧑‍💻 Backend Agent
Chịu trách nhiệm dịch toàn bộ các message trả về từ API và các log nội bộ.

- `[x]` **BE-26: Chuẩn hóa Error Messages và API Responses**
  - Sửa `consultation-request.service.ts` & `controller.ts` (VD: "Yêu cầu đã được nhân viên..." -> "Conflict: Request handled by another staff").
  - Sửa `auth.middleware.ts` (Lỗi Token/Role).
  - Khảo sát nhanh toàn bộ thư mục `src/modules` và `src/middlewares` để phát hiện và thay thế các chuỗi tiếng Việt.
- `[x]` **BE-27: Cập nhật Unit Tests**
  - Sửa lại các Expectation (Assertions) trong các file `*.test.ts` (VD: `consultation-request.controller.test.ts`) để test chạy pass với message tiếng Anh mới.

### 🎨 Frontend Agent
Chịu trách nhiệm dịch toàn bộ các từ khóa, nút bấm, thông báo, và tiêu đề trên giao diện UI.

- `[x]` **FE-27: Chuẩn hóa Global UI & Alerts**
  - Sửa `axiosClient.ts` (VD: "Tài khoản bị khóa" -> "Account deactivated", "Thông báo" -> "Notification").
- `[x]` **FE-28: Chuẩn hóa Giao diện Khách (Guest) & Xác thực (Auth)**
  - Sửa `homepage.tsx` ("Nhận tư vấn ngay", "Tên", "Số điện thoại" -> "Get a Consultation", "Name", "Phone number").
  - Sửa `ProtectedRoute.tsx`, `verify-otp.tsx`, `auth-callback.tsx`.
- `[x]` **FE-29: Chuẩn hóa Giao diện Nhân viên (Staff)**
  - Dịch toàn bộ màn hình Quản lý Tư vấn (`consultations.tsx`) và Quản lý Lớp học (`classes.tsx`, `create-class.tsx`, `class-detail.tsx`).
  - Đổi toàn bộ các cột bảng (Tên, Mã, Trạng thái), nút bấm (Lưu, Đóng, Sửa), và Modal Confirm (Bạn có chắc chắn...) sang tiếng Anh tương ứng.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-24: Rà soát lại chất lượng ngôn ngữ**
  - Mở giao diện và kiểm tra ngẫu nhiên xem có sót chuỗi tiếng Việt nào không.
  - Sửa đổi nội dung payload trong các file `*.http` (ví dụ `consultation.http`, `class.http`) để sử dụng sample data bằng tiếng Anh (hoặc không chứa ký tự tiếng Việt báo lỗi).

---

## 🚀 14. Kế hoạch Vận hành Lớp học (Class Operations - Phase 1 & 3)

Theo thống nhất, mảng Thanh toán (Payment) sẽ được lùi lại. Giai đoạn này tập trung đưa Học viên vào lớp (Ghi danh miễn phí/Công nợ) và thực hiện Điểm danh hàng ngày.

### 🗄️ DB Agent
- `[x]` **DB-05: Schema `Enrollment` và `Attendance`**
  - Tạo bảng `Enrollment`: `id`, `learner_id` (FK Account), `class_id` (FK Class), `enrollment_date`, `status` (Enum: 'ACTIVE', 'CANCELED').
  - Tạo bảng `Attendance`: `id`, `session_id` (FK Session), `learner_id` (FK Account), `status` (Enum: 'NOT_YET', 'PRESENT', 'ABSENT_EXCUSED', 'ABSENT_UNEXCUSED'), `notes`.
  - Đảm bảo Unique Constraint: Một học viên chỉ được enroll vào một lớp 1 lần. Một học viên chỉ có 1 record attendance trong 1 session.

### 🧑‍💻 Backend Agent
- `[x]` **BE-28: API Ghi danh Lớp học (Enrollment)**
  - `POST /api/learner/enrollments`: Bỏ qua check Payment, insert thẳng record vào `Enrollment` với status `ACTIVE`. Validate sĩ số tối đa của Class, nếu đầy ném lỗi.
  - `GET /api/learner/enrollments`: Lấy danh sách lớp Learner đang học.
- `[x]` **BE-29: API Lấy danh sách Lớp học cho chi tiết lớp**
  - `GET /api/classes/:id/students`: Trả về danh sách Learner dựa theo `Enrollment` để Tutor/Staff xem.
- `[x]` **BE-30: API Điểm danh (Attendance)**
  - `GET /api/sessions/:session_id/attendance`: Lấy danh sách học viên trong buổi học. Tự động sinh records mặc định 'NOT_YET' cho tất cả Learner nếu đây là lần đầu gọi.
  - `PUT /api/sessions/:session_id/attendance`: API cho phép Tutor submit mảng dữ liệu điểm danh hàng loạt.

### 🎨 Frontend Agent
- `[x]` **FE-30: Màn hình Học viên Ghi danh**
  - Cập nhật `registration.tsx`: Nút "Đăng ký ngay" sẽ bỏ qua giỏ hàng, gọi thẳng API `BE-28` và hiện thông báo vào lớp thành công.
  - Cập nhật `classes.tsx` (Learner): Gọi API hiển thị Lớp của tôi.
- `[x]` **FE-31: Cập nhật Màn hình Chi tiết Lớp (Staff/Tutor)**
  - Mở tab "Students" trong `class-detail.tsx`, gọi API `BE-29` để hiển thị danh sách học viên hiện tại của lớp.
- `[x]` **FE-32: Giao diện Điểm danh (Tutor Screen)**
  - Cập nhật `attendance.tsx`: Hiển thị danh sách các Session. Bấm vào 1 Session sẽ sổ ra dạng Grid danh sách Học viên.
  - Có các Radio buttons (Present, Absent, Excused) và nút "Lưu điểm danh".

### 🕵️‍♂️ QA Agent
- `[x]` **QA-25: Kiểm thử Sĩ số lớp (Capacity Limit)**
  - Tạo lớp có Capacity = 1. Đưa 1 Learner vào lớp. Đưa Learner thứ 2 vào -> Kỳ vọng Backend văng lỗi 400 và FE hiển thị rõ "Lớp đã đầy".
- `[x]` **QA-26: Kiểm thử luồng Điểm danh End-to-End**
  - Tutor truy cập đúng Session của mình -> Điểm danh "Vắng mặt" 1 Learner -> Gọi lại API Get Attendance xem dữ liệu có lưu đúng không.

---

## 📝 15. Cập nhật trạng thái Điểm danh mặc định (NOT_YET)

Thay đổi logic điểm danh: Trạng thái mặc định khi Tutor chưa điểm danh sẽ là `NOT_YET` thay vì `PRESENT` mặc định.

### 🗄️ DB Agent
- `[x]` **DB-06: Cập nhật Schema Attendance**
  - Chạy migration hoặc thay đổi file schema Database để bổ sung giá trị `'NOT_YET'` vào Enum của trường `status` trong bảng `Attendance`.
  - Cập nhật Data Default của cột `status` thành `'NOT_YET'`.

### 🧑‍💻 Backend Agent
- `[x]` **BE-31: Cập nhật logic Service (`session.service.ts`)**
  - Trong logic hàm `getAttendance`, khi tự động sinh (auto-generate) các bản ghi điểm danh cho học viên trong Session mới, phải truyền giá trị `status: 'NOT_YET'`.
  - Validate payload truyền lên từ `PUT /api/sessions/:session_id/attendance` để cho phép giá trị `NOT_YET`.

### 🎨 Frontend Agent
- `[x]` **FE-33: Cập nhật giao diện Điểm danh (`attendance.tsx`)**
  - Thêm xử lý hiển thị trạng thái `NOT_YET` (Ví dụ: Chữ màu xám, hoặc thêm một Radio button/Label "Chưa điểm danh").
  - Nếu bản ghi đang ở `NOT_YET`, giao diện cần làm nổi bật để Tutor biết là mình chưa thao tác trên học viên này.
  - Khi Tutor bấm "Đánh dấu tất cả là Có mặt", FE phải chuyển toàn bộ các record `NOT_YET` sang `PRESENT`.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-27: Kiểm thử mặc định Điểm danh**
  - Tạo một buổi học mới -> Lần đầu Get Attendance -> Kỳ vọng BE trả về 100% học viên có status là `NOT_YET`.
  - Đảm bảo việc lưu `NOT_YET` (hoặc update từ NOT_YET sang PRESENT) qua API thành công không báo lỗi Enum.

---

## 🗑️ 16. Hợp nhất trạng thái Điểm danh (Gộp ABSENT)

Theo yêu cầu, gộp 2 loại `ABSENT_EXCUSED` và `ABSENT_UNEXCUSED` thành duy nhất một trạng thái `ABSENT`. Các trạng thái điểm danh mới sẽ là: `NOT_YET`, `PRESENT`, `ABSENT`.

### 🗄️ DB Agent
- `[x]` **DB-07: Cập nhật Database Enum / Schema**
  - Thực hiện thay thế/update database để xóa `ABSENT_EXCUSED` và `ABSENT_UNEXCUSED`, thay bằng `ABSENT`.
  - Migrate các record cũ đang ở trạng thái `ABSENT_EXCUSED` / `ABSENT_UNEXCUSED` sang `ABSENT`.

### 🧑‍💻 Backend Agent
- `[x]` **BE-32: Cập nhật Model và Validation**
  - Cập nhật interface/types tại `backend/src/modules/session/session.model.ts` sang: `'NOT_YET' | 'PRESENT' | 'ABSENT'`.
  - Cập nhật mảng validation tại `session.service.ts` (Dòng 59: `validStatuses`).
  - Cập nhật `@swagger` Enum định nghĩa tại `session.routes.ts`.

### 🎨 Frontend Agent
- `[x]` **FE-34: Cập nhật giao diện Điểm danh**
  - Tìm tất cả các Radio buttons/Dropdown/Logic liên quan đến `ABSENT_EXCUSED` và `ABSENT_UNEXCUSED` trong màn hình `attendance.tsx` (của Tutor và Learner).
  - Thay thế chúng bằng một option duy nhất là "Vắng mặt" (Value: `ABSENT`).
  - Đảm bảo Payload gửi từ Client lên Server chỉ còn bắn đi `ABSENT`.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-28: Kiểm thử luồng Vắng mặt mới**
  - Dùng Tutor chấm `ABSENT` cho một Học viên, kiểm tra xem DB có lưu đúng `ABSENT` không.
  - Học viên đăng nhập và check màn hình tiến độ xem thống kê `ABSENT` có hoạt động chính xác không.

---

## 🚪 17. Quản lý Trạng thái Ghi danh Học viên (Cancel Enrollment)

Tính năng cho phép Staff có thể đuổi/hủy ghi danh học viên khỏi một lớp học.

### 🧑‍💻 Backend Agent
- `[x]` **BE-33: API Hủy ghi danh**
  - Tạo endpoint `PATCH /api/staff/enrollments/:id/cancel` (Private, yêu cầu Role Staff/Admin).
  - Đổi giá trị trường `status` của bản ghi Enrollment tương ứng thành `CANCELED`.
- `[x]` **BE-34: Chỉ hiển thị học viên ACTIVE**
  - Cập nhật logic của API `GET /api/classes/:id/students` (trong `ClassRepository`) để thêm câu lệnh `.eq('status', 'ACTIVE')`. Những học viên đã bị CANCELED sẽ không còn được trả về trong mảng danh sách nữa.

### 🎨 Frontend Agent
- `[x]` **FE-35: Nút Xóa học viên trên giao diện Staff**
  - Bổ sung hàm API Client gọi `PATCH /api/staff/enrollments/:id/cancel`.
  - Cập nhật `ClassStudentsTab.tsx`: Bổ sung cột "Actions", chứa nút Thùng rác màu đỏ cho mỗi hàng.
  - Bấm nút thùng rác -> Hiện Modal Confirm -> OK -> Gọi API và Load lại danh sách.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-29: Kiểm thử loại bỏ Học viên**
  - Đăng nhập Staff, vào lớp, xóa Học viên A.
  - Kỳ vọng: Học viên A biến mất khỏi danh sách (cả tab Students của Staff lẫn form Điểm danh của Tutor).
  - Học viên A đăng nhập: Không còn thấy lớp đó trong mục My Classes.

---

## ➕ 18. Thêm Học viên thủ công (Manual Enrollment)

Tính năng cho phép Staff có thể chủ động add trực tiếp Học viên vào lớp học.

### 🧑‍💻 Backend Agent
- `[x]` **BE-35: API Ghi danh thủ công**
  - Tạo endpoint `POST /api/enrollments/manual` (Private, yêu cầu Role `STAFF`, `ADMIN`).
  - Payload yêu cầu: `learner_id` và `class_id`.
  - Tái sử dụng `EnrollmentService.enrollLearner` để thực hiện ghi danh (tận dụng luôn logic check sức chứa và duplicate).

### 🎨 Frontend Agent
- `[x]` **FE-36: Nút Thêm học viên**
  - Bổ sung hàm API Client `addStudentToClass` gọi tới `POST /api/enrollments/manual`.
  - Bổ sung UI nút "+ Add Student" vào `ClassStudentsTab.tsx`.
- `[x]` **FE-37: Xây dựng AddStudentModal**
  - Modal chứa Select Dropdown để chọn tài khoản Học viên (Gọi API lấy danh sách Role = `LEARNER`).
  - Bấm Save -> Xử lý API -> Đóng modal và Load lại danh sách.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-30: Kiểm thử Thêm Học viên**
  - Staff thêm 1 học viên mới -> Danh sách nhảy số và hiển thị ngay.
  - Test vi phạm: Thêm vào lớp đã Full -> Báo lỗi.
  - Test vi phạm: Thêm người đã học lớp này (hoặc đã học lớp khác cùng khóa) -> Báo lỗi.

---

## 🧾 19. Tích hợp Dữ liệu thật cho Quản lý Hóa đơn (Staff Invoices)

Thay thế dữ liệu Mock trên giao diện quản lý hóa đơn của Staff bằng dữ liệu thật từ Backend (Supabase).

### 🧑‍💻 Backend Agent
- `[x]` **BE-36: API Lấy tất cả Hóa đơn cho Staff**
  - Thêm phương thức `getAllInvoices()` trong `InvoiceRepository`. Fetch dữ liệu từ bảng `invoices`, join với `classes`, `courses` (để lấy tên khóa), `account` (để lấy tên Learner), và `invoice_installments` (để tính toán tiến độ).
  - Thêm hàm xử lý vào `InvoiceController`.
  - Định nghĩa route `GET /api/invoices/all` trong `invoice.routes.ts` với bảo mật Role `['STAFF', 'ADMIN']`.

### 🎨 Frontend Agent
- `[x]` **FE-38: Cập nhật Service Invoice**
  - Trong `frontend/src/features/staff/services/invoices.service.ts`: Xóa bỏ toàn bộ dữ liệu mock cứng (`MOCK_INVOICES`, `MOCK_DETAILED_INVOICE`).
  - Gọi API thực tế `axiosClient.get('/api/invoices/all')` cho danh sách.
  - Gọi API thực tế `axiosClient.get('/api/invoices/:id')` cho chi tiết một hóa đơn.
- `[x]` **FE-39: Ánh xạ Dữ liệu (Data Mapping)**
  - Chuyển đổi payload JSON từ Supabase sang chuẩn cấu trúc `Invoice` và `DetailedInvoice` của giao diện hiện tại.
  - Tính toán các giá trị hiển thị: Tổng tiền (`totalAmount`), Đã trả (`paidAmount`), Tiến độ (`progress` dạng `X/Y`), Ngày giao dịch gần nhất, Trạng thái (Paid, Partial, Overdue, Pending).

### 🕵️‍♂️ QA Agent
- `[x]` **QA-31: Kiểm thử Hiển thị Hóa đơn thật**
  - Truy cập route `/staff/invoices` với tài khoản Staff. Kiểm tra xem các dòng hóa đơn có hiển thị chính xác không.
  - Soi kỹ cột "Progress" và "Amount" xem có khớp với số lượng installment thực tế trong database không.
  - Kiểm tra xem các bộ lọc (Status) và tìm kiếm (Search) trên giao diện có hoạt động đúng với dữ liệu thật hay không.

---

## 📊 20. Bảng điểm động (Dynamic Gradebook) cho Tutor

Xây dựng cấu trúc DB và API để tích hợp dữ liệu thật vào Bảng nhập điểm động của Tutor. Bảng điểm hỗ trợ cột động, thêm nhận xét và thang điểm luôn từ 0-9.

### 🧑‍💻 Backend Agent
- `[x]` **BE-37: Database Schema for Gradebook**
  - Viết logic/script SQL để tạo 2 bảng `assessments` (cột điểm động) và `student_grades` (lưu trữ điểm và feedback).
- `[x]` **BE-38: API Lấy dữ liệu Bảng Điểm**
  - Tạo endpoint `GET /api/tutor/classes/:classId/gradebook`.
  - API cần trả về danh sách `assessments` và danh sách học viên trong lớp kèm điểm số đã match theo `assessment.id` (dạng `StudentWithGrades[]`).
- `[x]` **BE-39: API Lưu toàn bộ Bảng Điểm (Bulk Save)**
  - Tạo endpoint `PUT /api/tutor/classes/:classId/gradebook/save`.
  - Transaction xử lý: Delete cột bị xóa, Insert cột mới, Upsert dữ liệu vào `student_grades` dựa theo payload `gradesData`.

### 🎨 Frontend Agent
- `[x]` **FE-40: Tích hợp API Gradebook**
  - Trong `frontend/src/features/tutor/services/gradebook.service.ts`: Xóa mock data.
  - Cấu hình gọi `axiosClient` tới 2 endpoint mới của Backend.
  - Sửa lại logic sinh ID cho cột mới thay vì `a${Date.now()}` thì dùng `UUID v4` hoặc để Backend tự sinh. Kiểm tra Validation điểm nhập chỉ từ 0 đến 9.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-32: Kiểm thử Bảng điểm động**
  - Test luồng cơ bản: Thêm 1 cột -> Nhập điểm -> Lưu -> Reload trang kiểm tra dữ liệu.
  - Xóa 1 cột -> Lưu -> Reload trang kiểm tra dữ liệu có bị xóa không.
  - Nhập Feedback dài cho 1 ô điểm -> Lưu -> Load lại kiểm tra hiển thị.
  - Đảm bảo điểm số không được phép lớn hơn 9.
