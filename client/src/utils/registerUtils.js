export const getPasswordErrors = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Cleaned regex - no eslint warnings
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
};

export const validateRegistrationForm = (formData) => {
  const errors = {};
  const { username, email, password, confirmPassword } = formData;

  if (!username?.trim()) {
    errors.username = 'Username is required';
  }

  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please enter a valid email';
  }

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

  return errors;
};

export const handleRegistrationSubmit = async (e, formData, { login, navigate }) => {
  e.preventDefault();

  const errors = validateRegistrationForm(formData);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const { default: axios } = await import('../services/api');
    const res = await axios.post('/auth/register', {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    login(res.data.token, res.data.user);
    navigate('/dashboard');
    return { success: true };
  } catch (err) {
    return {
      success: false,
      apiError: err.response?.data?.message || 'Registration failed. Please try again.'
    };
  }
};
