import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

const resizeImage = (file, maxW = 800, maxH = 800, quality = 0.85) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const uploadPetPhoto = async (petId, file) => {
  if (file.size > MAX_BYTES) throw new Error('La imagen supera el límite de 2MB');
  const blob = await resizeImage(file);
  const storageRef = ref(storage, `pets/${petId}/photo_${Date.now()}.jpg`);
  const snap = await uploadBytes(storageRef, blob);
  return getDownloadURL(snap.ref);
};

export const uploadUserAvatar = async (uid, file) => {
  if (file.size > MAX_BYTES) throw new Error('El avatar supera el límite de 2MB');
  const blob = await resizeImage(file, 400, 400, 0.9);
  const storageRef = ref(storage, `avatars/${uid}/avatar_${Date.now()}.jpg`);
  const snap = await uploadBytes(storageRef, blob);
  return getDownloadURL(snap.ref);
};
