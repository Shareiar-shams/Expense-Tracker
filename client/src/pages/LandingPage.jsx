import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    if (user) navigate('/dashboard');
    else navigate('/login');
  };

  const PRIMARY = "bg-indigo-600 text-white";
  const PRIMARY_HOVER = "hover:bg-indigo-700";

  const features = [
    {
      icon: '📊',
      title: 'Visual Analytics',
      description: 'Understand your spending with simple charts and insights.',
    },
    {
      icon: '💰',
      title: 'Track Transactions',
      description: 'Keep all your income and expenses organized in one place.',
    },
    {
      icon: '📁',
      title: 'Smart Categories',
      description: 'Group transactions using customizable categories.',
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Use the platform from any device, smoothly and easily.',
    },
    {
      icon: '🔒',
      title: 'Secure Data',
      description: 'Your financial data is protected with modern encryption.',
    },
    {
      icon: '⚡',
      title: 'Fast Experience',
      description: 'A clean and fast interface for everyday use.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Users' },
    { number: '50K+', label: 'Transactions' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center">
              ET
            </div>
            <span className="font-bold text-lg">
              {process.env.REACT_APP_APP_NAME || 'Expense Tracker'}
            </span>
          </div>

          <div>
            {user ? (
              <button
                onClick={handleLoginRedirect}
                className={`${PRIMARY} ${PRIMARY_HOVER} px-5 py-2 rounded-lg font-medium`}
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={`${PRIMARY} ${PRIMARY_HOVER} px-5 py-2 rounded-lg font-medium`}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        
        {/* Subtle Background Shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300 opacity-20 rounded-full blur-2xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Manage Your Money  
            <span className="text-indigo-600"> With Confidence</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            A clean and simple way to track your daily expenses, organize categories, and stay in control of your financial life.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleLoginRedirect}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
            >
              {user ? 'Go to Dashboard' : 'Start Now'}
            </button>

            {!user && (
              <button
                onClick={() => navigate('/register')}
                className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Create Account
              </button>
            )}
          </div>

          {/* Illustration / Soft Card */}
          <div className="mt-14 mx-auto max-w-3xl bg-white shadow-md rounded-xl p-6 relative z-10">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-indigo-600">💳</p>
                <p className="font-semibold mt-2">Track</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">📁</p>
                <p className="font-semibold mt-2">Organize</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">📊</p>
                <p className="font-semibold mt-2">Visualize</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Stats */}
      <section className="py-12 bg-white border-t border-b">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 text-center gap-6">
          {stats.map((stat, i) => (
            <div key={i}>
              <h3 className="text-3xl font-bold text-indigo-600">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-100 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Expense Tracker</p>
        <p>Built to help you manage your financial life</p>
      </footer>
    </div>
  );
}
