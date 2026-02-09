import React, { useState, useEffect } from 'react';
import { mockData } from '../data/mockData';
import { ToastProvider } from '../components/ui/Toast';
import { useToast } from './ToastContext';
import { AppContext } from './Context';

export const AppProvider = ({ children }) => {
  return (
    <ToastProvider>
        <AppProviderInternal>{children}</AppProviderInternal>
    </ToastProvider>
  );
};

const AppProviderInternal = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState(mockData.pets);
  const [stats, setStats] = useState(mockData.stats);
  const [organizations, setOrganizations] = useState(mockData.organizations);
  const [usersList, setUsersList] = useState(mockData.usersList);
  const [loading, setLoading] = useState(false);
  
  // Use Toast context
  const { addToast } = useToast();

  // Load initial data simulation
  useEffect(() => {
    // In a real app, we would fetch data here
  }, []);

  const login = (role) => {
    setLoading(true);
    setTimeout(() => {
      const loggedUser = mockData.users[role];
      setUser(loggedUser);
      addToast(`Bienvenido, ${loggedUser.name}`, 'success');
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
    addToast('Sesión cerrada', 'info');
  };

  const addMedicalRecord = (petId, record) => {
    setPets(currentPets =>
      currentPets.map(pet =>
        pet.id === petId
          ? { ...pet, medicalHistory: [record, ...pet.medicalHistory] }
          : pet
      )
    );
    addToast('Registro médico agregado', 'success');
  };

  const togglePetStatus = (petId) => {
    setPets(currentPets => 
      currentPets.map(pet => {
         if (pet.id === petId) {
             const newStatus = pet.status === 'safe' ? 'lost' : 'safe';
             const msg = newStatus === 'lost' ? '¡Modo PERDIDO activado!' : 'Mascota segura';
             const type = newStatus === 'lost' ? 'error' : 'success';
             addToast(msg, type);
             return { ...pet, status: newStatus };
         }
         return pet;
      })
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
    addToast('Alerta de emergencia enviada', 'error');
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
    addToast('Organización creada', 'success');
  };

  const deleteOrganization = (id) => {
    setOrganizations(organizations.filter(o => o.id !== id));
    addToast('Organización eliminada', 'info');
  };

  const addUser = (userData) => {
    setUsersList([...usersList, { ...userData, id: Date.now().toString(), status: 'Active' }]);
    addToast('Usuario creado', 'success');
  };

  const deleteUser = (id) => {
    setUsersList(usersList.filter(u => u.id !== id));
    addToast('Usuario eliminado', 'info');
  };

  const value = {
    user,
    pets,
    stats,
    organizations,
    usersList,
    loading,
    login, // updated with toast
    logout, // updated with toast
    addMedicalRecord, // updated with toast
    togglePetStatus, // New function with toast
    triggerEmergency, // updated with toast
    recordScan,
    getPetBySlug,
    getPetById,
    addOrganization, // updated with toast
    deleteOrganization, // updated with toast
    addUser, // updated with toast
    deleteUser // updated with toast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
