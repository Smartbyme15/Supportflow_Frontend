import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    setLocalError('');
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'agent') {
        navigate('/agent/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
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

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
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
            <h2>Join AssistFlow</h2>
            <p className="brand-tagline">SMART SUPPORT. BETTER EXPERIENCE.</p>
            
            {/* Role Info - Left Side */}
            <div className="brand-role-info">
              <p className="brand-role-title">Choose Your Dashboard</p>
              <div className="brand-role-list">
                <div className="brand-role-item">
                  <span className="brand-role-icon">→</span>
                  <div>
                    <strong>Customer</strong>
                    <span>Create and track your tickets</span>
                  </div>
                </div>
                <div className="brand-role-item">
                  <span className="brand-role-icon">→</span>
                  <div>
                    <strong>Agent</strong>
                    <span>Manage and resolve tickets</span>
                  </div>
                </div>
                <div className="brand-role-item">
                  <span className="brand-role-icon">→</span>
                  <div>
                    <strong>Admin</strong>
                    <span>Full system access (by invitation)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                Free to join
              </div>
              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                AI-powered support tickets
              </div>
              <div className="auth-feature">
                <span className="auth-feature-check">✓</span>
                Real-time messaging
              </div>
            </div>
          </div>
          <div className="auth-brand-footer">AssistFlow v2.0 • AI Factory 2.0</div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-side">
          <div className="auth-form-header">
            <h1>AssistFlow</h1>
            <p>Create your account</p>
          </div>

          {(localError || error) && (
            <div className="auth-error">⚠️ {localError || error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="min 6 characters"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="customer">Customer</option>
                <option value="agent">Support Agent</option>
              </select>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;