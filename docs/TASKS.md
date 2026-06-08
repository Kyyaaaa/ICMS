# Kế hoạch thực hiện tính năng Authentication (Forgot Password, OTP & Google Login via Supabase)

## 📊 1. Executive Summary (Tóm tắt nhanh)
- **Mục tiêu:** Xây dựng luồng Quên mật khẩu xác thực bằng OTP và tích hợp Đăng nhập bằng Google thông qua Supabase.
- **Trạng thái:** Forgot Password (Đã hoàn thành) / Google Login (Not Started)
- **Các thành phần tham gia:** Backend Agent, Frontend Agent, QA Agent.

## 👥 2. Phân công nhiệm vụ (Tasks Breakdown)

### 🧑‍💻 Backend Agent
- `[x]` **BE-01: Thiết kế & Cập nhật Database Schema**
  - Thêm cơ chế lưu trữ OTP (thêm trường `reset_otp`, `otp_expires_at` vào bảng User hoặc bảng riêng biệt `Otps`).
- `[x]` **BE-02: API Gửi OTP (`POST /auth/forgot-password`)**
  - Nhận email người dùng, kiểm tra email có tồn tại không.
  - Sinh mã OTP ngẫu nhiên (VD: 6 số) và thiết lập thời hạn (VD: 5 phút).
  - Cập nhật OTP (có thể băm - hash) vào database.
  - Tích hợp module Mailer (`mailer.ts`) để gửi OTP qua email.
- `[x]` **BE-03: API Xác thực OTP (`POST /auth/verify-otp`)**
  - Nhận `email` và `otp` từ client.
  - So sánh mã OTP và kiểm tra thời gian hết hạn.
  - Sinh ra mã `reset_token` (có thời hạn ngắn) nếu hợp lệ để trả về cho Client.
- `[x]` **BE-04: API Đặt lại mật khẩu (`POST /auth/reset-password`)**
  - Nhận `reset_token` và mật khẩu mới (`new_password`).
  - Xác thực token. Nếu hợp lệ -> Cập nhật mật khẩu mới (đã hash).
  - Vô hiệu hóa OTP/reset_token đã sử dụng.
- `[x]` **BE-05: Cập nhật logic ràng buộc OTP (5 phút & Hủy OTP cũ)**
  - Đảm bảo thời gian hết hạn (TTL) của OTP ở level DB/Logic được set cứng chính xác là 5 phút.
  - Khi có yêu cầu sinh OTP mới, tự động vô hiệu hóa (hoặc xóa) toàn bộ các OTP cũ đang có hiệu lực của user đó.
- `[x]` **BE-06: Cập nhật logic đặt lại mật khẩu**
  - Tại API `reset-password`, kiểm tra hash của `new_password` với mật khẩu hiện tại trong DB. Trả về lỗi `400` nếu trùng lặp.
- `[x]` **BE-07: Setup & Tích hợp Supabase Google Auth**
  - Cấu hình Google Provider trên Supabase Dashboard (OAuth Client ID & Secret).
  - Thiết lập logic đồng bộ (Sync) User: Khi đăng nhập Google qua Supabase thành công, tìm kiếm user theo email trong DB nội bộ.
  - **Chiến lược Merge Account:** Nếu email đã tồn tại (do đăng ký bằng email/pass trước đó), tiến hành liên kết (update thêm `google_id`, `avatar`) vào tài khoản hiện tại. Nếu chưa có, tạo user mới.
  - Trả về JWT Token theo chuẩn của hệ thống để Client sử dụng xuyên suốt.

### 🎨 Frontend Agent
- `[x]` **FE-01: Giao diện Quên mật khẩu (Forgot Password Screen)**
  - UI form nhập Email (validate format).
  - Nút submit, hiển thị trạng thái Loading khi gọi API gửi OTP.
  - Handle lỗi (Email chưa đăng ký, lỗi mạng...).
- `[x]` **FE-02: Giao diện Xác thực OTP (Verify OTP Screen)**
  - UI nhập 6 số OTP.
  - Tính năng Countdown Timer (ví dụ 05:00) và nút "Gửi lại OTP".
  - Handle logic lưu trữ `reset_token` sau khi verify thành công.
- `[x]` **FE-03: Giao diện Đặt lại mật khẩu (Reset Password Screen)**
  - Form nhập Mật khẩu mới và Xác nhận mật khẩu mới.
  - Gọi API đổi mật khẩu -> Chuyển hướng về trang Login với thông báo thành công.
- `[x]` **FE-04: Đồng bộ trạng thái Countdown 5 phút**
  - Đảm bảo bộ đếm ngược ở màn hình Verify OTP chạy chính xác 5 phút (300s). Khi hết hạn, tự động khóa ô nhập và yêu cầu user "Gửi lại OTP".
