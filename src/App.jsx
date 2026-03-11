import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context';
import Layout from './components/layout/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import PublicProfile from './pages/PublicProfile';
import QROnboarding from './pages/QROnboarding';
import OwnerDashboard from './pages/OwnerDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import VeterinaryDashboard from './pages/VeterinaryDashboard';

/**
 * ProtectedRoute Wrapper
 * Redirects to /login if not authenticated.
 * If a role is required, redirects to /dashboard if role doesn't match.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { firebaseUser, role, loading } = useApp();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { firebaseUser, role, loading } = useApp();

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/p/:slug" element={<PublicProfile />} />
        
        {/* Activation Flow */}
        <Route path="/activar/:qrSlug" element={<QROnboarding />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {role === 'veterinary' || role === 'clinic_admin' ? (
                <Navigate to="/veterinary" replace />
              ) : role === 'partner' ? (
                <Navigate to="/partner" replace />
              ) : (
                <OwnerDashboard />
              )}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/veterinary" 
          element={
            <ProtectedRoute requiredRole="veterinary">
              <VeterinaryDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/partner" 
          element={
            <ProtectedRoute requiredRole="partner">
              <PartnerDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
