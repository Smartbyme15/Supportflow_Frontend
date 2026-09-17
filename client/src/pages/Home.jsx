import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, ArrowRight, Bot, Shield, MessageSquare, 
  BarChart3, Clock, Users, Ticket, Sparkles, 
  CheckCircle, Zap, Lock, TrendingUp, Send
} from 'lucide-react';
import logo from '../assets/images/logo.png';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleLogin = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'agent' ? '/agent/dashboard' : '/customer/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className={`home-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => navigate('/')}>
            <img src={logo} alt="SupportFlow" className="navbar-logo" />
            <span>SupportFlow</span>
          </div>

          <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#home" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#about" className="nav-link">About</a>
            <button className="nav-btn-login" onClick={handleLogin}>
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </button>
            <button className="nav-btn-signup" onClick={handleGetStarted}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-bg-effects">
          <div className="glow-circle glow-1"></div>
          <div className="glow-circle glow-2"></div>
          <div className="glow-circle glow-3"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>AI-Powered Support System</span>
            </div>
            
            <h1 className="hero-title">
              Smarter Support.
              <br />
              <span className="gradient-text">Faster Solutions.</span>
            </h1>
            
            <p className="hero-subtitle">
              Manage customer support tickets with AI-powered triage, 
              real-time communication, and a seamless resolution workflow.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary-hero" onClick={handleGetStarted}>
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight size={18} />
              </button>
              <button className="btn-secondary-hero" onClick={scrollToFeatures}>
                Explore Features
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <Zap size={20} />
                <div>
                  <strong>Fast Support</strong>
                  <span>Quick responses</span>
                </div>
              </div>
              <div className="hero-stat">
                <Shield size={20} />
                <div>
                  <strong>Secure</strong>
                  <span>Data protected</span>
                </div>
              </div>
              <div className="hero-stat">
                <Clock size={20} />
                <div>
                  <strong>24/7 Access</strong>
                  <span>Always available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="preview-title">SupportFlow Dashboard</span>
              </div>
              <div className="preview-body">
                <div className="preview-sidebar">
                  <div className="sidebar-item active">Dashboard</div>
                  <div className="sidebar-item">My Tickets</div>
                  <div className="sidebar-item">Create Ticket</div>
                </div>
                <div className="preview-main">
                  <h4>Good Morning, Laiba</h4>
                  <div className="preview-stats">
                    <div className="stat-box">
                      <span>Total</span>
                      <strong>12</strong>
                    </div>
                    <div className="stat-box">
                      <span>Open</span>
                      <strong>3</strong>
                    </div>
                    <div className="stat-box">
                      <span>Resolved</span>
                      <strong>5</strong>
                    </div>
                  </div>
                  <div className="preview-ticket">
                    <div className="ticket-row">
                      <span className="ticket-id">#TK-1003</span>
                      <span className="ticket-subject">Login issue</span>
                      <span className="ticket-priority high">High</span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-id">#TK-1002</span>
                      <span className="ticket-subject">Feature request</span>
                      <span className="ticket-priority medium">Medium</span>
                    </div>
                    <div className="ticket-row">
                      <span className="ticket-id">#TK-1001</span>
                      <span className="ticket-subject">Bug report</span>
                      <span className="ticket-priority low">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="floating-card card-ai">
              <Bot size={20} />
              <div>
                <strong>AI Assistant</strong>
                <span>Ready to help</span>
              </div>
            </div>

            <div className="floating-card card-track">
              <TrendingUp size={20} />
              <div>
                <strong>Track Progress</strong>
                <span>Real-time updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Workflow Line */}
      <section className="workflow-section">
        <div className="workflow-container">
          <p className="workflow-tagline">
            From customer issue to successful resolution — all in one flow
          </p>
          <div className="animated-workflow">
            <div className="workflow-line"></div>
            <div className="workflow-moving-dot"></div>
            
            <div className="workflow-step">
              <div className="step-icon">
                <Ticket size={20} />
              </div>
              <span>Customer Submits</span>
            </div>
            <div className="workflow-step">
              <div className="step-icon">
                <Bot size={20} />
              </div>
              <span>AI Triage</span>
            </div>
            <div className="workflow-step">
              <div className="step-icon">
                <MessageSquare size={20} />
              </div>
              <span>Agent Responds</span>
            </div>
            <div className="workflow-step">
              <div className="step-icon">
                <CheckCircle size={20} />
              </div>
              <span>Ticket Resolved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features" ref={featuresRef}>
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Why Choose SupportFlow?</span>
            <h2 className="section-title">Everything You Need for Better Support</h2>
            <p className="section-subtitle">
              From ticket management to team collaboration, we give you the tools 
              to provide faster, smarter, and more efficient support.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Bot size={28} />
              </div>
              <h3>AI Ticket Triage</h3>
              <p>AI suggests category, priority, and a short summary automatically.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MessageSquare size={28} />
              </div>
              <h3>Real-Time Communication</h3>
              <p>Exchange messages without refreshing — instant updates on both sides.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Ticket size={28} />
              </div>
              <h3>Ticket Management</h3>
              <p>Create, assign, track, and resolve support tickets seamlessly.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Lock size={28} />
              </div>
              <h3>Secure Authentication</h3>
              <p>Separate protected areas for customers and agents with JWT.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Clock size={28} />
              </div>
              <h3>Ticket History</h3>
              <p>All conversations persist in the database for complete records.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={28} />
              </div>
              <h3>Dashboard Analytics</h3>
              <p>View real-time ticket statistics based on actual data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">How It Works</span>
            <h2 className="section-title">Get Started in 4 Simple Steps</h2>
            <p className="section-subtitle">
              It's quick and easy to get the help you need — from ticket to resolution.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Submit Your Issue</h3>
              <p>Create a support ticket with subject, description, and optional category.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>AI Analyzes</h3>
              <p>AI suggests category, priority, and a summary of your issue.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Agent Responds</h3>
              <p>Agent reviews AI suggestions, replies, and updates ticket status.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Issue Resolved</h3>
              <p>Agent provides resolution note and marks ticket as resolved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Triage Preview */}
      <section className="ai-preview-section">
        <div className="section-container">
          <div className="ai-preview-grid">
            <div className="ai-preview-text">
              <span className="section-tag">AI Triage Preview</span>
              <h2 className="section-title">AI-Powered Ticket Analysis</h2>
              <p className="section-subtitle">
                Our AI analyzes every ticket and suggests the best category, 
                priority, and summary — all reviewed by human agents before finalization.
              </p>
              <div className="ai-note">
                <Shield size={16} />
                <span>AI suggestions are reviewed and confirmed by a human support agent.</span>
              </div>
            </div>

            <div className="ai-preview-card">
              <div className="ai-card-header">
                <Bot size={20} />
                <span>AI Analysis</span>
              </div>
              <div className="ai-complaint">
                <label>Customer Complaint:</label>
                <p>"I was charged twice for the same order and need one payment refunded."</p>
              </div>
              <div className="ai-results">
                <div className="ai-result-row">
                  <span>Category:</span>
                  <strong>Billing</strong>
                </div>
                <div className="ai-result-row">
                  <span>Priority:</span>
                  <strong className="priority-high">High</strong>
                </div>
                <div className="ai-result-row">
                  <span>Summary:</span>
                  <strong>Possible duplicate payment reported</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Areas */}
      <section className="user-areas-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">For Everyone</span>
            <h2 className="section-title">Two Powerful Experiences</h2>
          </div>

          <div className="user-areas-grid">
            <div className="user-area-card customer">
              <div className="user-area-icon">
                <Users size={32} />
              </div>
              <h3>For Customers</h3>
              <ul>
                <li><CheckCircle size={16} /> Create support tickets</li>
                <li><CheckCircle size={16} /> View ticket status</li>
                <li><CheckCircle size={16} /> Exchange messages with agents</li>
                <li><CheckCircle size={16} /> View conversation history</li>
              </ul>
              <button className="btn-area" onClick={() => navigate('/register')}>
                Start as Customer
              </button>
            </div>

            <div className="user-area-card agent">
              <div className="user-area-icon">
                <Shield size={32} />
              </div>
              <h3>For Agents</h3>
              <ul>
                <li><CheckCircle size={16} /> View assigned tickets</li>
                <li><CheckCircle size={16} /> Review AI triage</li>
                <li><CheckCircle size={16} /> Reply to customers</li>
                <li><CheckCircle size={16} /> Resolve with notes</li>
              </ul>
              <button className="btn-area" onClick={() => navigate('/register')}>
                Start as Agent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>Create your first support ticket in seconds. AI will handle the rest.</p>
          <button className="btn-cta" onClick={handleGetStarted}>
            {isAuthenticated ? 'Go to Dashboard' : 'Create Your First Ticket'}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer" id="about">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="SupportFlow" />
              <span>SupportFlow</span>
            </div>
            <p>AI-powered customer support ticketing system for modern teams.</p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#about">About</a>
            </div>
            <div className="footer-col">
              <h4>Access</h4>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 SupportFlow. All rights reserved.</p>
          <p>Built with ❤️ for AI Factory 2.0 Hackathon</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;