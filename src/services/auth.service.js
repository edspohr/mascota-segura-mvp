import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();

export const registerWithEmail = async ({ email, password, name, phone }) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = credential.user.uid;
  await setDoc(doc(db, 'users', uid), {
    uid, email, name,
    phone: phone || '',
    role: 'owner',
    avatar: '',
    clinicId: null,
    emergencyContact: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return credential.user;
};

export const loginWithEmail = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(auth, googleProvider);
  const uid = credential.user.uid;
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (!userSnap.exists()) {
    await setDoc(doc(db, 'users', uid), {
      uid,
      email: credential.user.email,
      name: credential.user.displayName || '',
      phone: '',
      role: 'owner',
      avatar: credential.user.photoURL || '',
      clinicId: null,
      emergencyContact: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return credential.user;
};

export const logout = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const subscribeToAuthState = (callback) => onAuthStateChanged(auth, callback);

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const getUserClaims = async (firebaseUser) => {
  const token = await firebaseUser.getIdTokenResult(true);
  return token.claims;
};
