# PUPPETEER COMMAND
$env:PUPPETEER_HEADLESS='false'; npm run test:e2e:login
# Jest Testing Setup for CodeMastery

This directory contains comprehensive Jest tests for the CodeMastery application's login and signup functionality, including both unit tests and end-to-end browser tests.

## 📋 Overview

The testing suite includes:
- **Unit Tests**: 17 Jest + React Testing Library tests
- **E2E Tests**: 19 Puppeteer browser-based tests
- **LoginPage**: 8 unit tests + 9 e2e tests
- **SignupPage**: 9 unit tests + 10 e2e tests
- **Total**: 36 passing tests

## 🛠️ Setup & Configuration

### Prerequisites
- Node.js (v16+)
- npm or yarn
- CodeMastery project dependencies installed
- Running development server (for e2e tests)

### Installed Dependencies
```json
{
  "jest": "^30.3.0",
  "@testing-library/react": "^latest",
  "@testing-library/jest-dom": "^latest",
  "@testing-library/user-event": "^latest",
  "jsdom": "^latest",
  "babel-jest": "^latest",
  "@babel/core": "^latest",
  "@babel/preset-env": "^latest",
  "@babel/preset-react": "^latest",
  "jest-environment-jsdom": "^latest",
  "identity-obj-proxy": "^latest",
  "jest-transform-stub": "^latest",
  "puppeteer": "^latest",
  "jest-puppeteer": "^latest"
}
```

## 🛠️ Setup & Configuration

### Prerequisites
- Node.js (v16+)
- npm or yarn
- CodeMastery project dependencies installed

### Installed Dependencies
```json
{
  "jest": "^30.3.0",
  "@testing-library/react": "^latest",
  "@testing-library/jest-dom": "^latest",
  "@testing-library/user-event": "^latest",
  "jsdom": "^latest",
  "babel-jest": "^latest",
  "@babel/core": "^latest",
  "@babel/preset-env": "^latest",
  "@babel/preset-react": "^latest",
  "jest-environment-jsdom": "^latest",
  "identity-obj-proxy": "^latest",
  "jest-transform-stub": "^latest"
}
```

### Configuration Files

#### `jest.config.js` (Root)
```javascript
export default {
  preset: null,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': 'jest-transform-stub',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|@babel)/)',
  ],
  extensionsToTreatAsEsm: ['.jsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testMatch: [
    '**/.test/**/*.test.js',
  ],
};
```

#### `jest-puppeteer.config.cjs` (Root)
```javascript
module.exports = {
  launch: {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  browserContext: 'default'
};
```

#### `jest.setup.js` (Root)
```javascript
import '@testing-library/jest-dom';

// Mock import.meta
global.import = {
  meta: {
    env: {
      VITE_ADMIN_EMAILS: 'admin@example.com',
    },
  },
};
```

### Unit Test Configuration Details

#### Jest Configuration (`jest.config.js`)
- **Test Environment**: jsdom (simulated browser)
- **Test Pattern**: `.test/**/*.test.js` (excludes `.e2e.test.js`)
- **Transform**: Babel for JSX and ES modules
- **Module Mapping**: CSS and image imports mocked
- **Setup**: Custom setup file for additional configuration

#### Prerequisites for Unit Tests
- Node.js installed
- All dependencies installed (`npm install`)
- No external services required (fully mocked)

### E2E Test Configuration Details

#### Prerequisites for E2E Tests
- Development server must be running on `http://localhost:5173`
- Chrome browser installed
- Sufficient system resources for browser automation

#### Environment Variables for Tests
- `VITE_API_BASE_URL`: API endpoint for tests
- `VITE_APP_TITLE`: Application title for tests

#### Browser Configuration
- **Headless Mode**: `true` (runs without visible browser window)
- **Sandbox**: Disabled for compatibility
- **Browser Context**: Default (isolated sessions)

#### Files Used
- `jest.e2e.config.cjs` — Jest config for Puppeteer E2E tests
- `jest-puppeteer.config.cjs` — Puppeteer launch config for Jest Puppeteer preset

## 🧪 Testing Approach

### Unit Tests (Jest + React Testing Library)
- **Purpose**: Test individual components and logic in isolation
- **Environment**: jsdom (simulated browser environment)
- **Focus**: Component rendering, user interactions, state management
- **Speed**: Fast execution (~8 seconds for all tests)

### End-to-End Tests (Puppeteer)
- **Purpose**: Test complete user workflows in real browser
- **Environment**: Headless Chrome browser
- **Focus**: Page navigation, form submissions, cross-page flows
- **Speed**: Slower execution (~30-60 seconds) but more realistic

