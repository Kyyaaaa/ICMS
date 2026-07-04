import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  /* Chạy các file test song song */
  fullyParallel: true,
  /* Thất bại trong CI thì không cho phép test có .only */
  forbidOnly: !!process.env.CI,
  /* Số lần thử lại (retries) nếu test fail */
  retries: process.env.CI ? 2 : 0,
  /* Số lượng worker chạy song song */
  workers: process.env.CI ? 1 : undefined,
  /* Định dạng báo cáo (reporter): html, list... */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  /* Cấu hình chung cho tất cả các test */
  use: {
    /* Base URL của frontend đang chạy dev server */
    baseURL: 'http://localhost:5173',

    /* Thu thập trace khi test fail để debug dễ dàng hơn */
    trace: 'on-first-retry',

    /* Chụp ảnh màn hình khi test fail */
    screenshot: 'only-on-failure',

    /* Quay video khi test fail */
    video: 'retain-on-failure',

    launchOptions: {
      slowMo: 1000,
    },
    headless: false
  },

  /* Các trình duyệt kiểm thử (Projects) */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Bạn có thể mở comment để test thêm trên Firefox hoặc Safari
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Tự động chạy web server trước khi test (nếu muốn tự khởi động Frontend) */
  // webServer: {
  //   command: 'npm run dev --prefix ../frontend',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
});
