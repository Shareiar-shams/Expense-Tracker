// Login validation and submission utilities

export const validateLoginForm = (email, password) => {
    const errors = {};
    
    if (!email.trim()) {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
        errors.password = 'Password is required';
    }
    
    return errors;
};

export const handleLoginSubmit = async (e, email, password, { login, navigate }) => {
    e.preventDefault();
    
    const errors = validateLoginForm(email, password);
    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }
    
    try {
        const { default: axios } = await import('../services/api');
        const res = await axios.post('/auth/login', { email, password });
        login(res.data.token, res.data.user);
        navigate('/dashboard');
        return { success: true };
    } catch (err) {
        return {
        success: false,
        apiError: err.response?.data?.message || 'Login failed. Please check your credentials.'
        };
    }
};