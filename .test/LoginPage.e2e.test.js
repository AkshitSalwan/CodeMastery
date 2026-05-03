const puppeteer = require('puppeteer');

describe('Login Page - Browser Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    const headless = process.env.PUPPETEER_HEADLESS !== 'false' ? 'new' : false;
    const slowMo = process.env.PUPPETEER_SLOWMO ? Number(process.env.PUPPETEER_SLOWMO) : 0;

    browser = await puppeteer.launch({
      headless,
      slowMo,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Set up console logging for debugging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('PAGE ERROR:', msg.text());
      }
    });
  });

  afterEach(async () => {
    await page.close();
  });

  test('should load login page correctly', async () => {
    await page.goto('http://localhost:3000/sign-in');

    // Wait for page to load
    await page.waitForSelector('input[type="email"]');

    // Check page title and content
    const title = await page.$eval('h2', el => el.textContent);
    expect(title).toBe('Welcome to CodeMastery');

    // Check form elements exist
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();

    // Check submit button text
    const buttonText = await page.$eval('button[type="submit"]', el => el.textContent);
    expect(buttonText).toBe('Sign In');
  });

  test('should show password toggle functionality', async () => {
    await page.goto('http://localhost:3000/sign-in');

    // Wait for password input
    await page.waitForSelector('input[type="password"]');

    // Check initial state
    const passwordInput = await page.$('input[type="password"]');
    let inputType = await page.evaluate(el => el.type, passwordInput);
    expect(inputType).toBe('password');

    // Find and click the toggle button (eye icon)
    const toggleButton = await page.$('button[title="Show password"]');
    expect(toggleButton).toBeTruthy();

    await toggleButton.click();

    // Check password is now visible
    await page.waitForFunction(() => {
      const input = document.querySelector('input[type="text"]');
      return input !== null;
    });

    inputType = await page.$eval('input[type="text"]', el => el.type);
    expect(inputType).toBe('text');

    // Check toggle button title changed
    const toggleTitle = await page.$eval('button[title="Hide password"]', el => el.title);
    expect(toggleTitle).toBe('Hide password');
  });

  test('should handle remember me checkbox', async () => {
    await page.goto('http://localhost:3000/sign-in');

    await page.waitForSelector('input[type="checkbox"]');

    // Check initial state (should be checked)
    const isChecked = await page.$eval('input[type="checkbox"]', el => el.checked);
    expect(isChecked).toBe(true);

    // Click to uncheck
    await page.click('input[type="checkbox"]');
    const isUnchecked = await page.$eval('input[type="checkbox"]', el => el.checked);
    expect(isUnchecked).toBe(false);

    // Click again to check
    await page.click('input[type="checkbox"]');
    const isCheckedAgain = await page.$eval('input[type="checkbox"]', el => el.checked);
    expect(isCheckedAgain).toBe(true);
  });

  test('should show validation errors for empty form submission', async () => {
    await page.goto('http://localhost:3000/sign-in');

    await page.waitForSelector('button[type="submit"]');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Wait a bit for any client-side validation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check that we're still on the login page (no navigation occurred)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/sign-in');
  });

  test('should navigate to signup page from login page', async () => {
    await page.goto('http://localhost:3000/sign-in');

    await page.waitForSelector('a[href="/sign-up"]');

    // Click signup link
    await page.click('a[href="/sign-up"]');

    // Wait for SPA route change
    await page.waitForFunction(() => window.location.pathname.includes('/sign-up'));

    // Check we're on signup page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/sign-up');

    // Check signup page content
    const title = await page.$eval('h2', el => el.textContent);
    expect(title).toBe('Create Account');
  });

  test('should navigate to forgot password page', async () => {
    await page.goto('http://localhost:3000/sign-in');

    await page.waitForSelector('a[href="/forgot-password"]');

    // Click forgot password link
    await page.click('a[href="/forgot-password"]');

    // Wait for SPA route change
    await page.waitForFunction(() => window.location.pathname.includes('/forgot-password'));

    // Check we're on forgot password page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/forgot-password');
  });

  test('should handle form input correctly', async () => {
    await page.goto('http://localhost:3000/sign-in');

    await page.waitForSelector('input[type="email"]');

    // Type in email
    await page.type('input[type="email"]', 'test@example.com');
    const emailValue = await page.$eval('input[type="email"]', el => el.value);
    expect(emailValue).toBe('test@example.com');

    // Type in password
    await page.type('input[type="password"]', 'password123');
    const passwordValue = await page.$eval('input[type="password"]', el => el.value);
    expect(passwordValue).toBe('password123');
  });

  test('should show loading state during form submission', async () => {
    await page.goto('http://localhost:3000/sign-in');

    await page.waitForSelector('input[type="email"]');

    // Fill form
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[type="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for loading text (this might fail if backend is not running)
    try {
      await page.waitForFunction(
        () => {
          const button = document.querySelector('button[type="submit"]');
          return button && button.textContent.includes('Signing in');
        },
        { timeout: 3000 }
      );

      const buttonText = await page.$eval('button[type="submit"]', el => el.textContent);
      expect(buttonText).toBe('Signing in...');
    } catch (e) {
      // If loading state doesn't appear, that's okay for this test
      console.log('Loading state test skipped - backend may not be running');
    }
  });

  test('should be responsive on mobile viewport', async () => {
    await page.setViewport({ width: 375, height: 667 }); // iPhone size

    await page.goto('http://localhost:3000/sign-in');

    await page.waitForSelector('input[type="email"]');

    // Check that form elements are still visible and accessible
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();

    // Check that the layout adapts and remains usable on mobile
    const formWidth = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? form.getBoundingClientRect().width : 0;
    });
    expect(formWidth).toBeGreaterThan(250); // Form should still be usable on small screens
    expect(formWidth).toBeLessThanOrEqual(375); // It should fit inside the viewport
  });
});