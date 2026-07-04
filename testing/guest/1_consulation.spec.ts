import { test, expect } from '@playwright/test';

test('guest create consultation request: happy case', async ({ page }) => {
  await page.goto('http://localhost:5173/homepage');
  await page.getByRole('textbox', { name: 'John Doe' }).click();
  await page.getByRole('textbox', { name: 'John Doe' }).fill('Lilith');
  await page.getByRole('textbox', { name: '09xx xxx xxx' }).click();
  await page.getByRole('textbox', { name: '09xx xxx xxx' }).fill('0123456789');
  await page.getByRole('textbox', { name: 'email@example.com' }).click();
  await page.getByRole('textbox', { name: 'email@example.com' }).fill('lilith@gmail.com');
  await page.getByRole('combobox').selectOption('IELTS Masterclass');
  await page.getByRole('textbox', { name: 'Any specific requirements?' }).click();
  await page.getByRole('textbox', { name: 'Any specific requirements?' }).fill('I need help');
  await page.getByRole('button', { name: 'Submit Request' }).click();
  await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
});

test('guest create consultation request: invalid data', async ({ page }) => {
  await page.goto('http://localhost:5173/homepage');
  await page.getByRole('textbox', { name: 'John Doe' }).click();
  await page.getByRole('textbox', { name: 'John Doe' }).fill('Lilith');
  await page.getByRole('textbox', { name: '09xx xxx xxx' }).click();
  await page.getByRole('textbox', { name: '09xx xxx xxx' }).fill('0123456789');
  await page.getByRole('textbox', { name: 'email@example.com' }).click();
  await page.getByRole('textbox', { name: 'email@example.com' }).fill('lilith@gmail');
  await page.getByRole('combobox').selectOption('IELTS Masterclass');
  await page.getByRole('textbox', { name: 'Any specific requirements?' }).click();
  await page.getByRole('textbox', { name: 'Any specific requirements?' }).fill('I need help');
  await page.getByRole('button', { name: 'Submit Request' }).click();
  await expect(page.getByRole('heading', { name: 'Error' })).toBeVisible();
});
