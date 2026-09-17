
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle,
  BarChart3,
  Bot,
  Users,
  LogOut
} from 'lucide-react';
import logo from '../assets/images/logo.png';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const isAgent = user?.role === 'agent';
  const isCustomer = user?.role === 'customer';
  const isAdmin = user?.role === 'admin';

  const customerLinks = [
    { to: '/customer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/customer/tickets/new', icon: PlusCircle, label: 'New Ticket' },
    { to: '/customer/ai-chat', icon: Bot, label: 'AI Assistant' },
  ];

  const agentLinks = [
    { to: '/agent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/agent/tickets', icon: Ticket, label: 'All Tickets' },
    { to: '/agent/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/agent/ai-chat', icon: Bot, label: 'AI Assistant' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/tickets', icon: Ticket, label: 'All Tickets' },
  ];

  const links = isAdmin ? adminLinks : (isAgent ? agentLinks : customerLinks);

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={logo} alt="AssistFlow" className="sidebar-logo" />
            <span className="brand-text">AssistFlow</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">{user?.role}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;