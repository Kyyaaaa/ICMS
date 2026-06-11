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
- `[x]` **BE-08: Đồng bộ nguồn dữ liệu User từ bảng Account (DB nội bộ)**
  - Cập nhật `AuthRepository.getAccountByEmail` để `select('*')` thay vì chỉ `select('id')`.
  - Cập nhật `AuthService.login`: Lấy thông tin user từ `AuthRepository.getAccountByEmail` và trả về thông tin này thay vì trả về `user` của Supabase Auth.
  - Cập nhật `AuthController.login`: Lấy `full_name`, `role`, `avatar_url` từ kết quả của DB nội bộ thay vì từ `user_metadata`.

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
  - Bổ sung nút "Login với Google" bằng icon chuẩn ở màn hình Đăng nhập & Đăng ký.
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

---

## 🚀 5. Kế hoạch Refactor Hệ Thống: Chuyển Source of Truth về `public.account`

### 🧑‍💻 Backend Agent
- `[x]` **BE-09: Thực thi Refactor (Đã hoàn thành bởi Antigravity)**
  - Chuyển source of truth từ `auth.users` (user_metadata) về `public.account`.
  - Cập nhật Auth Middleware: Lấy thông tin user từ `public.account`.
  - Gỡ bỏ hoàn toàn logic mã tự động (`account_code`) ở mọi module.
  - Cập nhật Account Module: Thay thế `auth.admin` APIs bằng truy vấn DB nội bộ. Hỗ trợ search và filter trực tiếp qua DB.
  - Cập nhật Learner Module: Xóa 2 chiều và thêm record mới đảm bảo đồng bộ với `public.account`.
  - Fix và chạy lại toàn bộ Unit Test.
- `[x]` **BE-10: Review code & Kiểm tra tổng thể**
  - Rà soát lại toàn bộ mã nguồn xem còn bất kỳ endpoint/dependency nào đang dựa dẫm vào trường `account_code` không.
  - Kiểm tra xem Supabase RLS (Row Level Security) trên `public.account` đã được cấu hình chặt chẽ chưa.

### 🎨 Frontend Agent
- `[x]` **FE-07: Cập nhật giao diện Admin Dashboard (Quản lý Account)**
  - Cập nhật UI/UX ở danh sách tài khoản: Gỡ bỏ hiển thị cột "Account Code".
  - Cập nhật lại data binding cho bảng, lấy dữ liệu từ property `data` và phân trang với property `total` từ API response mới.
- `[x]` **FE-08: Cập nhật luồng tạo/chỉnh sửa Account**
  - Xóa bỏ field `account_code` khỏi tất cả các form Tạo mới / Cập nhật tài khoản.
  - Cập nhật cách truyền trạng thái Ban/Unban (API yêu cầu payload `{ status: 'ACTIVE' | 'BANNED' }`).
- `[x]` **FE-10: Tích hợp API mới vào Axios/Redux/React Query**
  - Cập nhật các service gọi API của Account và Learner module để match chính xác với cấu trúc JSON Response mới của Backend (`{ success: true, data: ..., total: ... }`).
- `[x]` **FE-09: Cập nhật màn hình Hồ sơ (Profile)**
  - Đảm bảo màn hình hiển thị hồ sơ cá nhân của người dùng không còn render thuộc tính `account_code` bị lỗi `undefined`.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-07: Kiểm thử luồng CRUD Account trên Admin Dashboard**
  - Đảm bảo Admin có thể lấy danh sách, tạo mới, cập nhật, và đổi status người dùng bình thường với cơ chế DB mới.
  - Kiểm tra các chức năng Filter, Search và Pagination của bảng Account có hoạt động đúng không.
