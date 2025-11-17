import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormWrapper from '../components/FormWrapper';
import FormInput from '../components/FormInput';
import { resetPassword } from '../utils/forgotPasswordUtils';
import { getPasswordErrors } from '../utils/registerUtils';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (value) => {
    setPassword(value);
    setShowPasswordHint(value.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationErrors({});

    // Validate passwords
    const errors = {};
    
    if (!password) {
      errors.password = 'Password is required';
    } else {
      const passwordErrors = getPasswordErrors(password);
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors.join('. ');
      }
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    const result = await resetPassword(token, password);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Password reset successfully. Please sign in with your new password.' }
        });
      }, 3000);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Password Reset Successful</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been reset successfully.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting you to the login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <FormWrapper
          title={process.env.REACT_APP_APP_NAME || 'Expense Tracker'}
          subtitle="Reset your password"
          onSubmit={handleSubmit}
          submitButtonText="Reset Password"
          isLoading={isLoading}
          error={error}
          footerLink={{
            text: "Remember your password?",
            linkText: "Sign in",
            onClick: () => navigate('/login')
          }}
        >
          <div>
            <FormInput
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={validationErrors.password}
              showPasswordToggle={true}
              required
            />
            
            {/* Password Hint */}
            {showPasswordHint && !validationErrors.password && (
              <p className="text-gray-500 text-xs mt-1">
                Password must contain uppercase, lowercase, number & special character.
              </p>
            )}
          </div>

          <FormInput
            label="Confirm New Password"
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={validationErrors.confirmPassword}
            showPasswordToggle={true}
            required
          />
        </FormWrapper>
      </div>
    </div>
  );
}