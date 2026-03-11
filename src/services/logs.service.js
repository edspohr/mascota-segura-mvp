import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const addLog = async (petId, logData, author) => {
  await addDoc(collection(db, 'pets', petId, 'logs'), {
    type: logData.type,
    content: logData.content,
    authorId: author.uid,
    authorName: author.name,
    authorRole: author.role,
    isOfficial: author.role === 'veterinary' || author.role === 'clinic_admin',
    date: new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp(),
  });
};

export const subscribeToLogs = (petId, callback) => {
  const q = query(
    collection(db, 'pets', petId, 'logs'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
