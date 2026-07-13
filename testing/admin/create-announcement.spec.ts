import { test, expect } from '@playwright/test';

test('happy case: create announcement successfully', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL(/.*\/homepage.*/);
  await page.goto('http://localhost:5173/admin/announcements');
  await page.getByRole('button', { name: 'New Announcement' }).click();
  await page.getByPlaceholder('e.g. System Maintenance Notice').fill('System update');
  await page.getByPlaceholder('Type the announcement message here...').fill('Update system to version 2.0');
  await page.getByText('Schedule for later').click();
  await page.locator('input[type="datetime-local"]').fill('2026-12-12T22:00');
  await page.getByRole('button', { name: 'Schedule Announcement' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('Announcement saved successfully.')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
});

test('error case: validation fails when required fields are missing', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@123');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL(/.*\/homepage.*/);
  await page.goto('http://localhost:5173/admin/announcements');
  await page.getByRole('button', { name: 'New Announcement' }).click();
  await page.getByPlaceholder('e.g. System Maintenance Notice').fill('System update');
  await page.getByPlaceholder('Type the announcement message here...').fill('Update system to version 2.0');
  await page.getByRole('button', { name: 'Specific Roles' }).click();
  await page.getByRole('button', { name: 'Publish Now' }).click();
  await expect(page.getByText('Please select at least one role for the target audience.')).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
});
