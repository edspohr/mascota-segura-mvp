import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context';
import Layout from './components/layout/Layout';

// Pages
import DevLogin from './pages/DevLogin';
import PublicProfile from './pages/PublicProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import VeterinaryDashboard from './pages/VeterinaryDashboard';

function App() {
  const { user } = useApp();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DevLogin />} />
        <Route path="/p/:slug" element={<PublicProfile />} />
        
        {/* Protected Routes Mock */}
        <Route 
          path="/dashboard" 
          element={user?.role === 'owner' ? <OwnerDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/veterinary" 
          element={user?.role === 'veterinary' ? <VeterinaryDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/partner" 
          element={user?.role === 'partner' ? <PartnerDashboard /> : <Navigate to="/" />} 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
