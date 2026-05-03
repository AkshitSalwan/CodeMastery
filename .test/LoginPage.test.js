import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../src/pages/LoginPage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

// Mock the AuthContext
const mockLogin = jest.fn();
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock the UI components
jest.mock('../src/components/Card', () => ({
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }) => <div className={className}>{children}</div>,
  CardTitle: ({ children, className }) => <h2 className={className}>{children}</h2>,
}));

jest.mock('../src/components/Button', () => ({
  Button: ({ children, className, ...props }) => <button className={className} {...props}>{children}</button>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(<LoginPage />);

    expect(screen.getByText('Welcome to CodeMastery')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('allows user to type in email and password fields', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByTitle('Show password');

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click to show password
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByTitle('Hide password')).toBeInTheDocument();

    // Click to hide again
    await user.click(screen.getByTitle('Hide password'));
    expect(passwordInput.type).toBe('password');
  });

  test('handles remember me checkbox', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const checkbox = screen.getByRole('checkbox', { name: /remember me/i });

    // Initially checked
    expect(checkbox.checked).toBe(true);

    // Uncheck
    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);

    // Check again
    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('submits form successfully and navigates to dashboard', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 10)));

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Check that loading text appears
    expect(submitButton).toHaveTextContent('Signing in...');

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error message on login failure', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrongpassword',
      rememberMe: true,
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('prevents form submission when fields are empty', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(submitButton);

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('disables submit button during submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Signing in...');

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});