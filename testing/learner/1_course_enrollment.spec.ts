import { test, expect } from '@playwright/test';

const learnerEmail = process.env.E2E_LEARNER_EMAIL;
const learnerPassword = process.env.E2E_LEARNER_PASSWORD;

test.skip(!learnerEmail || !learnerPassword, 'E2E learner credentials are not configured');

test('test enrollment (normal)', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill(learnerEmail!);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(learnerPassword!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('link', { name: 'Courses', exact: true }).click();
  await page.getByText('View Details').nth(2).click();
  await page.getByRole('button', { name: 'Enroll Now' }).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await expect(page.locator('label')).toContainText('Pay in Full');
  await expect(page.getByRole('main')).toContainText('6.000.000 đ');
  await page.getByRole('button', { name: 'Proceed to Pay 6.000.000 đ' }).click();
  await expect(page.locator('form')).toContainText('Chọn phương thức thanh toán (Test)');
});

test('test enrollment (with active discount code)', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill(learnerEmail!);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(learnerPassword!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('link', { name: 'Courses', exact: true }).click();
  await page.getByText('View Details').nth(2).click();
  await page.getByRole('textbox', { name: 'Enter code' }).click();
  await page.getByRole('textbox', { name: 'Enter code' }).fill('ICMSHELLO');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('main')).toContainText('5.900.000 đ');
  await page.getByRole('button', { name: 'Enroll Now' }).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await expect(page.getByRole('main')).toContainText('5.900.000 đ');
});

test('test enrollment (with expired discount code)', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill(learnerEmail!);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(learnerPassword!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('link', { name: 'Courses', exact: true }).click();
  await page.getByText('View Details').nth(2).click();
  await page.getByRole('textbox', { name: 'Enter code' }).click();
  await page.getByRole('textbox', { name: 'Enter code' }).fill('SUMMER2026');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('This discount code is inactive or expired')).toBeVisible();
});

test('test enrollment (with disabled discount code)', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill(learnerEmail!);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(learnerPassword!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('link', { name: 'Courses', exact: true }).click();
  await page.getByText('View Details').nth(2).click();
  await page.getByRole('textbox', { name: 'Enter code' }).click();
  await page.getByRole('textbox', { name: 'Enter code' }).fill('ICMSDISABLE');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('This discount code is inactive or expired')).toBeVisible();
});

test('test enrollment (with invalid discount code)', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill(learnerEmail!);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(learnerPassword!);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('link', { name: 'Courses', exact: true }).click();
  await page.getByText('View Details').nth(2).click();
  await page.getByRole('textbox', { name: 'Enter code' }).click();
  await page.getByRole('textbox', { name: 'Enter code' }).fill('AHIHIHI');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('Invalid discount code')).toBeVisible();
});
