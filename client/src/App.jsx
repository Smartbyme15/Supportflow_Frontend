import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AgentTickets from './pages/AgentTickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import Analytics from './pages/Analytics';
import AIChat from './pages/AIChat';
import './App.css';

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAgent = user?.role === 'agent';
  const isCustomer = user?.role === 'customer';

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#0d0d0d',
        color: '#355E3B',
        fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">
      {isAuthenticated && (
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <div className="app-body">
        {isAuthenticated && (
          <Sidebar isOpen={sidebarOpen} />
        )}
        <main className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/customer/tickets/new" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CreateTicket />
              </ProtectedRoute>
            } />
            <Route path="/customer/tickets/:id" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <TicketDetail />
              </ProtectedRoute>
            } />
            <Route path="/customer/ai-chat" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <AIChat />
              </ProtectedRoute>
            } />
            
            {/* Agent Routes */}
            <Route path="/agent/dashboard" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/agent/tickets" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentTickets />
              </ProtectedRoute>
            } />
            <Route path="/agent/tickets/:id" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <TicketDetail />
              </ProtectedRoute>
            } />
            <Route path="/agent/analytics" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/agent/ai-chat" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AIChat />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={
              isAuthenticated ? (
                <Navigate to={isAgent ? '/agent/dashboard' : '/customer/dashboard'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            
            <Route path="*" element={
              <div className="not-found">
                <h2>404</h2>
                <p>Page not found</p>
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