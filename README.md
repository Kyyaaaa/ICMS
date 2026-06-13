# IELTS Course Management System (ICMS)

Hệ thống quản lý trung tâm IELTS (ICMS) gồm hai phần chính: **Frontend** (React + Vite) và **Backend** (Node.js + Express + Supabase PostgreSQL).

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Setup & Run)

Mỗi khi bạn clone dự án hoặc vừa `git pull` nhánh mới nhất về, hãy luôn thực hiện các bước sau để đảm bảo môi trường đồng bộ:

### 1. Cài đặt Dependencies
Vì đây là 2 dự án độc lập, bạn cần chạy cài đặt cho cả Backend và Frontend:
```bash
# Cài đặt cho Backend
cd backend
npm install

# Cài đặt cho Frontend
cd ../frontend
npm install
```

### 2. Cấu hình Biến môi trường (.env)
- **Backend:** Tạo file `.env` ở thư mục `backend/` dựa theo mẫu `.env.example`.
- Cấu hình các thông số cốt lõi: `PORT` (Thường là 5000), `SUPABASE_URL`, và `SUPABASE_KEY` (Sử dụng API credentials từ Supabase Dashboard).

### 3. Khởi chạy Server
Mở 2 cửa sổ Terminal (hoặc tab) riêng biệt:

**Terminal 1 - Chạy Backend:**
```bash
cd backend
npm run dev
```
Backend sẽ khởi chạy tại `http://localhost:5000`. Bạn có thể truy cập API Docs qua Swagger tại `http://localhost:5000/api-docs`.

**Terminal 2 - Chạy Frontend:**
```bash
cd frontend
npm run dev
```
Frontend sẽ được Host tại `http://localhost:5173`.

---

## 📁 Cấu trúc Thư mục (Directory Structure)

### Frontend (`/frontend`)
Sử dụng React 19, Vite, Tailwind CSS và Shadcn/UI:
- `src/components/`: Reusable UI components (Nút bấm, Input, Modal,...).
- `src/pages/`: Layout của các trang chính (Login, Home, Admin Dashboard,...).
- `src/services/`: Logic gọi API (thông qua Axios/Fetch).
- `src/hooks/`: Custom React Hooks.
- `src/layouts/`: Các khung Layout tái sử dụng (MainLayout, AuthLayout,...).
- `src/store/` hoặc `src/context/`: Quản lý State toàn cục.

### Backend (`/backend`)
Sử dụng Node.js, Express, TypeScript và Jest:
- `src/configs/`: Khởi tạo kết nối DB Supabase, cấu hình hệ thống và Swagger.
- `src/middlewares/`: Filter trung gian (Xác thực Auth Token, phân quyền Role, xử lý Lỗi,...).
- `src/modules/`: **[QUAN TRỌNG]** Chứa logic nghiệp vụ được đóng gói theo từng domain (Ví dụ: Auth, Account, Courses,...).
- `src/utils/`: Hàm tiện ích dùng chung (Regex Validator, Gửi Email OTP,...).

---

## 🛠️ Hướng dẫn Quy trình Xây dựng API Mới (Dành cho Backend)

Khi phát triển một API / Tính năng mới, hãy tuân thủ kiến trúc **Module Pattern** để giữ code Clean và dễ mở rộng.

### Bước 1: Tạo Module
Giả sử tạo tính năng `Payment`. Tạo thư mục `backend/src/modules/payment` và tạo các file sau:
1. `payment.controller.ts`:
   - Nhiệm vụ: Tiếp nhận Request (`req.body`, `req.query`) và chuyển tiếp xuống Service. **Tuyệt đối KHÔNG thực hiện Validate dữ liệu tại Controller**.
   - Nhận kết quả từ Service và trả về Response (ví dụ: `200 OK` hoặc catch lỗi để trả về `400/500`).
2. `payment.service.ts`:
   - Nhiệm vụ: **Thực hiện Validate rất nghiêm ngặt dữ liệu đầu vào** và chứa toàn bộ Business Logic cốt lõi (Kiểm tra điều kiện, tính toán,...).
   - **Xử lý lỗi (Error Handling):** Khi xử lý logic hoặc validate mà phát hiện lỗi, tiến hành `throw` luôn tại đây (VD: `throw new Error('Invalid data')`). Không đẩy luồng dữ liệu lỗi xuống Repository mới throw nếu có thể bắt được từ sớm.
   - Gọi tới Repository/Supabase để lấy hoặc lưu dữ liệu khi các điều kiện đã hợp lệ.
3. `payment.repository.ts` (Tùy chọn):
   - Nhiệm vụ: Nơi chứa 100% các câu Query tương tác trực tiếp tới DB / Supabase Client.
4. `payment.route.ts`:
   - Nhiệm vụ: Khai báo URL Endpoint, gắn Middleware (VD: `verifyToken`, `requireRole(['ADMIN'])`) và liên kết tới Controller.

### Bước 2: Viết Tài liệu API (Swagger UI)
Trong file `payment.route.ts`, hãy sử dụng **JSDoc** phía trên từng định nghĩa Route để tạo tài liệu tự động:
```typescript
/**
 * @swagger
 * /api/payment/checkout:
 *   post:
 *     summary: Xử lý thanh toán
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Thanh toán thành công
 */
router.post('/checkout', verifyToken, PaymentController.checkout);
```

### Bước 3: Tạo thư mục `__test__` để Kiểm thử (Test API)
Trong thư mục module vừa tạo, thêm một thư mục con là `__tests__` (`backend/src/modules/payment/__tests__`). Mọi việc kiểm thử sẽ gom gọn vào đây!

#### 1. Test thủ công bằng REST Client (VS Code)
Tạo file `payment.http`:
- File này dùng Extension "REST Client" trong VS Code.
- Cấu hình một cái `@baseUrl` và viết các request mẫu để Frontend hoặc Backend có thể click `Send Request` và Test API nhanh chóng ngay trong Editor mà không cần Postman.
```http
@baseUrl = http://localhost:5000/api
@accessToken = YOUR_BEARER_TOKEN

### Tạo thanh toán mới
POST {{baseUrl}}/payment/checkout
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "amount": 500000
}
```

#### 2. Test tự động (Unit Test với Jest)
Tạo file `payment.controller.test.ts`:
- Sử dụng `supertest` kết hợp `jest`.
- Tập trung bao phủ toàn bộ các **Edge Cases** (Trường hợp dị thường): 
  - Gửi thiếu trường `amount` -> Expect trả về lỗi 400.
  - Gửi `amount` là chữ -> Expect trả về lỗi 400.
  - Mockup Service báo lỗi "Số dư không đủ" -> Expect trả về 400 và câu thông báo.
- Chạy lệnh test:
```bash
npm run test
```
Đảm bảo kết quả test luôn đạt màu xanh 100% trước khi đẩy code lên!