### Best Practices
- **Unit Tests**: Test component logic, user interactions, error states
- **E2E Tests**: Test critical user journeys, navigation, responsiveness
- **Mocking**: Use mocks for external dependencies (API calls, routing)
- **Isolation**: Each test should be independent and not rely on others
- **Timeouts**: Configure appropriate timeouts for async operations

## 🚀 Running Tests

### Run All Unit Tests
```bash
npm test
```

### Run End-to-End Tests
```bash
# Make sure dev server is running first
npm run dev:client

# Then run e2e tests in another terminal
npm run test:e2e
```

### Run E2E Tests with Visible Browser
```bash
# macOS / Linux
PUPPETEER_HEADLESS=false npm run test:e2e

# PowerShell
$env:PUPPETEER_HEADLESS='false'; npm run test:e2e

# Command Prompt
set PUPPETEER_HEADLESS=false&& npm run test:e2e
```

> No browser extension is required. Puppeteer uses its own Chromium instance.

### Run Specific Test Files
```bash
# Unit tests
npx jest .test/LoginPage.test.js
npx jest .test/SignupPage.test.js

# E2E tests
npm run test:e2e:login
npm run test:e2e:signup
```

### Run Tests with Custom Timeout
```bash
npm test -- --testTimeout=10000
```

### Run Tests with Verbose Output
```bash
npx jest .test/LoginPage.test.js --verbose
```

## 📁 Test Structure

```
.test/
├── LoginPage.test.js           # Login page unit tests
├── SignupPage.test.js          # Signup page unit tests
├── LoginPage.e2e.test.js       # Login page e2e tests (Puppeteer)
├── SignupPage.e2e.test.js      # Signup page e2e tests (Puppeteer)
└── README.md                   # This file
```

## 🧪 Test Coverage

### Unit Tests (Jest + React Testing Library)

#### LoginPage Tests (`LoginPage.test.js`)

1. **renders login form correctly**
   - Verifies all form elements are present
   - Checks welcome message and navigation links

2. **allows user to type in email and password fields**
   - Tests input field functionality
   - Verifies user input is captured correctly

3. **toggles password visibility**
   - Tests password show/hide functionality
   - Verifies input type changes correctly

4. **handles remember me checkbox**
   - Tests checkbox toggle functionality
   - Verifies default checked state

5. **submits form successfully and navigates to dashboard**
   - Tests successful login flow
   - Verifies API call and navigation
   - Checks loading state

6. **displays error message on login failure**
   - Tests error handling
   - Verifies error message display
   - Ensures navigation doesn't occur

7. **prevents form submission when fields are empty**
   - Tests form validation
   - Ensures API isn't called with empty data

8. **disables submit button during submission**
   - Tests loading state management
   - Verifies button disabled state

#### SignupPage Tests (`SignupPage.test.js`)

1. **renders signup form correctly**
   - Verifies all form elements are present
   - Checks create account message and navigation links

2. **allows user to fill all form fields**
   - Tests all input field functionality
   - Verifies user input capture

3. **handles remember me checkbox**
   - Tests checkbox toggle functionality
   - Verifies default checked state

4. **submits form successfully and navigates to dashboard**
   - Tests successful signup flow
   - Verifies API call and navigation
   - Checks loading state

5. **displays error when passwords do not match**
   - Tests password confirmation validation
   - Verifies error message display

6. **displays error message on signup failure**
   - Tests error handling
   - Verifies error message display
   - Ensures navigation doesn't occur

7. **prevents form submission when required fields are empty**
   - Tests form validation
   - Ensures API isn't called with empty data

8. **disables submit button during submission**
   - Tests loading state management
   - Verifies button disabled state

9. **clears error message on successful retry after password mismatch**
   - Tests error state clearing
   - Verifies form recovery after validation errors

### End-to-End Tests (Puppeteer)

#### LoginPage E2E Tests (`LoginPage.e2e.test.js`)

1. **should load login page correctly**
   - Tests page navigation and content loading
   - Verifies all form elements are present

2. **should show password toggle functionality**
   - Tests password visibility toggle in browser
   - Verifies real DOM interactions

3. **should handle remember me checkbox**
   - Tests checkbox interactions in browser
   - Verifies state changes

4. **should show validation errors for empty form submission**
   - Tests browser form validation
   - Verifies no navigation on invalid submission

5. **should navigate to signup page from login page**
   - Tests cross-page navigation
   - Verifies correct routing

6. **should navigate to forgot password page**
   - Tests additional navigation links
   - Verifies routing to other pages