- `[x]` **QA-08: Kiểm thử luồng Auth/Learner với Source of Truth mới**
  - Kịch bản 1: Đăng ký một Learner mới (Kỳ vọng: Tự động phát sinh 1 record trong bảng `auth.users` VÀ 1 record trong `public.account` với role `LEARNER`).
  - Kịch bản 2: Đăng nhập và kiểm tra access token. Chắc chắn middleware `verifyToken` đã parse đúng role từ database.
  - Kịch bản 3: Xóa một Learner (Kỳ vọng: Bản ghi biến mất đồng thời ở cả `auth.users` và `public.account`).

---

## 🔄 6. Kế hoạch Token Auto-Refresh

### 🎯 Mục tiêu
Khi `access_token` hết hạn, hệ thống tự động dùng `refresh_token` để lấy token mới mà không yêu cầu người dùng đăng nhập lại. Nếu refresh thất bại, tự động logout và redirect về `/login`.

### 🧑‍💻 Backend Agent

- `[x]` **BK-01: Kiểm tra & hoàn thiện `auth.repository.ts`**
  - Đảm bảo có method `refreshSession(refreshToken: string)` gọi `supabase.auth.refreshSession({ refresh_token: refreshToken })`.

- `[x]` **BK-02: Kiểm tra & hoàn thiện `auth.service.ts`**
  - Đảm bảo có method `refreshToken(refreshToken: string)`:
    - Gọi `AuthRepository.refreshSession(refreshToken)`.
    - Nếu lỗi hoặc không có session → throw `Error('Refresh token invalid or expired. Please login again.')`.
    - Trả về `{ access_token, refresh_token }` mới.

- `[x]` **BK-03: Kiểm tra & hoàn thiện `auth.controller.ts`**
  - Đảm bảo có method `refreshToken(req, res)`:
    - Input: `{ refresh_token: string }` trong `req.body`.
    - Validation: Trả `400` nếu thiếu `refresh_token`.
    - Success: `200` với `{ success: true, data: { access_token, refresh_token } }`.
    - Failure: `401` với `{ success: false, message: "..." }`.

- `[x]` **BK-04: Kiểm tra & hoàn thiện `auth.routes.ts`**
  - Đảm bảo đã đăng ký route: `router.post('/refresh', AuthController.refreshToken)`.
  - Kiểm tra route không bị bảo vệ bởi auth middleware (endpoint này phải public).

- `[x]` **BK-05: Kiểm tra tính tương thích**
  - Đảm bảo endpoint mới không xung đột với các middleware hiện có.

### 🎨 Frontend Agent

- `[x]` **FE-11: Kiểm tra & hoàn thiện `src/lib/api.ts`**
  - File đã được tạo sẵn, agent cần verify các logic sau đúng và đủ:
    1. `isTokenExpired(token)`: Decode JWT, coi là hết hạn nếu còn dưới **30 giây**.
    2. `doRefresh()`: Gọi `POST /api/auth/refresh`, cập nhật cookie nếu thành công, trả `false` nếu thất bại.
    3. `logout()`: Xóa 3 cookie (`access_token`, `refresh_token`, `user_info`) và redirect `/login`.
    4. `apiFetch(path, options)`: Wrapper tự động gắn `Authorization` header, **Proactive refresh** nếu token sắp hết hạn, **Reactive refresh** nếu server trả `401` và retry.

