import { useState, useEffect } from 'react';
import { subscribeToOwnerPets } from '../services/pets.service';

export const usePets = (ownerId) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) { setLoading(false); return; }
    const unsub = subscribeToOwnerPets(ownerId, (data) => {
      setPets(data);
      setLoading(false);
    });
    return unsub;
  }, [ownerId]);

  return { pets, loading };
};
