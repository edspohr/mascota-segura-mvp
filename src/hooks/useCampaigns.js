import { useState, useEffect } from 'react';
import {
  subscribeToActiveCampaigns,
  subscribeToPartnerCampaigns,
} from '../services/campaigns.service';

export const useActiveCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToActiveCampaigns((data) => {
      setCampaigns(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { campaigns, loading };
};

export const usePartnerCampaigns = (partnerId) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerId) return;
    const unsub = subscribeToPartnerCampaigns(partnerId, (data) => {
      setCampaigns(data);
      setLoading(false);
    });
    return unsub;
  }, [partnerId]);

  return { campaigns, loading };
};
