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
