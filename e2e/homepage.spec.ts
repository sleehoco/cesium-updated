import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /CesiumCyber/i })).toBeVisible();

    // Check for CTA buttons
    await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Our Services/i })).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/CesiumCyber/);

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /Protect your digital assets/);
  });

  test('should display service cards', async ({ page }) => {
    await page.goto('/');

    // Check for service features
    await expect(page.getByText(/Penetration Testing/i)).toBeVisible();
    await expect(page.getByText(/Security Assessment/i)).toBeVisible();
    await expect(page.getByText(/Threat Monitoring/i)).toBeVisible();
    await expect(page.getByText(/Incident Response/i)).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /CesiumCyber/i })).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: /CesiumCyber/i })).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: /CesiumCyber/i })).toBeVisible();
  });
});
