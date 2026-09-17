import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AgentTickets from './pages/AgentTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import Analytics from './pages/Analytics';
import AIChat from './pages/AIChat';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminTickets from './pages/AdminTickets';
import './App.css';

function AppContent() {
  const { user, isAuthenticated, loading, isAdmin, isAgent } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        height: '100vh', background: '#0a0a0a', color: '#355E3B', fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const getDashboardRoute = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isAgent) return '/agent/dashboard';
    return '/customer/dashboard';
  };

  return (
    <div className="app">
      {isAuthenticated && <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
      <div className="app-body">
        {isAuthenticated && <Sidebar isOpen={sidebarOpen} />}
        <main className={`main-content ${!sidebarOpen ? 'expanded' : ''} ${!isAuthenticated ? 'public' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={
              <ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>
            } />
            <Route path="/customer/tickets/new" element={
              <ProtectedRoute allowedRoles={['customer']}><CreateTicket /></ProtectedRoute>
            } />
            <Route path="/customer/tickets/:id" element={
              <ProtectedRoute allowedRoles={['customer']}><TicketDetail /></ProtectedRoute>
            } />
            <Route path="/customer/ai-chat" element={
              <ProtectedRoute allowedRoles={['customer']}><AIChat /></ProtectedRoute>
            } />
            
            {/* Agent Routes */}
            <Route path="/agent/dashboard" element={
              <ProtectedRoute allowedRoles={['agent']}><AgentDashboard /></ProtectedRoute>
            } />
            <Route path="/agent/tickets" element={
              <ProtectedRoute allowedRoles={['agent']}><AgentTickets /></ProtectedRoute>
            } />
            <Route path="/agent/tickets/:id" element={
              <ProtectedRoute allowedRoles={['agent']}><TicketDetail /></ProtectedRoute>
            } />
            <Route path="/agent/analytics" element={
              <ProtectedRoute allowedRoles={['agent']}><Analytics /></ProtectedRoute>
            } />
            <Route path="/agent/ai-chat" element={
              <ProtectedRoute allowedRoles={['agent']}><AIChat /></ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminTickets /></ProtectedRoute>
            } />
            <Route path="/admin/tickets/:id" element={
              <ProtectedRoute allowedRoles={['admin', 'agent', 'customer']}><TicketDetail /></ProtectedRoute>
            } />
            
            <Route path="*" element={
              <div className="not-found">
                <h2>404</h2>
                <p>Page not found</p>
                <button onClick={() => window.location.href = '/'} className="btn-primary" style={{ marginTop: '20px' }}>
                  Go Home
                </button>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;