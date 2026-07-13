import { test, expect } from '@playwright/test';

test('happy case: create course successfully with valid data', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL(/.*\/homepage.*/);
  await page.goto('http://localhost:5173/admin/courses/new');
  await page.getByPlaceholder('e.g. IELTS Intensive Mastery').fill('IELTS Intensive Mastery');
  await page.locator('select[name="category"]').selectOption('Masterclass');
  await page.locator('select[name="status"]').selectOption('Active');
  await page.locator('input[name="minBand"]').fill('6.5');
  await page.locator('input[name="maxBand"]').fill('7.5');
  await page.getByPlaceholder('e.g. English').fill('English');
  await page.getByPlaceholder('e.g. London Center').fill('Caugiay - HaNoi');
  await page.getByPlaceholder('15').fill('20');
  await page.getByPlaceholder('e.g. Session 1', { exact: true }).fill('Session 1');
  for (let i = 1; i < 3; i++) {
    await page.getByRole('button', { name: 'Add New Session' }).click();
    await page.getByPlaceholder(`e.g. Session ${i + 1}`, { exact: true }).fill(`Session ${i + 1}`);
  }

  await page.getByPlaceholder('Write a compelling description for this course...').fill(
    'The IELTS Intensive Mastery course is designed for driven learners aiming to break through to a 6.5 - 7.5+ band score. This high-intensity program focuses on advanced exam strategies, intensive practice, and personalized feedback across all four skills (Listening, Reading, Writing, and Speaking). Perfect for those who want to master the IELTS test and achieve their target score with confidence in a short amount of time.'
  );

  await page.locator('input[name="price"]').fill('5000000');
  await page.locator('input[name="original_price"]').fill('5500000');
  await page.locator('input[name="next_cohort"]').fill('2026-07-28');
  await page.getByRole('button', { name: 'Create Course' }).click();
  await expect(page).toHaveURL(/.*\/admin\/courses/);
});

test('error case: validation fails when required fields are missing or invalid', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL(/.*\/homepage.*/);

  await page.goto('http://localhost:5173/admin/courses/new');

  await page.getByPlaceholder('e.g. IELTS Intensive Mastery').fill('Invalid Pricing Course');
  await page.locator('select[name="category"]').selectOption('Masterclass');
  await page.locator('select[name="status"]').selectOption('Active');
  await page.locator('input[name="minBand"]').fill('6.5');
  await page.locator('input[name="maxBand"]').fill('7.5');
  await page.getByPlaceholder('e.g. English').fill('English');
  await page.getByPlaceholder('e.g. London Center').fill('Caugiay - HaNoi');
  await page.getByPlaceholder('15').fill('20');
  await page.locator('input[name="next_cohort"]').fill('2026-07-28');
  await page.locator('.p-4').filter({ hasText: 'Total Sessions' }).locator('input').fill('1');
  await page.getByPlaceholder('e.g. Session 1', { exact: true }).fill('Session 1');

  await page.locator('input[name="price"]').click();
  await page.locator('input[name="price"]').fill('5000000');

  await page.locator('input[name="original_price"]').click();
  await page.locator('input[name="original_price"]').fill('4000000');

  await page.getByRole('button', { name: 'Create Course' }).click();

  await expect(page.getByText('Original Price must be greater than or equal to the current Price.')).toBeVisible();
});
