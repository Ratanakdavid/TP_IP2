import { test, expect } from '@playwright/test';

// Challenge 1 — Locked user
test('locked user cannot login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.locator('[data-test="error"]'))
    .toContainText('Sorry, this user has been locked out');
});

// Challenge 2 — Sorting products
test('sort products by price low to high', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await page.locator('.product_sort_container').selectOption('lohi');

  const prices = page.locator('.inventory_item_price');
  const firstPrice = await prices.first().textContent();
  const lastPrice = await prices.last().textContent();

  const first = parseFloat(firstPrice.replace('$', ''));
  const last = parseFloat(lastPrice.replace('$', ''));

  expect(first).toBeLessThanOrEqual(last);
});

// Challenge 3 — Logout
test('user can logout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await page.locator('#react-burger-menu-btn').click();
  await page.getByRole('link', { name: /logout/i }).click();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});