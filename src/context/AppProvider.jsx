import React from 'react';
import { ToastProvider } from '../components/ui/Toast';
import { useToast } from './ToastContext';
import { AppContext } from './Context';
import { useAuth } from '../hooks/useAuth';
import { useMockAuth } from '../hooks/useMockAuth';
import { logout as logoutService } from '../services/auth.service';
import { DEMO_MODE } from '../config/demo';

export const AppProvider = ({ children }) => (
  <ToastProvider>
    <AppProviderInternal>{children}</AppProviderInternal>
  </ToastProvider>
);

const AppProviderInternal = ({ children }) => {
  const realAuth = useAuth();
  const mockAuth = useMockAuth();
  const { addToast } = useToast();

  // In demo mode, bypass Firebase entirely
  const auth = DEMO_MODE ? mockAuth : realAuth;

  const handleLogout = async () => {
    if (DEMO_MODE) {
      mockAuth.logout();
    } else {
      await logoutService();
    }
    addToast('Sesión cerrada correctamente', 'info');
  };

  const value = {
    user: auth.profile,
    firebaseUser: auth.user || auth.firebaseUser,
    role: auth.role,
    loading: auth.loading,
    isOwner: auth.isOwner,
    isVeterinary: auth.isVeterinary,
    isClinicAdmin: auth.isClinicAdmin,
    isPartner: auth.isPartner,
    isSuperAdmin: auth.isSuperAdmin,
    addToast,
    logout: handleLogout,
    // Expose loginAs only in demo mode (used by Login page)
    demoLoginAs: DEMO_MODE ? mockAuth.loginAs : null,
    isDemo: DEMO_MODE,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
