import React from 'react';
import { ToastProvider } from '../components/ui/Toast';
import { useToast } from './ToastContext';
import { AppContext } from './Context';
import { useAuth } from '../hooks/useAuth';
import { logout as logoutService } from '../services/auth.service';

export const AppProvider = ({ children }) => (
  <ToastProvider>
    <AppProviderInternal>{children}</AppProviderInternal>
  </ToastProvider>
);

const AppProviderInternal = ({ children }) => {
  const auth = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    await logoutService();
    addToast('Sesión cerrada correctamente', 'info');
  };

  const value = {
    // Expose Firestore profile as `user` to keep existing page components compatible
    user: auth.profile,
    firebaseUser: auth.user,
    role: auth.role,
    loading: auth.loading,
    isOwner: auth.isOwner,
    isVeterinary: auth.isVeterinary,
    isClinicAdmin: auth.isClinicAdmin,
    isPartner: auth.isPartner,
    isSuperAdmin: auth.isSuperAdmin,
    addToast,
    logout: handleLogout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
