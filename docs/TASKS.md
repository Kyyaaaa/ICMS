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