- `[x]` **FE-12: Áp dụng `apiFetch` cho toàn bộ trang authenticated**
  - Thay thế tất cả `fetch('http://localhost:5000/api/...')` (kèm `Authorization` header) bằng `apiFetch('/...')`.
  - **KHÔNG** thay các trang public (login, register, forgot-password, verify-otp, reset-password, auth-callback).
  - Danh sách files cần xử lý:

  **Learner:**
  - `[x]` `features/learner/routes/profile.tsx` *(đã áp dụng, cần verify)*
  - `[x]` `features/learner/routes/dashboard.tsx`
  - `[x]` `features/learner/routes/classes.tsx`
  - `[x]` `features/learner/routes/class-detail.tsx`
  - `[x]` `features/learner/routes/payments.tsx`
  - `[x]` `features/learner/routes/checkout.tsx`
  - `[x]` `features/learner/routes/schedules.tsx`
  - `[x]` `features/learner/routes/attendance.tsx`
  - `[x]` `features/learner/routes/refund.tsx`
  - `[x]` `features/learner/routes/registration.tsx`

  **Staff:**
  - `[x]` `features/staff/routes/accounts.tsx`
  - `[x]` `features/staff/routes/my-profile.tsx`
  - `[x]` `features/staff/routes/consultations.tsx`
  - `[x]` `features/staff/routes/classes.tsx`
  - `[x]` `features/staff/routes/class-detail.tsx`
  - `[x]` `features/staff/routes/create-class.tsx`
  - `[x]` `features/staff/routes/invoices.tsx`
  - `[x]` `features/staff/routes/invoice-detail.tsx`
  - `[x]` `features/staff/routes/master-schedule.tsx`
  - `[x]` `features/staff/routes/profiles.tsx`
  - `[x]` `features/staff/routes/profile-detail.tsx`
  - `[x]` `features/staff/routes/salary.tsx`
  - `[x]` `features/staff/routes/change-requests.tsx`
  - `[x]` `features/staff/routes/tutor-availability.tsx`
  - `[x]` `features/staff/routes/support-tickets.tsx`
  - `[x]` `features/staff/routes/dashboard.tsx`

  **Admin:**
  - `[x]` `features/admin/routes/accounts.tsx`
  - `[x]` `features/admin/routes/account-detail.tsx`
  - `[x]` `features/admin/routes/profile.tsx`
  - `[x]` `features/admin/routes/courses.tsx`
  - `[x]` `features/admin/routes/course-detail.tsx`
  - `[x]` `features/admin/routes/classrooms.tsx`
  - `[x]` `features/admin/routes/discount-codes.tsx`
  - `[x]` `features/admin/routes/payroll.tsx`
  - `[x]` `features/admin/routes/payroll-detail.tsx`
  - `[x]` `features/admin/routes/refunds.tsx`
  - `[x]` `features/admin/routes/refund-detail.tsx`
  - `[x]` `features/admin/routes/finance.tsx`
  - `[x]` `features/admin/routes/announcements.tsx`
  - `[x]` `features/admin/routes/audit-logs.tsx`
  - `[x]` `features/admin/routes/dashboard.tsx`

  **Tutor:**
  - `[x]` `features/tutor/routes/profile.tsx`
  - `[x]` `features/tutor/routes/dashboard.tsx`
  - `[x]` `features/tutor/routes/attendance.tsx`
  - `[x]` `features/tutor/routes/availability.tsx`
  - `[x]` `features/tutor/routes/change-requests.tsx`
  - `[x]` `features/tutor/routes/qualifications.tsx`
  - `[x]` `features/tutor/routes/salary.tsx`
  - `[x]` `features/tutor/routes/schedule.tsx`
  - `[x]` `features/tutor/routes/support-tickets.tsx`

  **Shared:**
  - `[x]` `components/shared/notifications.tsx`
  - `[x]` `components/shared/support-tickets.tsx`

- `[x]` **FE-13: Cải thiện `ProtectedRoute.tsx`**
  - Decode JWT, nếu token đã hết hạn VÀ không có `refresh_token` → redirect `/login` ngay lập tức.

### 🕵️‍♂️ QA Agent

- `[x]` **QA-09: Viết unit test cho `POST /api/auth/refresh`**
  - Bổ sung vào `auth.controller.test.ts` block `describe('POST /api/auth/refresh', ...)`:
    - TC1: Refresh thành công → `200`, `{ success: true, data: { access_token, refresh_token } }`
    - TC2: Thiếu `refresh_token` → `400`, message `"Please provide refresh_token"`
    - TC3: Refresh token không hợp lệ → `401`, `{ success: false }`
    - TC4: Refresh token đã hết hạn → `401`, `{ success: false }`

