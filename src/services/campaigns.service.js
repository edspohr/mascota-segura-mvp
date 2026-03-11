import {
  collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const createCampaign = async (data, partner) => {
  await addDoc(collection(db, 'campaigns'), {
    title: data.title,
    description: data.description,
    imageURL: data.imageURL || '',
    partnerId: partner.uid,
    partnerName: partner.name,
    targetCompliance: 100,
    active: true,
    stats: { reach: 0, redeemed: 0 },
    createdAt: serverTimestamp(),
  });
};

export const subscribeToActiveCampaigns = (callback) => {
  const q = query(
    collection(db, 'campaigns'),
    where('active', '==', true),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const subscribeToPartnerCampaigns = (partnerId, callback) => {
  const q = query(
    collection(db, 'campaigns'),
    where('partnerId', '==', partnerId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