- `[x]` **FE-05: Hiển thị lỗi mật khẩu trùng lặp**
  - Bắt lỗi từ API nếu mật khẩu mới trùng với mật khẩu cũ và hiển thị trực quan thông báo lỗi (helper text/toast) cho người dùng.
- `[x]` **FE-06: Giao diện & Tích hợp Đăng nhập Google**
  - Bổ sung nút "Login with Google" bằng icon chuẩn ở màn hình Đăng nhập & Đăng ký.
  - Sử dụng `@supabase/supabase-js` để gọi hàm `signInWithOAuth({ provider: 'google' })`.
  - Lắng nghe callback, xử lý lưu access_token và thông tin user vào Global State/Local Storage, sau đó redirect về trang chủ.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-01: Kiểm thử luồng tích cực (Happy Path)**
  - Thực hiện end-to-end: Yêu cầu OTP -> Lấy OTP -> Verify -> Đổi mật khẩu -> Đăng nhập bằng pass mới thành công.
- `[x]` **QA-02: Kiểm thử ngoại lệ & Biên (Edge Cases)**
  - Nhập sai email, email chưa đăng ký.
  - Nhập sai OTP nhiều lần.
  - Verify OTP khi đã quá hạn (Expired).
  - Dùng `reset_token` cũ để đổi mật khẩu lần 2.
- `[x]` **QA-03: Cập nhật kịch bản kiểm thử API**
  - Hoàn thiện các scripts trong file `auth.http` để cover các trường hợp của luồng.
- `[x]` **QA-04: Test Case - Ràng buộc thời gian & Hủy OTP cũ**
  - Kịch bản 1: Request OTP -> Chờ 5 phút 01 giây -> Verify (Kỳ vọng: Bị từ chối do hết hạn).
  - Kịch bản 2: Request OTP 1 -> Request OTP 2 -> Dùng OTP 1 để Verify (Kỳ vọng: Bị từ chối do OTP 1 đã bị hủy).
- `[x]` **QA-05: Test Case - Đặt lại mật khẩu trùng lặp**
  - Thực hiện thành công luồng Verify OTP -> Nhập mật khẩu mới giống hệt mật khẩu hiện tại (Kỳ vọng: API trả lỗi, UI hiển thị đúng lỗi).
- `[x]` **QA-06: Kiểm thử luồng Đăng nhập Google (Supabase)**
  - Đăng nhập Google lần đầu (Kỳ vọng: User mới được tạo trong DB).
  - Đăng nhập Google ở các lần tiếp theo (Kỳ vọng: Đăng nhập trơn tru, không tạo thêm duplicate record user).
  - Kịch bản Edge Case (Merge Account): User đã có tài khoản (đăng ký bằng email/pass), sau đó dùng chính email đó đăng nhập bằng Google (Kỳ vọng: Hệ thống tự động Merge Account thành công, không văng lỗi trùng email, user dùng được cả 2 cách).

## 🚧 3. Bottlenecks & Risks (Rủi ro tiềm ẩn)
- **Risk 1: Bị lạm dụng API gửi mail (Spam)** -> Khả năng bị cạn kiệt quota gửi email.
  - **Action:** Backend Agent cần triển khai cơ chế Rate Limiting trên API `POST /auth/forgot-password` (VD: Giới hạn 1 phút 1 lần, 5 lần/ngày mỗi IP/Email).
- **Risk 2: Xung đột thời gian (Timeout Sync)** -> Frontend đếm ngược còn thời gian nhưng backend lại báo hết hạn.
  - **Action:** Các Agent thống nhất cấu hình TTL của OTP trước khi code (khuyến nghị: 5 phút).
- **Risk 3: Lộ OTP trên network** 
  - **Action:** Backend tuyệt đối không trả giá trị OTP thô trong response API; QA cần soi kỹ phần này.
- **Risk 4: Xung đột dữ liệu khi Google Login bằng Email đã tồn tại**
  - **Action:** Đã chốt **Chiến lược Merge Account**. Nếu một user đã đăng ký bằng Mật khẩu, sau đó đăng nhập bằng Google với cùng Email, hệ thống sẽ tự động gộp (merge) 2 phương thức này vào 1 tài khoản duy nhất. QA cần test thật kỹ để đảm bảo không bị lỗi Duplicate Key.

## 🎯 4. Next Action Items
1. **@Backend Agent**: Tiến hành cập nhật Schema DB và hoàn thành API `forgot-password` (Tiếp tục với file `mailer.ts` đang mở để chuẩn bị hàm gửi mail OTP).
2. **@Frontend Agent**: Bắt tay vào thiết kế khung UI cho 3 màn hình của luồng Forgot Password (nếu mockups đã sẵn sàng).
3. **@QA Agent**: Cập nhật đầy đủ input testing vào file `auth.http` theo như các Edge Cases đã đề cập.
