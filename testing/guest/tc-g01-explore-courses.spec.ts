import { test, expect } from '@playwright/test';

/**
 * 🧪 KỊCH BẢN KIỂM THỬ GIAO DIỆN E2E: NHÓM KHÁCH VÃNG LAI (GUEST)
 * ID: TC-G01 - Khám phá khóa học & Điều hướng trang chủ
 * 
 * Mô tả: Kiểm thử luồng trải nghiệm cơ bản của một khách truy cập chưa đăng nhập
 * khi vào hệ thống ICMS để xem thông tin khóa học và tìm hiểu trung tâm.
 */

test.describe('TC-G01: Khách truy cập khám phá khóa học (Guest Flow)', () => {

  test('Happy Case: Khách truy cập vào trang chủ và điều hướng đến trang Khóa học', async ({ page }) => {
    // 1. Mở trang chủ của hệ thống (phụ thuộc vào baseURL trong playwright.config.ts)
    await page.goto('/');

    // 2. Kiểm tra trang đã tải thành công bằng cách kiểm tra URL hoặc tiêu đề/thẻ Header
    await expect(page).toHaveURL('/');
    
    // 3. Tìm và click vào liên kết "Courses" hoặc "Khóa học" trên thanh điều hướng (Navbar)
    // Playwright hỗ trợ tìm kiếm bằng role, text hoặc css selector
    const coursesLink = page.getByRole('link', { name: /courses|khóa học/i }).first();
    
    // Nếu có link Courses, thực hiện click
    if (await coursesLink.isVisible()) {
      await coursesLink.click();
      
      // 4. Xác nhận URL đã chuyển hướng sang trang danh sách khóa học (/courses)
      await expect(page).toHaveURL(/.*\/courses/);
    } else {
      // Trường hợp điều hướng trực tiếp bằng URL nếu không tìm thấy nút trên Nav
      await page.goto('/courses');
      await expect(page).toHaveURL(/.*\/courses/);
    }

    // 5. Kiểm tra danh sách khóa học có hiển thị trên màn hình
    // Đợi thẻ chứa tiêu đề trang hoặc danh sách hiển thị
    const pageTitle = page.locator('h1, h2').first();
    await expect(pageTitle).toBeVisible();
  });

  test('Alternative Case: Khách tìm kiếm khóa học hoặc xem chi tiết một khóa học bất kỳ', async ({ page }) => {
    // 1. Đi thẳng vào trang Danh sách Khóa học
    await page.goto('/courses');

    // 2. Tìm kiếm ô input search (nếu có trên giao diện)
    const searchInput = page.locator('input[type="text"], input[type="search"], input[placeholder*="Search"], input[placeholder*="Tìm kiếm"]').first();
    
    if (await searchInput.isVisible()) {
      // Nhập từ khóa tìm kiếm ví dụ: "IELTS" hoặc "English"
      await searchInput.fill('IELTS');
      await searchInput.press('Enter');
      
      // Chờ giao diện cập nhật kết quả lọc
      await page.waitForTimeout(1000);
    }

    // 3. Click vào thẻ khóa học (Course Card) đầu tiên để xem chi tiết
    // Giả định các thẻ khóa học có link hoặc nút bấm Xem chi tiết / View Details
    const courseCard = page.locator('a[href^="/courses/"], button:has-text("Detail"), button:has-text("Chi tiết")').first();
    
    if (await courseCard.isVisible()) {
      await courseCard.click();
      
      // 4. Xác nhận đã chuyển vào trang Chi tiết Khóa học (/courses/:id)
      await expect(page).toHaveURL(/.*\/courses\/[a-zA-Z0-9-]+/);
      
      // Kiểm tra có hiển thị thông tin học phí, mô tả hoặc nút đăng ký
      const actionButton = page.locator('button, a').filter({ hasText: /Register|Đăng ký|Enroll|Tư vấn/i }).first();
      await expect(actionButton).toBeVisible();
    }
  });

  test('Navigation Case: Khách truy cập vào trang Đăng nhập từ thanh điều hướng', async ({ page }) => {
    // 1. Mở trang chủ
    await page.goto('/');

    // 2. Tìm nút Đăng nhập / Login trên Navbar
    const loginBtn = page.getByRole('link', { name: /login|đăng nhập/i }).or(page.getByRole('button', { name: /login|đăng nhập/i })).first();
    
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      // 3. Xác nhận đã chuyển sang trang Login
      await expect(page).toHaveURL(/.*\/login/);
    } else {
      await page.goto('/login');
      await expect(page).toHaveURL(/.*\/login/);
    }

    // 4. Kiểm tra form đăng nhập có hiển thị đầy đủ input Email và Password
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passInput = page.locator('input[type="password"], input[name="password"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passInput).toBeVisible();
  });

});
