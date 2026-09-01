import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setLocalError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left Side - Brand */}
        <div className="auth-brand">
          <div className="auth-brand-top">
            <img src={logo} alt="AssistFlow" className="auth-logo" />
            <span className="auth-brand-title">AssistFlow</span>
          </div>
          <div className="auth-brand-content">
            <h2>SMART SUPPORT.</h2>
            <p className="brand-tagline">BETTER EXPERIENCE.</p>
            
            {/* Role Info - Left Side */}
            <div className="brand-role-info">
              <p className="brand-role-title">Two Dashboards Available</p>
              <div className="brand-role-list">
                <div className="brand-role-item">
                  <span className="brand-role-icon">→</span>
                  <div>
                    <strong>Customer Dashboard</strong>
                    <span>Create and track your tickets</span>
                  </div>
                </div>
                <div className="brand-role-item">
                  <span className="brand-role-icon">→</span>
                  <div>
                    <strong>Agent Dashboard</strong>
                    <span>Manage and resolve tickets</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                AI-powered ticket management
              </div>
              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                Real-time messaging with agents
              </div>
              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                Instant status updates
              </div>
            </div>
          </div>
          <div className="auth-brand-footer">AssistFlow v2.0 • AI Factory 2.0</div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-side">
          <div className="auth-form-header">
            <h1>AssistFlow</h1>
            <p>Sign in to your account</p>
          </div>

          {(localError || error) && (
            <div className="auth-error">⚠️ {localError || error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>

          <div className="auth-demo">
            <p>Demo Credentials</p>
            <div className="demo-grid">
              <div className="demo-box">
                <span className="demo-role">Customer</span>
                <span className="demo-email">customer@test.com</span>
                <span className="demo-pass">password123</span>
              </div>
              <div className="demo-box">
                <span className="demo-role">Agent</span>
                <span className="demo-email">agent@test.com</span>
                <span className="demo-pass">password123</span>
              </div>
            </div>
            <p className="demo-note">* Register first if demo accounts don't exist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;