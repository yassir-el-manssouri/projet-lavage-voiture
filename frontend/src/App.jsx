import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/client/ClientDashboard';
import AgentDashboard from './pages/agent/AgentDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import MyVehicles from './pages/client/MyVehicles';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/connexion" />;
  if (role && user.role !== role) {
    const defaultPath = user.role === 'AGENT' ? '/agent' : 
                        user.role === 'MANAGER' ? '/manager' : '/dashboard';
    return <Navigate to={defaultPath} />;
  }
  
  return children;
};

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/reserver" element={<PageTransition><BookingPage /></PageTransition>} />
        <Route path="/connexion" element={<PageTransition><LoginPage /></PageTransition>} />
        
        <Route path="/dashboard" element={
          <PrivateRoute role="CLIENT">
            <PageTransition><ClientDashboard /></PageTransition>
          </PrivateRoute>
        } />
        <Route path="/vehicules" element={
          <PrivateRoute role="CLIENT">
            <PageTransition><MyVehicles /></PageTransition>
          </PrivateRoute>
        } />
        <Route path="/agent" element={
          <PrivateRoute role="AGENT">
            <PageTransition><AgentDashboard /></PageTransition>
          </PrivateRoute>
        } />
        <Route path="/manager" element={
          <PrivateRoute role="MANAGER">
            <PageTransition><ManagerDashboard /></PageTransition>
          </PrivateRoute>
        } />
        
        {/* Legacy Redirects & Fallback */}
        <Route path="/client/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="/agent/dashboard" element={<Navigate to="/agent" replace />} />
        <Route path="/manager/dashboard" element={<Navigate to="/manager" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
