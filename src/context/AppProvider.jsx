import React, { useState } from 'react';
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
  const [campaigns, setCampaigns] = useState(mockData.campaigns);
  const [veterinaryData, setVeterinaryData] = useState(mockData.veterinaryData);
  const [partnerData, setPartnerData] = useState(mockData.partnerData);
  const [loading, setLoading] = useState(false);
  
  // Use Toast context
  const { addToast } = useToast();

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

  const triggerEmergency = (petId, reporterData) => {
    console.log(`EMERGENCY REPORTED FOR PET ${petId}:`, reporterData);
    addToast('Alerta de emergencia enviada', 'error');
    return true;
  };
  
  const recordScan = (petId) => {
      console.log(`QR SCAN FOR PET ${petId}`);
  }

  const getPetBySlug = (slug) => {
    const foundPet = pets.find(p => p.slug === slug);
    if (!foundPet) return null;

    const owner = Object.values(mockData.users).find(u => u.id === foundPet.ownerId) || mockData.users.owner;
    
    return {
        ...foundPet,
        ownerContact: {
            name: owner.name,
            phone: owner.phone || "+51 999 999 999" 
        },
        emergencyContact: owner.emergencyContact || {
            name: "Contacto de Emergencia",
            phone: "+51 999 888 777"
        }
    };
  };
  
  const getPetById = (id) => {
      return pets.find(p => p.id === id);
  }

  // --- NEW MEMORY ACTIONS FOR MODALS ---
  const addPet = (petData) => {
    const newPet = {
      id: `p${Date.now()}`,
      slug: `${petData.name.toLowerCase()}-${Date.now()}`,
      ...petData,
      ownerId: user?.id,
      logs: [],
      upcomingEvents: [],
      status: "safe",
      compliance: 100
    };
    setPets([newPet, ...pets]);
    addToast(`${petData.name} añadido con éxito`, 'success');
  };

  const addLog = (petId, logData) => {
    setPets(currentPets =>
      currentPets.map(pet =>
        pet.id === petId
          ? {
              ...pet,
              logs: [{
                id: `l${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                ...logData, // { type, content }
                authorRole: user?.role,
                authorName: user?.name
              }, ...pet.logs]
            }
          : pet
      )
    );
    addToast('Bitácora actualizada', 'success');
  };

  const registerVisit = (patientId, visitData) => {
    // 1. Add to logs history of the pet
    setPets(currentPets => 
      currentPets.map(pet => {
        if (pet.id === patientId || pet.name === patientId) { 
           return {
             ...pet,
             logs: [{
               id: `l${Date.now()}`,
               date: new Date().toISOString().split('T')[0],
               type: visitData.type,
               content: visitData.description || `Atención registrada: ${visitData.type}`,
               authorRole: user?.role,
               authorName: user?.name
             }, ...pet.logs],
             upcomingEvents: visitData.nextDueDate ? [{
               id: `e${Date.now()}`,
               date: visitData.nextDueDate,
               type: visitData.type,
               description: `Refuerzo de ${visitData.type}`,
               provider: user?.name
             }] : pet.upcomingEvents
           }
        }
        return pet;
      })
    );

    // 2. Update the veterinary dashboard list
    setVeterinaryData(prev => ({
      ...prev,
      recentPatients: prev.recentPatients.map(p => 
        p.id === patientId ? { 
          ...p, 
          lastVisit: new Date().toISOString().split('T')[0],
          nextDue: visitData.nextDueDate || p.nextDue,
          status: 'ok'
        } : p
      )
    }));

    addToast('Atención registrada exitosamente. Notificación de refuerzo programada.', 'success');
  };

  const addCampaign = (campaignData) => {
    const newCampaign = {
      id: `c${Date.now()}`,
      partner: user?.name || "Partner",
      redeemed: 0,
      reach: 0,
      active: true,
      ...campaignData
    };
    setCampaigns([newCampaign, ...campaigns]);
    setPartnerData(prev => ({
      ...prev,
      activeCampaigns: prev.activeCampaigns + 1
    }));
    addToast('Campaña lanzada con éxito a toda la red', 'success');
  };

  const value = {
    user,
    pets,
    campaigns,
    veterinaryData,
    partnerData,
    loading,
    login,
    logout,
    addMedicalRecord,
    togglePetStatus,
    triggerEmergency,
    recordScan,
    getPetBySlug,
    getPetById,
    addPet,
    registerVisit,
    addCampaign,
    addLog
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
