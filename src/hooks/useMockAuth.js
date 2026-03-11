import { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';

// Persists mock session across hot-reloads via sessionStorage
const STORAGE_KEY = 'mascota_segura_demo_role';

// ── Existing hook ────────────────────────────────────────────────────────

const getInitialRole = () => sessionStorage.getItem(STORAGE_KEY) || null;

export const useMockAuth = () => {
  const [activeRole, setActiveRole] = useState(getInitialRole);

  const loginAs = (role) => {
    sessionStorage.setItem(STORAGE_KEY, role);
    setActiveRole(role);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setActiveRole(null);
  };

  const profile = activeRole ? MOCK_USERS[activeRole] : null;

  return {
    user: profile,
    firebaseUser: profile ? { uid: profile.uid } : null,
    profile,
    role: activeRole,
    loading: false,
    isOwner: activeRole === 'owner',
    isVeterinary: activeRole === 'veterinary',
    isClinicAdmin: activeRole === 'clinic_admin',
    isPartner: activeRole === 'partner',
    isSuperAdmin: activeRole === 'super_admin',
    loginAs,
    logout,
  };
};
