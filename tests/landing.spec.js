// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const PAGE_URL = `file://${path.resolve(__dirname, '..', 'index.html')}`;
const SCREENSHOTS_DIR = path.resolve(__dirname, 'screenshots');

test.describe('Vibes Landing Page', () => {
  test.describe.configure({ mode: 'serial' });

  /** @type {import('@playwright/test').Page} */
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ── 1. SEO meta tags ──
  test('SEO meta tags exist', async () => {
    // Open Graph
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:locale"]')).toHaveCount(1);

    // Twitter Card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);

    // Robots & Canonical
    await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

    // Favicon & Apple Touch Icon
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);

    // Theme Color
    await expect(page.locator('meta[name="theme-color"]')).toHaveCount(1);
  });

  // ── 2. JSON-LD validity ──
  test('JSON-LD has valid Organization schema', async () => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toBeTruthy();

    const data = JSON.parse(jsonLd);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Organization');
    expect(data.name).toBe('Vibes');
    expect(data.url).toBe('https://usevibes.app');
  });

  // ── 3. Responsive screenshots ──
  const viewports = [
    { width: 640, height: 900, label: 'sm-640' },
    { width: 768, height: 900, label: 'md-768' },
    { width: 1024, height: 900, label: 'lg-1024' },
    { width: 1440, height: 900, label: 'xl-1440' },
  ];

  for (const vp of viewports) {
    test(`Responsive screenshot at ${vp.width}px`, async () => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      // 뷰포트 변경 후 레이아웃 안정화 대기
      await page.waitForTimeout(300);
      await page.screenshot({
        fullPage: true,
        path: path.join(SCREENSHOTS_DIR, `landing-${vp.label}.png`),
      });
    });
  }

  // ── 4. Form validation ──
  test('Form validation: empty email shows error', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // waitlist 섹션으로 스크롤
    await page.locator('#waitlist').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // 빈 상태로 제출
    await page.locator('#submitBtn').click();

    // 에러 메시지가 보여야 함
    const emailError = page.locator('#emailError');
    await expect(emailError).toBeVisible();
  });

  test('Form validation: valid email hides error', async () => {
    const emailInput = page.locator('#inputEmail');
    const emailError = page.locator('#emailError');

    // 유효한 이메일 입력 -> input 이벤트로 에러 숨김
    await emailInput.fill('test@example.com');

    await expect(emailError).toBeHidden();
  });

  // ── 5. Skip navigation ──
  test('Skip link element exists', async () => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  // ── 6. Scroll trigger: .rv elements exist ──
  test('.rv elements exist for scroll-triggered reveal', async () => {
    const rvElements = page.locator('.rv');
    const count = await rvElements.count();
    expect(count).toBeGreaterThan(0);

    // hero 영역의 .rv 요소들은 이미 .vis 클래스가 추가되어야 함
    // (hero는 페이지 로드 시 자동으로 reveal)
    const heroVisElements = page.locator('.hero .rv.vis');
    const heroVisCount = await heroVisElements.count();
    expect(heroVisCount).toBeGreaterThan(0);
  });
});
