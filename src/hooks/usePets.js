import { useState, useEffect } from 'react';
import { subscribeToOwnerPets } from '../services/pets.service';
import { useApp } from '../context';
import { MOCK_PETS } from '../data/mockData';

export const usePets = (ownerId) => {
  const { isDemo } = useApp();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setPets(MOCK_PETS);
      setLoading(false);
      return;
    }
    
    if (!ownerId) { setLoading(false); return; }
    const unsub = subscribeToOwnerPets(ownerId, (data) => {
      setPets(data);
      setLoading(false);
    });
    return unsub;
  }, [ownerId, isDemo]);

  return { pets, loading };
};
