import { useState, useEffect } from 'react';
import { subscribeToAuthState, getUserProfile, getUserClaims } from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(undefined);   // undefined = still loading
  const [profile, setProfile] = useState(null);
  const [claims, setClaims] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        const [userProfile, userClaims] = await Promise.all([
          getUserProfile(firebaseUser.uid),
          getUserClaims(firebaseUser),
        ]);
        setUser(firebaseUser);
        setProfile(userProfile);
        setClaims(userClaims);
      } else {
        setUser(null);
        setProfile(null);
        setClaims(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const role = claims?.role || profile?.role || null;

  return {
    user,
    profile,
    claims,
    role,
    loading,
    isOwner: role === 'owner',
    isVeterinary: role === 'veterinary',
    isClinicAdmin: role === 'clinic_admin',
    isPartner: role === 'partner',
    isSuperAdmin: role === 'super_admin',
  };
};
