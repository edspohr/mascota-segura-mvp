import {
  collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const addEvent = async (petId, eventData, provider) => {
  await addDoc(collection(db, 'pets', petId, 'events'), {
    type: eventData.type,
    description: eventData.description,
    dueDate: eventData.dueDate,
    providerId: provider.uid,
    providerName: provider.name,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const subscribeToUpcomingEvents = (petId, callback) => {
  const q = query(
    collection(db, 'pets', petId, 'events'),
    where('status', '==', 'pending'),
    orderBy('dueDate', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
