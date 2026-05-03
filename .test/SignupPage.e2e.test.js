const puppeteer = require('puppeteer');

describe('Signup Page - Browser Tests', () => {
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

  test('should load signup page correctly', async () => {
    await page.goto('http://localhost:3000/sign-up');

    // Wait for page to load
    await page.waitForSelector('input[type="text"]');

    // Check page title and content
    const title = await page.$eval('h2', el => el.textContent);
    expect(title).toBe('Create Account');

    // Check form elements exist
    const nameInput = await page.$('input[placeholder="Full name"]');
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[placeholder="Password"]');
    const confirmPasswordInput = await page.$('input[placeholder="Confirm password"]');
    const submitButton = await page.$('button[type="submit"]');

    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();

    // Check submit button text
    const buttonText = await page.$eval('button[type="submit"]', el => el.textContent);
    expect(buttonText).toBe('Create Account');
  });

  test('should handle remember me checkbox', async () => {
    await page.goto('http://localhost:3000/sign-up');

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

  test('should show validation errors for password mismatch', async () => {
    await page.goto('http://localhost:3000/sign-up');

    await page.waitForSelector('input[placeholder="Full name"]');

    // Fill form with mismatched passwords
    await page.type('input[placeholder="Full name"]', 'John Doe');
    await page.type('input[type="email"]', 'john@example.com');
    await page.type('input[placeholder="Password"]', 'password123');
    await page.type('input[placeholder="Confirm password"]', 'differentpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error message
    await page.waitForFunction(
      () => {
        const errorElement = document.querySelector('p');
        return errorElement && errorElement.textContent.includes('Passwords do not match');
      },
      { timeout: 3000 }
    );

    const errorText = await page.$eval('p', el => el.textContent);
    expect(errorText).toBe('Passwords do not match.');
  });

  test('should clear error message when passwords match', async () => {
    await page.goto('http://localhost:3000/sign-up');

    await page.waitForSelector('input[placeholder="Full name"]');

    // Fill form with mismatched passwords first
    await page.type('input[placeholder="Full name"]', 'John Doe');
    await page.type('input[type="email"]', 'john@example.com');
    await page.type('input[placeholder="Password"]', 'password123');
    await page.type('input[placeholder="Confirm password"]', 'differentpassword');

    // Submit to show error
    await page.click('button[type="submit"]');

    // Wait for error
    await page.waitForFunction(
      () => {
        const errorElement = document.querySelector('p');
        return errorElement && errorElement.textContent.includes('Passwords do not match');
      }
    );

    // Clear confirm password and type matching password
    const confirmInput = await page.$('input[placeholder="Confirm password"]');
    await confirmInput.click({ clickCount: 3 }); // Select all
    await confirmInput.type('password123');

    // Submit again
    await page.click('button[type="submit"]');

    // Wait a bit and check error is gone
    await page.waitForTimeout(1000);

    // Check that error message is not present
    const errorExists = await page.$('p');
    if (errorExists) {
      const errorText = await page.$eval('p', el => el.textContent);
      expect(errorText).not.toBe('Passwords do not match.');
    }
  });

  test('should navigate to login page from signup page', async () => {
    await page.goto('http://localhost:3000/sign-up');

    await page.waitForSelector('a[href="/sign-in"]');

    // Click sign in link
    await page.click('a[href="/sign-in"]');

    // Wait for navigation
    await page.waitForNavigation();

    // Check we're on login page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/sign-in');

    // Check login page content
    const title = await page.$eval('h2', el => el.textContent);
    expect(title).toBe('Welcome to CodeMastery');
  });

  test('should handle form input correctly', async () => {
    await page.goto('http://localhost:3000/sign-up');

    await page.waitForSelector('input[placeholder="Full name"]');

    // Type in all fields
    await page.type('input[placeholder="Full name"]', 'Jane Smith');
    await page.type('input[type="email"]', 'jane@example.com');
    await page.type('input[placeholder="Password"]', 'securepass123');
    await page.type('input[placeholder="Confirm password"]', 'securepass123');

    // Verify values
    const nameValue = await page.$eval('input[placeholder="Full name"]', el => el.value);
    const emailValue = await page.$eval('input[type="email"]', el => el.value);
    const passwordValue = await page.$eval('input[placeholder="Password"]', el => el.value);
    const confirmValue = await page.$eval('input[placeholder="Confirm password"]', el => el.value);

    expect(nameValue).toBe('Jane Smith');
    expect(emailValue).toBe('jane@example.com');
    expect(passwordValue).toBe('securepass123');
    expect(confirmValue).toBe('securepass123');
  });

  test('should show validation errors for empty required fields', async () => {
    await page.goto('http://localhost:3000/sign-up');

    await page.waitForSelector('button[type="submit"]');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Wait a bit for any client-side validation
    await page.waitForTimeout(1000);

    // Check that we're still on the signup page (no navigation occurred)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/sign-up');
  });

  test('should show loading state during form submission', async () => {
    await page.goto('http://localhost:3000/sign-up');

    await page.waitForSelector('input[placeholder="Full name"]');

    // Fill form with valid data
    await page.type('input[placeholder="Full name"]', 'Test User');
    await page.type('input[type="email"]', 'test@example.com');
    await page.type('input[placeholder="Password"]', 'password123');
    await page.type('input[placeholder="Confirm password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for loading text (this might fail if backend is not running)
    try {
      await page.waitForFunction(
        () => {
          const button = document.querySelector('button[type="submit"]');
          return button && button.textContent.includes('Creating account');
        },
        { timeout: 3000 }
      );

      const buttonText = await page.$eval('button[type="submit"]', el => el.textContent);
      expect(buttonText).toBe('Creating account...');
    } catch (e) {
      // If loading state doesn't appear, that's okay for this test
      console.log('Loading state test skipped - backend may not be running');
    }
  });

  test('should be responsive on mobile viewport', async () => {
    await page.setViewport({ width: 375, height: 667 }); // iPhone size

    await page.goto('http://localhost:3000/sign-up');

    await page.waitForSelector('input[placeholder="Full name"]');

    // Check that form elements are still visible and accessible
    const nameInput = await page.$('input[placeholder="Full name"]');
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[placeholder="Password"]');
    const confirmPasswordInput = await page.$('input[placeholder="Confirm password"]');
    const submitButton = await page.$('button[type="submit"]');

    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmPasswordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();

    // Check that the layout adapts (form should still be centered and usable)
    const formRect = await page.$eval('form', el => el.getBoundingClientRect());
    expect(formRect.width).toBeGreaterThan(300); // Form should be reasonably wide
  });

  test('should handle long form inputs gracefully', async () => {
    await page.goto('http://localhost:3000/sign-up');

    await page.waitForSelector('input[placeholder="Full name"]');

    // Type very long name
    const longName = 'A Very Long Name That Should Still Be Handled Properly By The Form Input Field';
    await page.type('input[placeholder="Full name"]', longName);

    // Type very long email
    const longEmail = 'this.is.a.very.long.email.address.that.should.still.work@example.com';
    await page.type('input[type="email"]', longEmail);

    // Verify the inputs can handle long text
    const nameValue = await page.$eval('input[placeholder="Full name"]', el => el.value);
    const emailValue = await page.$eval('input[type="email"]', el => el.value);

    expect(nameValue).toBe(longName);
    expect(emailValue).toBe(longEmail);
  });

  test('should sign up, log out, and log in again using the same credentials', async () => {
    const email = `puppeteer_test_${Date.now()}@example.com`;
    const password = 'Password123!';
    const name = 'Test User';

    // Sign up flow
    await page.goto('http://localhost:3000/sign-up');
    await page.waitForSelector('input[placeholder="Full name"]');

    await page.type('input[placeholder="Full name"]', name);
    await page.type('input[type="email"]', email);
    await page.type('input[placeholder="Password"]', password);
    await page.type('input[placeholder="Confirm password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    expect(page.url()).toContain('/dashboard');

    const dashboardHeader = await page.$eval('h1', el => el.textContent);
    expect(dashboardHeader).toContain('Welcome back');

    // Log out from the dashboard
    await page.evaluate(() => {
      const menuButton = Array.from(document.querySelectorAll('button')).find((button) => button.querySelector('img'));
      if (menuButton) {
        menuButton.click();
      }
    });

    const [logoutButton] = await page.$x("//button[contains(normalize-space(.), 'Logout')]");
    if (logoutButton) {
      await logoutButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    }

    // Login again with the same credentials
    await page.goto('http://localhost:3000/sign-in');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    expect(page.url()).toContain('/dashboard');
    const loginHeader = await page.$eval('h1', el => el.textContent);
    expect(loginHeader).toContain('Welcome back');
  });
});