import { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';

// Persists mock session across hot-reloads via sessionStorage
import { DEMO_UNLOCK_CODE } from '../config/demo';

const STORAGE_KEY         = 'mascota_segura_demo_role';
const DEMO_UNLOCKED_KEY   = 'mascota_segura_demo_unlocked';

// ── Gate helpers (used by Login page and AppProvider) ──────────────────

/** Returns true if the user has entered the correct demo code this session. */
export const isDemoUnlocked = () =>
  sessionStorage.getItem(DEMO_UNLOCKED_KEY) === 'true';

/**
 * Validates the code and persists the unlocked state for this session.
 * Returns true on success, false on wrong code.
 */
export const unlockDemo = (code) => {
  if (code.trim() === DEMO_UNLOCK_CODE) {
    sessionStorage.setItem(DEMO_UNLOCKED_KEY, 'true');
    return true;
  }
  return false;
};

/** Clears both the active role and the unlocked flag. */
export const lockDemo = () => {
  sessionStorage.removeItem(DEMO_UNLOCKED_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
};

// ── Existing hook (unchanged below this line) ──────────────────────────

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
