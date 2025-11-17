import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../components/FormWrapper';
import FormInput from '../components/FormInput';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { handleLoginSubmit } from '../utils/loginUtils';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  // Load saved credentials on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationErrors({});

    const result = await handleLoginSubmit(e, email, password, { login, navigate });

    if (result.success) {
      // Save or clear credentials based on remember me checkbox
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
    }

    if (!result.success) {
      if (result.errors) {
        setValidationErrors(result.errors);
      } else if (result.apiError) {
        setError(result.apiError);
      }
    }
    setIsLoading(false);
  };

  return (
  <>
    <FormWrapper
      title={process.env.REACT_APP_APP_NAME || 'Expense Tracker'}
      subtitle="Sign in to your account"
      onSubmit={handleSubmit}
      submitButtonText="Sign In"
      isLoading={isLoading}
      error={error}
      footerLink={{
        text: "Don't have an account?",
        linkText: "Sign up",
        onClick: () => navigate('/register')
      }}
    >
      <FormInput
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={validationErrors.email}
        required
      />
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>

        <button
          type="button"
          onClick={() => setShowForgotPasswordModal(true)}
          className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none"
        >
          Forgot password?
        </button>
      </div>
      <FormInput
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={validationErrors.password}
        showPasswordToggle={true}
        required
      />

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
          Remember me
        </label>
      </div>

    </FormWrapper>

    <ForgotPasswordModal
      isOpen={showForgotPasswordModal}
      onClose={() => setShowForgotPasswordModal(false)}
      onBackToLogin={() => setShowForgotPasswordModal(false)}
    />
    </>
  );

}
