import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(
      page.getByRole('heading', { name: /Cybersecurity That Speaks Your Language/i })
    ).toBeVisible();

    // Check for CTA buttons
    await expect(
      page.getByRole('link', { name: /Get Your Free Risk Score/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /See How We Protect Local Businesses/i })
    ).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/CesiumCyber/);

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      /Expert cybersecurity and compliance services for Maryland businesses/
    );
  });

  test('should display industry cards section', async ({ page }) => {
    await page.goto('/');

    // Check industry section heading
    await expect(
      page.getByRole('heading', { name: /We Protect Businesses Like Yours/i })
    ).toBeVisible();

    // Check for all 5 industry cards
    await expect(page.getByText(/Healthcare/i)).toBeVisible();
    await expect(page.getByText(/Manufacturing/i)).toBeVisible();
    await expect(page.getByText(/Legal/i)).toBeVisible();
    await expect(page.getByText(/Financial Services/i)).toBeVisible();
    await expect(page.getByText(/Retail & Consumer/i)).toBeVisible();
  });

  test('should display services section', async ({ page }) => {
    await page.goto('/');

    // Check services section heading
    await expect(
      page.getByRole('heading', { name: /Comprehensive Security Solutions/i })
    ).toBeVisible();

    // Check for service cards
    await expect(page.getByText(/Security Assessment/i)).toBeVisible();
    await expect(page.getByText(/Compliance & Risk/i)).toBeVisible();
    await expect(page.getByText(/Penetration Testing/i)).toBeVisible();
  });

  test('should display social proof section', async ({ page }) => {
    await page.goto('/');

    // Check social proof heading
    await expect(
      page.getByRole('heading', { name: /Trusted by Maryland Businesses/i })
    ).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    const heading = /Cybersecurity That Speaks Your Language/i;

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  });
});

test.describe('Industry Pages', () => {
  const industries = [
    { slug: 'healthcare', name: 'Healthcare', badge: 'HIPAA' },
    { slug: 'manufacturing', name: 'Manufacturing', badge: 'CMMC' },
    { slug: 'legal', name: 'Legal', badge: 'ABA Ethics' },
    { slug: 'financial', name: 'Financial Services', badge: 'PCI-DSS' },
    { slug: 'retail', name: 'Retail', badge: 'PCI-DSS' },
  ];

  for (const industry of industries) {
    test(`${industry.name} page should load`, async ({ page }) => {
      await page.goto(`/industries/${industry.slug}`);
      // Check for industry name in heading
      await expect(
        page.getByRole('heading', { name: new RegExp(industry.name, 'i') })
      ).toBeVisible();
      // Check for compliance badge
      await expect(page.getByText(industry.badge)).toBeVisible();
      // Check for CTA button
      await expect(
        page.getByRole('link', { name: /schedule|start|get|book/i })
      ).toBeVisible();
    });
  }
});
