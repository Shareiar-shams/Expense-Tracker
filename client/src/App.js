import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import TransactionPage from './pages/TransactionPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes - Redirect if already logged in */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <TransactionPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route (404) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
