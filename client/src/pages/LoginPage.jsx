import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormWrapper from '../components/FormWrapper';
import FormInput from '../components/FormInput';
import { handleLoginSubmit } from '../utils/loginUtils';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationErrors({});

    const result = await handleLoginSubmit(e, email, password, { login, navigate });

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

      <FormInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={validationErrors.password}
        required
      />
    </FormWrapper>
  );
}
