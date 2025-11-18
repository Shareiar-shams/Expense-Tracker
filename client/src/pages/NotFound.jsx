import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

const NotFound = function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's a previous page to go back to
  const canGoBack = window.history.length > 1;

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(-1); // Go back one page in history
    } else {
      navigate('/'); // Fallback to home page
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="h-full w-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.057-2.333M15.352 5.544A7.962 7.962 0 0012 3c-2.34 0-4.467.881-6.057 2.333M16.343 11.906a7.962 7.962 0 001.314-2.906m.257-3.457a7.962 7.962 0 01-.571-2.906m.572 3.457A7.962 7.962 0 0018.5 12c0-2.34-.881-4.467-2.333-6.057"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Page Not Found</h2>
            <p className="text-gray-500 text-base">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            {/* Go Back Button */}
            {canGoBack && (
              <button
                onClick={handleGoBack}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Previous Page
              </button>
            )}

            {/* Home Button - Always visible */}
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Go to Homepage
            </Link>

            {/* Dashboard Button - If user appears to be logged in */}
            <Link
              to="/dashboard"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Go to Dashboard
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              If you believe this is a mistake, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