7. **should handle form input correctly**
   - Tests real typing in browser inputs
   - Verifies input value capture

8. **should show loading state during form submission**
   - Tests async form submission in browser
   - Verifies loading indicators

9. **should be responsive on mobile viewport**
   - Tests mobile responsiveness
   - Verifies layout adaptation

#### SignupPage E2E Tests (`SignupPage.e2e.test.js`)

1. **should load signup page correctly**
   - Tests page navigation and content loading
   - Verifies all form elements are present

2. **should handle remember me checkbox**
   - Tests checkbox interactions in browser
   - Verifies state changes

3. **should show validation errors for password mismatch**
   - Tests client-side password validation
   - Verifies error message display

4. **should clear error message when passwords match**
   - Tests error state clearing
   - Verifies form recovery

5. **should navigate to login page from signup page**
   - Tests cross-page navigation
   - Verifies correct routing

6. **should handle form input correctly**
   - Tests real typing in browser inputs
   - Verifies input value capture

7. **should show validation errors for empty required fields**
   - Tests browser form validation
   - Verifies no navigation on invalid submission

8. **should show loading state during form submission**
   - Tests async form submission in browser
   - Verifies loading indicators

9. **should be responsive on mobile viewport**
   - Tests mobile responsiveness
   - Verifies layout adaptation

10. **should handle long form inputs gracefully**
    - Tests input field limits
    - Verifies long text handling

## 🔧 Mocking Strategy

### React Router
```javascript
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
}));
```

### AuthContext
```javascript
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    signup: mockSignup,
  }),
}));
```

### UI Components
```javascript
jest.mock('../src/components/Card', () => ({
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  // ... other components
}));
```

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot use 'import.meta' outside a module"**
   - Ensure `jest.setup.js` has the correct `import.meta` mock
   - Check that `transformIgnorePatterns` includes necessary modules

2. **"React is not defined"**
   - Add `import React from 'react';` to component files
   - Ensure Babel presets are correctly configured

3. **Tests hanging/timing out**
   - Use `--testTimeout` flag
   - Check for async operations without proper cleanup

4. **CSS/image imports failing**
   - Verify `moduleNameMapper` configuration
   - Ensure `identity-obj-proxy` and `jest-transform-stub` are installed

5. **E2E Tests: "Dev server not running"**
   - Start dev server with `npm run dev:client` before running e2e tests
   - Ensure server is accessible at `http://localhost:5173`

6. **E2E Tests: Browser launch failures**
   - Install Chrome browser
   - Check system resources (RAM, CPU)
   - Try running with `--no-sandbox` flag if needed

7. **E2E Tests: Element not found errors**
   - Verify page has fully loaded before interactions
   - Check selectors match actual DOM elements
   - Add appropriate wait conditions

### Debug Commands
```bash
# Run with verbose output
npm test -- --verbose

# Run specific test with debugging
npx jest .test/LoginPage.test.js --verbose

# Check Jest configuration
npx jest --showConfig

# Debug E2E tests (run with visible browser)
PUPPETEER_HEADLESS=false npm run test:e2e

# Run E2E tests with slow motion for debugging
PUPPETEER_SLOWMO=100 npm run test:e2e

# Check if dev server is running
curl http://localhost:5173
```

## 📊 Test Results

Current Status:
- **Unit Tests**: ✅ 17/17 tests passing
- **E2E Tests**: ✅ 19/19 tests passing (when dev server is running)
- **Total**: 36 tests

```
Unit Tests:
Test Suites: 2 passed, 2 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        ~12 s

E2E Tests (when dev server running):
Test Suites: 2 passed, 2 total
Tests:       19 passed, 19 total
Time:        ~30-60 s (includes browser startup)
```

**Note**: Unit tests and E2E tests run separately to avoid conflicts. Use `npm test` for unit tests and `npm run test:e2e` for E2E tests.

## 🎯 Best Practices Covered

- **Isolation**: Each test is independent with proper mocking
- **User-Centric**: Tests simulate real user interactions
- **Comprehensive**: Covers success, error, and edge cases
- **Maintainable**: Clear test structure and naming
- **Fast**: Optimized for quick feedback during development

## 📚 Learning Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🔄 Future Enhancements

- Add snapshot testing
- Implement integration tests
- Add accessibility testing
- Include performance testing
- Add visual regression testing

---

**Last Updated**: May 3, 2026
**Test Coverage**: Login & Signup Pages
**Framework**: Jest + React Testing Library</content>
<parameter name="filePath">d:\CodeMastery Github\CodeMastery\.test\README.md