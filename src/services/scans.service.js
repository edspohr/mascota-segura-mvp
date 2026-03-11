import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const recordScan = async ({ petId, petSlug, location, type = 'normal', reporter = null }) => {
  await addDoc(collection(db, 'scans'), {
    petId,
    petSlug,
    type,
    location: {
      lat: location?.lat || null,
      lng: location?.lng || null,
      address: location?.address || null,
    },
    reporterName: reporter?.name || null,
    reporterPhone: reporter?.phone || null,
    timestamp: serverTimestamp(),
  });
};

export const getGeolocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: null, lng: null, address: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: null }),
      () => resolve({ lat: null, lng: null, address: null }),
      { timeout: 5000 }
    );
  });
