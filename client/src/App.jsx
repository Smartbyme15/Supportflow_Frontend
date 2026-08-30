import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
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
import './App.css';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAgent = user?.role === 'agent';
  const isCustomer = user?.role === 'customer';

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
      <ToastProvider>
        <Router>
          <AppContent />
          <ToastContainer />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;