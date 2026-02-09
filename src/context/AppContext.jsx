import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState(mockData.pets);
  const [stats, setStats] = useState(mockData.stats);
  const [organizations, setOrganizations] = useState(mockData.organizations);
  const [usersList, setUsersList] = useState(mockData.usersList);
  const [loading, setLoading] = useState(false);

  // Load initial data simulation
  useEffect(() => {
    // In a real app, we would fetch data here
  }, []);

  const login = (role) => {
    setLoading(true);
    setTimeout(() => {
      setUser(mockData.users[role]);
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
  };

  const addMedicalRecord = (petId, record) => {
    setPets(currentPets =>
      currentPets.map(pet =>
        pet.id === petId
          ? { ...pet, medicalHistory: [record, ...pet.medicalHistory] }
          : pet
      )
    );
  };

  const updateStats = (type) => { // type: 'qrScans' or 'emergencyContacts'
    setStats(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const triggerEmergency = (petId, reporterData) => {
    updateStats('emergencyContacts');
    console.log(`EMERGENCY REPORTED FOR PET ${petId}:`, reporterData);
    // Here we would send notification to owner
    return true;
  };
  
  const recordScan = (petId) => {
      updateStats('qrScans');
      console.log(`QR SCAN FOR PET ${petId}`);
  }

  const getPetBySlug = (slug) => {
    return pets.find(p => p.slug === slug);
  };
  
  const getPetById = (id) => {
      return pets.find(p => p.id === id);
  }

  // Super Admin Functions
  const addOrganization = (org) => {
    setOrganizations([...organizations, { ...org, id: Date.now().toString(), status: 'Active', users: 0 }]);
  };

  const deleteOrganization = (id) => {
    setOrganizations(organizations.filter(o => o.id !== id));
  };

  const addUser = (userData) => {
    setUsersList([...usersList, { ...userData, id: Date.now().toString(), status: 'Active' }]);
  };

  const deleteUser = (id) => {
    setUsersList(usersList.filter(u => u.id !== id));
  };

  const value = {
    user,
    pets,
    stats,
    organizations,
    usersList,
    loading,
    login,
    logout,
    addMedicalRecord,
    triggerEmergency,
    recordScan,
    getPetBySlug,
    getPetById,
    addOrganization,
    deleteOrganization,
    addUser,
    deleteUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
