import { test, expect } from '@playwright/test';

test('happy case: edit course successfully', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL(/.*\/homepage.*/);
  await page.goto('http://localhost:5173/admin/courses');
  await page.getByRole('row', { name: /IELTS Intensive Mastery/i }).getByTitle('View').click();
  await page.waitForURL(/.*\/admin\/courses\/.*/);
  await page.getByRole('button', { name: 'Edit Course' }).click();
  await page.locator('input[name="maxSize"]').first().fill('25');
  await page.locator('select[name="status"]').selectOption('Hidden');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Course saved successfully!')).toBeVisible();
});

test('error case: validation fails when original price is less than current price', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL(/.*\/homepage.*/);
  await page.goto('http://localhost:5173/admin/courses');
  await page.getByRole('row', { name: /IELTS Intensive Mastery/i }).getByTitle('View').click();
  await page.waitForURL(/.*\/admin\/courses\/.*/);
  await page.getByRole('button', { name: 'Edit Course' }).click();
  await page.locator('input[name="price"]').fill('5000000');
  await page.locator('input[name="originalPrice"]').fill('4000000');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Original Price must be greater than or equal to the current Price.')).toBeVisible();
});
