import { useState, useEffect } from 'react';
import { subscribeToLogs } from '../services/logs.service';

export const usePetLogs = (petId) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!petId) return;
    const unsub = subscribeToLogs(petId, (data) => {
      setLogs(data);
      setLoading(false);
    });
    return unsub;
  }, [petId]);

  return { logs, loading };
};
