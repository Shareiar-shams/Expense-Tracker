import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Password Validation
  const getPasswordErrors = (password) => {
    const errors = [];

    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(password))
      errors.push("One special character");

    return errors;
  };

  // Handle Field Update
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });

    if (field === "password") {
      setShowPasswordHint(value.length > 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});
    setIsLoading(true);

    const errors = {};

    // Username
    if (!form.username.trim()) {
      errors.username = "Username is required";
    }

    // Email
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Enter a valid email";
    }

    // Password
    const passwordErrors = getPasswordErrors(form.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors.join(". ");
    }

    // Confirm Password
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {process.env.REACT_APP_APP_NAME || "Expense Tracker"}
          </h1>
          <p className="text-gray-600">Create a new account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium">User Name</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                validationErrors.username
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {validationErrors.username && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                validationErrors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                validationErrors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />

            {/* Password Hint (Shows when typing) */}
            {showPasswordHint && !validationErrors.password && (
              <p className="text-gray-500 text-xs mt-1">
                Password must contain uppercase, lowercase, number & special
                character.
              </p>
            )}

            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
                validationErrors.confirmPassword
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* API Error */}
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Sign In */}
        <p className="mt-5 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
