import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../components/FormWrapper';
import FormInput from '../components/FormInput';
import { handleRegistrationSubmit } from '../utils/registerUtils';

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    if (field === 'password') {
      setShowPasswordHint(value.length > 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setIsLoading(true);

    const result = await handleRegistrationSubmit(e, form, { login, navigate });

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
    <FormWrapper
      title={process.env.REACT_APP_APP_NAME || 'Expense Tracker'}
      subtitle="Create a new account"
      onSubmit={handleSubmit}
      submitButtonText="Sign Up"
      isLoading={isLoading}
      error={error}
      footerLink={{
        text: 'Already have an account?',
        linkText: 'Sign In',
        onClick: () => navigate('/login')
      }}
    >
      <FormInput
        label="User Name"
        type="text"
        placeholder="Enter your username"
        value={form.username}
        onChange={(e) => handleChange('username', e.target.value)}
        error={validationErrors.username}
        required
      />

      <FormInput
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={validationErrors.email}
        required
      />

      <div>
        <FormInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
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
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={form.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={validationErrors.confirmPassword}
        showPasswordToggle={true}
        required
      />
    </FormWrapper>
  );
}
