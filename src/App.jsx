import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/Context';
import Layout from './components/layout/Layout';

// Pages
import DevLogin from './pages/DevLogin';
import PublicProfile from './pages/PublicProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

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
          path="/partner" 
          element={user?.role === 'partner' ? <PartnerDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/superadmin" 
          element={user?.role === 'superadmin' ? <SuperAdminDashboard /> : <Navigate to="/" />} 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
