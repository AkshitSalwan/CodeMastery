import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupPage } from '../src/pages/SignupPage';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

// Mock the AuthContext
const mockSignup = jest.fn();
jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    signup: mockSignup,
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

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form correctly', () => {
    render(<SignupPage />);

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('allows user to fill all form fields', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Full name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  test('handles remember me checkbox', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    const checkbox = screen.getByRole('checkbox', { name: /keep me signed in/i });

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
    mockSignup.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 10)));

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Full name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    // Check that loading text appears
    expect(submitButton).toHaveTextContent('Creating account...');

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        rememberMe: true,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Full name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });

    expect(mockSignup).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('displays error message on signup failure', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Email already exists';
    mockSignup.mockRejectedValueOnce(new Error(errorMessage));

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Full name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'existing@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockSignup).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123',
      rememberMe: true,
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('prevents form submission when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.click(submitButton);

    expect(mockSignup).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('disables submit button during submission', async () => {
    const user = userEvent.setup();
    mockSignup.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Full name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Creating account...');

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
    });
  });

  test('clears error message on successful retry after password mismatch', async () => {
    const user = userEvent.setup();
    mockSignup.mockResolvedValueOnce();

    render(<SignupPage />);

    const nameInput = screen.getByPlaceholderText('Full name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    // First attempt with mismatched passwords
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'different');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });

    // Clear and retry with matching passwords
    await user.clear(confirmPasswordInput);
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Passwords do not match.')).not.toBeInTheDocument();
      expect(mockSignup).toHaveBeenCalled();
    });
  });
});