- `[x]` **QA-10: Thêm request mẫu vào `auth.http`**
  - Thêm section `### Refresh Token` với payload `{ "refresh_token": "..." }` để manual test endpoint.

- `[x]` **QA-11: Test edge cases**
  - Token bị thay đổi 1 ký tự → phải trả `401`.
  - Gọi refresh 2 lần với cùng 1 refresh token (rotation) → lần 2 phải `401`.
  - Body rỗng `{}` → phải trả `400`.

---

## 🛡️ 7. Kế hoạch ngăn chặn can thiệp tài khoản cùng cấp (Khóa, Sửa thông tin)

### 🎯 Mục tiêu
Đảm bảo tính an toàn của hệ thống bằng cách ngăn chặn người dùng tự khóa tài khoản của chính mình, và đặc biệt là **ngăn chặn việc can thiệp (sửa thông tin, đổi role, khóa/mở khóa)** vào các tài khoản của người có cùng vai trò (Ví dụ: ADMIN không được quyền sửa profile hay khóa một ADMIN khác).

### 🧑‍💻 Backend Agent
- `[x]` **BE-11: Cập nhật hàm `setAccountStatus` trong `account.service.ts`**
  - Cập nhật tham số của hàm thành: `setAccountStatus(callerRole: string, callerId: string, targetId: string, status: string)`.
  - Thêm logic kiểm tra (RBAC Check) ngay sau khi lấy thông tin `user` mục tiêu:
    - Kiểm tra tự khóa: `if (callerId === targetId) throw new Error('Forbidden: You cannot change your own status');`
    - Kiểm tra cùng cấp: `if (callerRole === user.role) throw new Error('Forbidden: You cannot change the status of accounts with the same role');`
- `[x]` **BE-12: Cập nhật hàm `updateAccount` trong `account.service.ts`**
  - Bổ sung logic kiểm tra chặn can thiệp người cùng cấp: `if (callerId !== targetId && callerRole === user.role) throw new Error('Forbidden: You cannot update accounts with the same role');`. Lưu ý: Vẫn cho phép cập nhật thông tin của CHÍNH MÌNH (`callerId === targetId`).
- `[x]` **BE-13: Cập nhật `account.controller.ts`**
  - Tại hàm `updateAccountStatus`: Lấy thêm `callerId = req.user.id` và truyền vào `AccountService.setAccountStatus(...)`.
  - Tại hàm `updateAccount`: Cập nhật tham số truyền vào hàm `setAccountStatus`.

### 🎨 Frontend Agent
- `[x]` **FE-14: Cập nhật UI Admin/Staff Dashboard**
  - Ở màn hình Danh sách tài khoản (`accounts.tsx`) và Chi tiết tài khoản (`account-detail.tsx`), vô hiệu hóa (disabled) nút Ban/Active hoặc ẩn đi nếu tài khoản đó là chính mình (`userInfo.id === target.id`).
  - Vô hiệu hóa **toàn bộ chức năng chỉnh sửa (Edit, Ban/Active, Đổi Role)** nếu tài khoản mục tiêu đó có cùng `role` với mình nhưng khác ID.
  - Cập nhật thông báo trực quan (Tooltip hoặc Alert) giải thích lý do không thể khóa/chỉnh sửa.

### 🕵️‍♂️ QA Agent
- `[x]` **QA-12: Cập nhật Unit Tests**
  - Cập nhật các mock implementation của `AccountService.setAccountStatus` trong file `account.controller.test.ts` để khớp với signature mới.
  - Viết test case: ADMIN gọi API sửa thông tin ADMIN khác (kỳ vọng 403).
  - Viết test case: ADMIN gọi API sửa thông tin chính mình (kỳ vọng thành công).
- `[x]` **QA-13: Cập nhật API Request File**
  - Bổ sung các kịch bản test thủ công vào file `account.http` để minh họa việc cố tình ban/sửa thông tin người cùng cấp sẽ bị chặn lại.


