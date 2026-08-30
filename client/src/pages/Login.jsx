import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    setLocalError('');
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setLoading(false);
    } else {
      setLocalError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🚀 SupportFlow</h1>
          <p>Sign in to your account</p>
        </div>

        {(localError || error) && (
          <div className="auth-error">
            ⚠️ {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>

        <div className="auth-demo">
          <p>🔑 Demo Credentials</p>
          <div className="demo-credentials">
            <div className="demo-box">
              <span className="demo-role">👤 Customer</span>
              <span className="demo-email">customer@example.com</span>
              <span className="demo-password">password123</span>
            </div>
            <div className="demo-box">
              <span className="demo-role">🛠️ Agent</span>
              <span className="demo-email">agent@example.com</span>
              <span className="demo-password">password123</span>
            </div>
          </div>
          <p className="demo-note">* Register first if demo accounts don't exist</p>
        </div>
      </div>
    </div>
  );
};

export default Login;