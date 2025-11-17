import React, { useState } from 'react';
import FormInput from './FormInput';
import { forgotPassword } from '../utils/forgotPasswordUtils';

export default function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess('If an account with that email exists, a password reset link has been sent.');
      setEmailSent(true);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setEmail('');
    setError('');
    setSuccess('');
    setEmailSent(false);
  };

  const handleBackToLogin = () => {
    handleReset();
    onBackToLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl animate-fadeIn relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!emailSent ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Enter your email address and we’ll send you a secure link to reset your password.
            </p>

            {/* Input */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Email Address"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-5 text-center">
              <button
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-500 text-sm transition"
              >
                ← Back to Sign In
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleReset}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Try Another Email
              </button>

              <button
                onClick={handleBackToLogin}
                className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}