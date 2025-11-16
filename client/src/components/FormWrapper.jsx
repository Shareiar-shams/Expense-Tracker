import React from 'react';

const FormWrapper = ({ 
  title, 
  subtitle, 
  children, 
  onSubmit, 
  submitButtonText, 
  isLoading, 
  error, 
  footerLink 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {title}
          </h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          {children}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : submitButtonText}
          </button>
        </form>

        {/* Footer Link */}
        {footerLink && (
          <p className="mt-5 text-center text-gray-600 text-sm">
            {footerLink.text}
            <button
              onClick={footerLink.onClick}
              className="text-blue-600 hover:underline font-medium ml-1"
            >
              {footerLink.linkText}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default FormWrapper;