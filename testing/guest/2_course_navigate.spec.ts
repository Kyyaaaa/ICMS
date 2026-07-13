import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/courses');
  await expect(page.getByRole('heading', { name: 'IELTS 30-Day Challenge' })).toBeVisible();
  await page.getByText('View Details').nth(1).click();
  await expect(page.getByRole('heading', { name: 'Session' }).first()).toBeVisible();
  await page.getByRole('button', { name: 'tutors' }).click();
  await expect(page.getByRole('heading', { name: 'Hata No Kokoro' })).toBeVisible();
  await page.getByRole('button', { name: 'schedule' }).click();
  await expect(page.getByRole('heading', { name: 'IELTS Elite' })).toBeVisible();
});