import {
  collection, doc, addDoc, updateDoc, getDocs, query,
  where, orderBy, limit, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { generateSlug } from '../utils/slug';

export const createPet = async (ownerId, petData, qrSlug = null) => {
  const slug = qrSlug || generateSlug(petData.name);
  const petRef = await addDoc(collection(db, 'pets'), {
    slug,
    name: petData.name,
    species: petData.species,
    breed: petData.breed,
    age: Number(petData.age),
    weight: petData.weight,
    photoURL: petData.photoURL || '',
    ownerId,
    status: 'safe',
    compliance: 100,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (qrSlug) {
    const qrQuery = query(collection(db, 'qrCodes'), where('slug', '==', qrSlug));
    const qrSnap = await getDocs(qrQuery);
    if (!qrSnap.empty) {
      await updateDoc(qrSnap.docs[0].ref, {
        status: 'claimed',
        petId: petRef.id,
        claimedAt: serverTimestamp(),
      });
    }
  }
  return petRef.id;
};

export const subscribeToOwnerPets = (ownerId, callback) => {
  const q = query(
    collection(db, 'pets'),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const getPetBySlug = async (slug) => {
  const q = query(collection(db, 'pets'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const updatePetStatus = async (petId, status) => {
  await updateDoc(doc(db, 'pets', petId), { status, updatedAt: serverTimestamp() });
};

export const updatePet = async (petId, updates) => {
  await updateDoc(doc(db, 'pets', petId), { ...updates, updatedAt: serverTimestamp() });
};
