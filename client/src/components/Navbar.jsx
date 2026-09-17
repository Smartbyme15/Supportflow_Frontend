import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Home as HomeIcon } from 'lucide-react';
import logo from '../assets/images/logo.png';
import './Navbar.css';

const Navbar = ({ sidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'agent') return '/agent/dashboard';
    return '/customer/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="navbar-brand" onClick={() => navigate(getDashboardRoute())}>
          <img src={logo} alt="AssistFlow" className="navbar-logo" />
          <span className="brand-text">AssistFlow</span>
        </div>
      </div>

      <div className="navbar-right">
        <Link to="/" className="navbar-home-link" title="Home">
          <HomeIcon size={18} />
          <span>Home</span>
        </Link>
        
        <div className="navbar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;