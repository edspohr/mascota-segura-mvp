# 🤖 AI AGENT IMPLEMENTATION PROMPT
## Mascota Segura — Firebase Full-Stack Migration

> **LANGUAGE RULE (NON-NEGOTIABLE):** All user-facing text, UI labels, error messages,
> toast notifications, email content, button labels, placeholders, and any string
> visible to the end user MUST be written in **Spanish (Latin American)**. Code,
> variable names, comments, and file names stay in English.

---

## AGENT ROLE & PERMISSIONS

You are a senior full-stack engineer executing a complete backend migration for
"Mascota Segura", a pet health and safety PWA. The existing repository has a
fully functional React frontend with mock data. Your mission is to wire it to a
real Firebase backend — preserving every pixel of the existing UI — and then
implement the missing pages and Cloud Functions.

**You have explicit permission to:**
- Rewrite any file in the repository
- Delete files that are no longer needed
- Create new files and folders
- Run shell commands to install packages, authenticate CLIs, and deploy

**You must NEVER:**
- Change any Tailwind className on existing components
- Change any JSX structure in existing UI components
- Install npm packages not listed in this prompt
- Hardcode secrets or API keys in source files
- Store passwords or sensitive PII in Firestore

Execute all steps **in the exact order listed**. If any step fails, report the
exact error before proceeding.

---

## PROJECT CONTEXT

**Firebase Project:** `pakuna-3413d`
**Firebase Config (already provided by client):**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCD2S71mph9Fhb14M5-SVWV2vVbUvR-0QY",
  authDomain: "pakuna-3413d.firebaseapp.com",
  projectId: "pakuna-3413d",
  storageBucket: "pakuna-3413d.firebasestorage.app",
  messagingSenderId: "123229515196",
  appId: "1:123229515196:web:5c7cdea35742269b6ccfb9"
};
```

**Current stack (already installed):** React 19 · Vite 7 · Tailwind CSS v4 ·
React Router DOM v7 · Lucide React

**Stack to add:** Firebase SDK · Firebase Tools CLI · Resend (email)

**Deploy target:** Firebase Hosting (replacing Vercel)

---

## STEP 0 — AUTHENTICATION & CLI SETUP

> This step must complete fully before anything else. The agent needs authenticated
> access to both Firebase and Google Cloud to configure services programmatically.

### 0.1 Install Firebase Tools globally

```bash
npm install -g firebase-tools
```

### 0.2 Authenticate Firebase CLI

```bash
firebase login
```

If running in a headless/CI environment, use:

```bash
firebase login --no-localhost
```

Follow the URL printed in the terminal, authenticate in the browser, and paste
the code back. Verify success with:

```bash
firebase projects:list
```

Confirm that `pakuna-3413d` appears in the list.

### 0.3 Authenticate Google Cloud CLI (required for Cloud Functions secrets)

```bash
# Install gcloud CLI if not present
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Authenticate
gcloud auth login
gcloud config set project pakuna-3413d
gcloud auth application-default login
```

Verify:

```bash
gcloud projects describe pakuna-3413d
```

### 0.4 Set the active Firebase project

```bash
firebase use pakuna-3413d
```

### 0.5 Enable required Google Cloud APIs

```bash
gcloud services enable \
  firestore.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com \
  identitytoolkit.googleapis.com
```

Wait for all APIs to confirm "Enabled" before continuing.

### 0.6 Enable Firebase Authentication providers via CLI

```bash
# Enable Email/Password provider
firebase auth:import /dev/null \
  --hash-algo=BCRYPT 2>/dev/null || true

# The following must be done manually in Firebase Console if CLI doesn't support it:
# Console → Authentication → Sign-in method → Enable:
#   ✅ Email/Password
#   ✅ Google
# Print reminder for the user:
echo "⚠️  MANUAL ACTION REQUIRED:"
echo "Go to https://console.firebase.google.com/project/pakuna-3413d/authentication/providers"
echo "Enable: Email/Password AND Google"
echo "Press ENTER when done to continue..."
read
```

---

## STEP 1 — PROJECT INITIALIZATION

### 1.1 Install frontend dependencies

Run from the repository root:

```bash
npm install firebase
npm install -D firebase-tools
```

### 1.2 Initialize Firebase services in the project

```bash
firebase init
```

Select the following services when prompted:

- **Firestore** → use existing rules file: `firestore.rules`
- **Functions** → Language: **JavaScript** · ESLint: **No** · Install deps: **Yes**
- **Hosting** → Public directory: `dist` · Single-page app: **Yes** · No GitHub Actions
- **Storage** → use existing rules file: `storage.rules`
- **Emulators** → Select: Auth · Firestore · Functions · Storage · Hosting
  - Auth port: 9099
  - Firestore port: 8080
  - Functions port: 5001
  - Storage port: 9199
  - Hosting port: 5000
  - Download emulators: **Yes**

### 1.3 Create environment file

Create `.env.local` in the repository root:

```bash
cat > .env.local << 'EOF'
VITE_FIREBASE_API_KEY=AIzaSyCD2S71mph9Fhb14M5-SVWV2vVbUvR-0QY
VITE_FIREBASE_AUTH_DOMAIN=pakuna-3413d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pakuna-3413d
VITE_FIREBASE_STORAGE_BUCKET=pakuna-3413d.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123229515196
VITE_FIREBASE_APP_ID=1:123229515196:web:5c7cdea35742269b6ccfb9
EOF
```

Ensure `.env.local` is in `.gitignore`:

```bash
grep -q ".env.local" .gitignore || echo ".env.local" >> .gitignore
```

### 1.4 Store Resend API key as a Firebase Secret

```bash
firebase functions:secrets:set RESEND_API_KEY
```

When prompted, paste the Resend API key. If the client does not yet have a
Resend account, print the following and wait:

```
⚠️  RESEND API KEY NEEDED:
1. Go to https://resend.com and create a free account
2. Go to API Keys → Create API Key
3. Copy the key and paste it here
Press ENTER after running the command above with the key.
```

---

## STEP 2 — FIREBASE CONFIGURATION MODULE

Create `src/config/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

---

## STEP 3 — FIRESTORE DATA MODEL

The following collections must be created. Do NOT seed data manually — documents
are created by the application at runtime. This step only defines the schema for
reference and will be enforced by Security Rules in Step 9.

```
/users/{uid}
  uid: string
  email: string
  name: string
  role: 'owner' | 'veterinary' | 'clinic_admin' | 'partner' | 'super_admin' | 'metrics_viewer'
  avatar: string          // Firebase Storage URL or empty string
  phone: string
  clinicId: string | null // only for veterinary and clinic_admin roles
  emergencyContact: { name: string, phone: string } | null
  createdAt: Timestamp
  updatedAt: Timestamp

/clinics/{clinicId}
  name: string
  address: string
  phone: string
  email: string
  adminUid: string        // UID of the clinic_admin user
  staffUids: string[]     // array of veterinary UIDs
  createdAt: Timestamp

/pets/{petId}
  slug: string            // unique, URL-friendly, e.g. "bobby-x8k9m2"
  name: string
  species: string
  breed: string
  age: number
  weight: string
  photoURL: string        // Firebase Storage URL
  ownerId: string         // Auth UID
  status: 'safe' | 'lost'
  compliance: number      // 0–100
  createdAt: Timestamp
  updatedAt: Timestamp

/pets/{petId}/logs/{logId}
  type: 'Vacuna' | 'Control' | 'Desparasitación' | 'Cirugía' | 'Nota'
  content: string
  authorId: string
  authorName: string
  authorRole: string
  isOfficial: boolean     // true if written by veterinary or clinic_admin
  date: string            // 'YYYY-MM-DD'
  createdAt: Timestamp

/pets/{petId}/events/{eventId}
  type: string
  description: string
  dueDate: string         // 'YYYY-MM-DD'
  providerId: string
  providerName: string
  status: 'pending' | 'done' | 'overdue'
  createdAt: Timestamp

/qrCodes/{qrId}
  slug: string            // e.g. "X8K9M2"
  status: 'orphan' | 'claimed'
  petId: string | null
  createdAt: Timestamp
  claimedAt: Timestamp | null

/campaigns/{campaignId}
  title: string
  description: string
  imageURL: string
  partnerId: string
  partnerName: string
  targetCompliance: number  // default: 100
  active: boolean
  stats: { reach: number, redeemed: number }
  createdAt: Timestamp

/scans/{scanId}
  petId: string
  petSlug: string
  timestamp: Timestamp
  location: { lat: number | null, lng: number | null, address: string | null }
  reporterName: string | null
  reporterPhone: string | null
  type: 'normal' | 'emergency'
```

---

## STEP 4 — UTILITY FUNCTIONS

### 4.1 Create `src/utils/slug.js`

```javascript
/**
 * Generates a unique, URL-safe slug for a pet profile.
 * Strips accents, converts to lowercase, appends a random 6-char ID.
 */
export const generateSlug = (name) => {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const randomId = Math.random().toString(36).substring(2, 8);
  return `${base}-${randomId}`;
};
```

---

## STEP 5 — SERVICE LAYER

Create the folder `src/services/`. Each file is a pure ES6 module — no React
imports, no hooks. All Firebase interactions live here and nowhere else.

### 5.1 Create `src/services/auth.service.js`

```javascript
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
```

### 5.2 Create `src/services/pets.service.js`

```javascript
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
```

### 5.3 Create `src/services/logs.service.js`

```javascript
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
```

### 5.4 Create `src/services/events.service.js`

```javascript
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
```

### 5.5 Create `src/services/storage.service.js`

```javascript
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
```

### 5.6 Create `src/services/scans.service.js`

```javascript
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
```

### 5.7 Create `src/services/campaigns.service.js`

```javascript
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
```

---

## STEP 6 — REACT HOOKS

Create the folder `src/hooks/`.

### 6.1 Create `src/hooks/useAuth.js`

```javascript
import { useState, useEffect } from 'react';
import { subscribeToAuthState, getUserProfile, getUserClaims } from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(undefined);   // undefined = still loading
  const [profile, setProfile] = useState(null);
  const [claims, setClaims] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        const [userProfile, userClaims] = await Promise.all([
          getUserProfile(firebaseUser.uid),
          getUserClaims(firebaseUser),
        ]);
        setUser(firebaseUser);
        setProfile(userProfile);
        setClaims(userClaims);
      } else {
        setUser(null);
        setProfile(null);
        setClaims(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const role = claims?.role || profile?.role || null;

  return {
    user,
    profile,
    claims,
    role,
    loading,
    isOwner: role === 'owner',
    isVeterinary: role === 'veterinary',
    isClinicAdmin: role === 'clinic_admin',
    isPartner: role === 'partner',
    isSuperAdmin: role === 'super_admin',
  };
};
```

### 6.2 Create `src/hooks/usePets.js`

```javascript
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
```

### 6.3 Create `src/hooks/usePetLogs.js`

```javascript
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
```

### 6.4 Create `src/hooks/useCampaigns.js`

```javascript
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
```

---

## STEP 7 — CONTEXT REFACTOR

### 7.1 Replace `src/context/AppProvider.jsx` completely

```javascript
import React from 'react';
import { ToastProvider } from '../components/ui/Toast';
import { useToast } from './ToastContext';
import { AppContext } from './Context';
import { useAuth } from '../hooks/useAuth';
import { logout as logoutService } from '../services/auth.service';

export const AppProvider = ({ children }) => (
  <ToastProvider>
    <AppProviderInternal>{children}</AppProviderInternal>
  </ToastProvider>
);

const AppProviderInternal = ({ children }) => {
  const auth = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    await logoutService();
    addToast('Sesión cerrada correctamente', 'info');
  };

  const value = {
    // Expose Firestore profile as `user` to keep existing page components compatible
    user: auth.profile,
    firebaseUser: auth.user,
    role: auth.role,
    loading: auth.loading,
    isOwner: auth.isOwner,
    isVeterinary: auth.isVeterinary,
    isClinicAdmin: auth.isClinicAdmin,
    isPartner: auth.isPartner,
    isSuperAdmin: auth.isSuperAdmin,
    addToast,
    logout: handleLogout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

### 7.2 Delete `src/data/mockData.js`

This file is no longer needed. Delete it:

```bash
rm src/data/mockData.js
```

---

## STEP 8 — NEW PAGES

### 8.1 Create `src/pages/Login.jsx`

Full login page with two tabs (Iniciar sesión / Crear cuenta), Google button,
and password reset link. Dark theme matching the existing design system
(zinc-950 background, teal-500 accent, zinc-800 borders). All text in Spanish.

Key behaviors:
- If user is already authenticated, redirect to `/dashboard`
- On successful email login → navigate to role-based route
- On successful registration → navigate to `/dashboard`
- On Google login → navigate to role-based route
- Show inline error messages in Spanish under the failing field
- Loading spinner on submit buttons while request is in flight

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../services/auth.service';
import { useApp } from '../context';
import Logo from '../components/ui/Logo';

const Login = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToast } = useApp();

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
  });

  const resolveRedirect = (role) => {
    const routes = {
      owner: '/dashboard',
      veterinary: '/veterinary',
      clinic_admin: '/veterinary',
      partner: '/partner',
      super_admin: '/dashboard',
    };
    return routes[role] || '/dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(loginForm.email, loginForm.password);
      addToast('¡Bienvenido de vuelta!', 'success');
      // Auth state observer will update profile; wait a tick for role
      setTimeout(() => navigate('/dashboard'), 300);
    } catch {
      setError('Correo o contraseña incorrectos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (registerForm.password !== registerForm.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (registerForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(registerForm);
      addToast('¡Cuenta creada! Bienvenido a Mascota Segura.', 'success');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Inicia sesión.');
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      addToast('¡Bienvenido!', 'success');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch {
      setError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Logo className="w-14 h-14 mb-4" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Mascota Segura</h1>
          <p className="text-zinc-500 text-sm mt-1">El cuidado preventivo de tu mascota</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

          {/* Tabs */}
          <div className="flex rounded-xl bg-zinc-950 p-1 mb-8 border border-zinc-800">
            {[['login', 'Iniciar sesión'], ['register', 'Crear cuenta']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  tab === key
                    ? 'bg-teal-600 text-white shadow'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-900/30 mt-2"
              >
                {loading ? 'Entrando...' : 'Iniciar sesión'}
              </button>
              <p className="text-center text-xs text-zinc-600 mt-2">
                ¿Olvidaste tu contraseña?{' '}
                <Link to="/reset-password" className="text-teal-500 hover:underline">
                  Recupérala aquí
                </Link>
              </p>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {[
                { label: 'Nombre completo', key: 'name', type: 'text', placeholder: 'Tu nombre' },
                { label: 'Correo electrónico', key: 'email', type: 'email', placeholder: 'tu@correo.com' },
                { label: 'Teléfono', key: 'phone', type: 'tel', placeholder: '+51 999 000 000' },
                { label: 'Contraseña', key: 'password', type: 'password', placeholder: 'Mínimo 6 caracteres' },
                { label: 'Confirmar contraseña', key: 'confirm', type: 'password', placeholder: 'Repite tu contraseña' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={registerForm[key]}
                    onChange={(e) => setRegisterForm({ ...registerForm, [key]: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-900/30 mt-2"
              >
                {loading ? 'Creando cuenta...' : 'Crear mi cuenta gratis'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600 font-medium">o continúa con</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 border border-zinc-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Al registrarte aceptas nuestros{' '}
          <span className="text-zinc-500">Términos y Condiciones</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

### 8.2 Create `src/pages/QROnboarding.jsx`

This page handles the flow when a user scans a physical QR tag for the first
time. The URL pattern is `/activar/:qrSlug`.

Behavior:
1. Look up the qrSlug in Firestore `/qrCodes`
2. If not found → show error in Spanish
3. If `status === 'claimed'` → redirect to `/p/{petSlug}` of the linked pet
4. If `status === 'orphan'` and user is not authenticated → save the intended
   URL in sessionStorage and redirect to `/login`
5. If authenticated → show the pet registration form (same fields as
   OwnerDashboard's addPet modal) and call `createPet(uid, data, qrSlug)` on submit
6. On success → navigate to `/dashboard`

All labels and messages in Spanish.

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useApp } from '../context';
import { createPet } from '../services/pets.service';
import { uploadPetPhoto } from '../services/storage.service';
import Logo from '../components/ui/Logo';
import { QrCode, CheckCircle, AlertTriangle } from 'lucide-react';

const QROnboarding = () => {
  const { qrSlug } = useParams();
  const navigate = useNavigate();
  const { user, firebaseUser, addToast } = useApp();

  const [qrStatus, setQrStatus] = useState('loading'); // loading | orphan | claimed | invalid
  const [linkedPetSlug, setLinkedPetSlug] = useState(null);
  const [form, setForm] = useState({ name: '', species: 'Perro', breed: '', age: '', weight: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkQR = async () => {
      const q = query(collection(db, 'qrCodes'), where('slug', '==', qrSlug.toUpperCase()), limit(1));
      const snap = await getDocs(q);
      if (snap.empty) { setQrStatus('invalid'); return; }

      const qrData = snap.docs[0].data();
      if (qrData.status === 'claimed' && qrData.petId) {
        const petSnap = await getDocs(
          query(collection(db, 'pets'), where('__name__', '==', qrData.petId), limit(1))
        );
        if (!petSnap.empty) setLinkedPetSlug(petSnap.docs[0].data().slug);
        setQrStatus('claimed');
      } else {
        setQrStatus('orphan');
        if (!user) {
          sessionStorage.setItem('returnTo', `/activar/${qrSlug}`);
          navigate('/login');
        }
      }
    };
    checkQR();
  }, [qrSlug, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setSubmitting(true);
    try {
      const petId = await createPet(firebaseUser.uid, form, qrSlug.toUpperCase());
      if (photoFile) {
        const photoURL = await uploadPetPhoto(petId, photoFile);
        const { updatePet } = await import('../services/pets.service');
        await updatePet(petId, { photoURL });
      }
      addToast(`¡${form.name} registrado! Tu placa QR ya está activa.`, 'success');
      navigate('/dashboard');
    } catch {
      addToast('Error al registrar la mascota. Intenta de nuevo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (qrStatus === 'loading') return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (qrStatus === 'invalid') return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-6">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Código QR no encontrado</h1>
      <p className="text-zinc-400">Este código no existe en el sistema. Verifica que la URL sea correcta.</p>
    </div>
  );

  if (qrStatus === 'claimed') return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-6">
      <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Esta placa ya está registrada</h1>
      <p className="text-zinc-400 mb-6">Este QR ya tiene una mascota vinculada.</p>
      {linkedPetSlug && (
        <button
          onClick={() => navigate(`/p/${linkedPetSlug}`)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl"
        >
          Ver ficha de la mascota
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-teal-500/10 rounded-full border border-teal-500/30 mb-4">
            <QrCode className="w-10 h-10 text-teal-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">¡Activa tu Placa!</h1>
          <p className="text-zinc-400 text-sm mt-2 text-center">
            Código: <span className="text-teal-400 font-mono font-bold">{qrSlug?.toUpperCase()}</span>
            <br />Registra a tu mascota para vincularla a este QR.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Nombre de la mascota', key: 'name', type: 'text', placeholder: 'Ej: Max' },
              { label: 'Especie', key: 'species', type: 'text', placeholder: 'Ej: Perro, Gato' },
              { label: 'Raza', key: 'breed', type: 'text', placeholder: 'Ej: Golden Retriever' },
              { label: 'Edad (años)', key: 'age', type: 'number', placeholder: 'Ej: 3' },
              { label: 'Peso aproximado', key: 'weight', type: 'text', placeholder: 'Ej: 12kg' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">{label}</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                Foto (opcional, máx. 2MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0] || null)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-teal-600 file:text-white file:text-xs file:font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-900/30 mt-4"
            >
              {submitting ? 'Registrando mascota...' : 'Activar Placa QR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QROnboarding;
```

### 8.3 Extract `src/pages/LandingPage.jsx`

Move the hero, features, and footer JSX from the existing `DevLogin.jsx` into
a new file `src/pages/LandingPage.jsx`. Keep all existing classes and structure.

Changes to make in the landing section:
- Replace the three role-based "Simulador" cards at the bottom with a single CTA:

```jsx
// Replace the entire "Simulador Activo" section with:
<section id="demo" className="py-24 relative">
  <div className="container mx-auto px-6 max-w-2xl relative z-10 text-center">
    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
      Empieza hoy, es gratis
    </h2>
    <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
      Crea tu cuenta, registra a tu mascota y genera tu Ficha Digital en menos de 2 minutos.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/login">
        <Button className="px-10 py-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg border-none shadow-xl shadow-teal-900/40 w-full sm:w-auto">
          Crear cuenta gratis
        </Button>
      </Link>
      <Link to="/login">
        <Button variant="ghost" className="px-10 py-5 rounded-2xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold text-lg w-full sm:w-auto border border-zinc-700">
          Ya tengo cuenta
        </Button>
      </Link>
    </div>
  </div>
</section>
```

Delete `src/pages/DevLogin.jsx` after extracting the landing content.

### 8.4 Refactor `src/pages/OwnerDashboard.jsx`

Keep all JSX identical. Replace the data layer:

```javascript
// REPLACE these imports at the top:
// OLD: const { user, pets, campaigns, addPet } = useApp();
// NEW:
import { usePets } from '../hooks/usePets';
import { useActiveCampaigns } from '../hooks/useCampaigns';
import { createPet } from '../services/pets.service';
import { uploadPetPhoto } from '../services/storage.service';
import { updatePetStatus } from '../services/pets.service';
import { addLog } from '../services/logs.service';

// Inside the component:
const { user, firebaseUser, addToast } = useApp();
const { pets, loading: petsLoading } = usePets(firebaseUser?.uid);
const { campaigns } = useActiveCampaigns();

// Replace handleAddPet:
const handleAddPet = async (e) => {
  e.preventDefault();
  try {
    const petId = await createPet(firebaseUser.uid, newPet);
    if (newPet.photoFile) {
      const photoURL = await uploadPetPhoto(petId, newPet.photoFile);
      const { updatePet } = await import('../services/pets.service');
      await updatePet(petId, { photoURL });
    }
    addToast(`${newPet.name} registrado con éxito`, 'success');
    setShowAddPetModal(false);
    setNewPet({ name: '', species: '', breed: '', age: '', weight: '', photoFile: null });
  } catch {
    addToast('Error al registrar la mascota', 'error');
  }
};

// Replace togglePetStatus:
const handleToggleStatus = async (petId, currentStatus) => {
  const newStatus = currentStatus === 'safe' ? 'lost' : 'safe';
  await updatePetStatus(petId, newStatus);
  addToast(
    newStatus === 'lost' ? '¡Modo PERDIDO activado!' : 'Mascota marcada como segura',
    newStatus === 'lost' ? 'error' : 'success'
  );
};
```

In `BitacoraModal`, replace the `addLog` call:

```javascript
import { usePetLogs } from '../hooks/usePetLogs';
import { addLog as addLogService } from '../services/logs.service';

// Inside BitacoraModal:
const { logs } = usePetLogs(pet.id);
const { user, firebaseUser } = useApp();

const handleAddNote = async (e) => {
  e.preventDefault();
  if (!newNote.trim()) return;
  await addLogService(pet.id, { type: 'Nota', content: newNote }, {
    uid: firebaseUser.uid,
    name: user.name,
    role: user.role,
  });
  setNewNote('');
};
```

### 8.5 Refactor `src/pages/PublicProfile.jsx`

```javascript
// Replace getPetBySlug usage:
import { getPetBySlug } from '../services/pets.service';
import { recordScan, getGeolocation } from '../services/scans.service';
import { getUserProfile } from '../services/auth.service';

useEffect(() => {
  const load = async () => {
    const pet = await getPetBySlug(slug);
    if (!pet) { setLoading(false); return; }

    // Fetch owner contact separately (only safe fields)
    const owner = await getUserProfile(pet.ownerId);
    setPet({
      ...pet,
      ownerContact: {
        name: pet.status === 'lost' ? owner?.name : null,
        phone: pet.status === 'lost' ? owner?.phone : null,
      },
      emergencyContact: pet.status === 'lost' ? owner?.emergencyContact : null,
    });

    // Record normal scan with geolocation
    const location = await getGeolocation();
    await recordScan({ petId: pet.id, petSlug: slug, location, type: 'normal' });
    setLoading(false);
  };
  load();
}, [slug]);

// Replace triggerEmergency in handleReport:
const handleReport = async (e) => {
  e.preventDefault();
  const location = await getGeolocation();
  await recordScan({
    petId: pet.id,
    petSlug: slug,
    location,
    type: 'emergency',
    reporter: reporterData,
  });
  setShowReportModal(false);
  addToast('¡Reporte enviado! El dueño ha sido notificado.', 'success');
};
```

### 8.6 Refactor `src/pages/VeterinaryDashboard.jsx`

```javascript
import { addLog } from '../services/logs.service';
import { addEvent } from '../services/events.service';

// Replace registerVisit:
const handleRegisterVisit = async (e) => {
  e.preventDefault();
  const author = { uid: firebaseUser.uid, name: user.name, role: user.role };

  await addLog(selectedPatient.petId || 'p1', {
    type: visitData.type,
    content: visitData.description || `${visitData.type} registrado`,
  }, author);

  if (visitData.nextDueDate) {
    await addEvent(selectedPatient.petId || 'p1', {
      type: visitData.type,
      description: `Refuerzo de ${visitData.type}`,
      dueDate: visitData.nextDueDate,
    }, author);
  }

  addToast('Atención registrada. Se programó el recordatorio automático.', 'success');
  setShowVisitModal(false);
};
```

### 8.7 Refactor `src/pages/PartnerDashboard.jsx`

```javascript
import { createCampaign } from '../services/campaigns.service';
import { usePartnerCampaigns } from '../hooks/useCampaigns';

const { campaigns } = usePartnerCampaigns(firebaseUser?.uid);

const handleCreateCampaign = async (e) => {
  e.preventDefault();
  await createCampaign(newCampaign, { uid: firebaseUser.uid, name: user.name });
  addToast('Campaña publicada con éxito', 'success');
  setShowCampaignModal(false);
};
```

---

## STEP 9 — ROUTER UPDATE

Replace `src/App.jsx` completely:

```javascript
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context';
import Layout from './components/layout/Layout';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import PublicProfile from './pages/PublicProfile';
import QROnboarding from './pages/QROnboarding';
import OwnerDashboard from './pages/OwnerDashboard';
import PartnerDashboard from './pages/PartnerDashboard';
import VeterinaryDashboard from './pages/VeterinaryDashboard';

const LoadingScreen = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useApp();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { loading } = useApp();
  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/p/:slug" element={<PublicProfile />} />
        <Route path="/activar/:qrSlug" element={<QROnboarding />} />

        {/* Protected */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['owner', 'super_admin']}>
            <OwnerDashboard />
          </PrivateRoute>
        } />
        <Route path="/veterinary" element={
          <PrivateRoute allowedRoles={['veterinary', 'clinic_admin']}>
            <VeterinaryDashboard />
          </PrivateRoute>
        } />
        <Route path="/partner" element={
          <PrivateRoute allowedRoles={['partner']}>
            <PartnerDashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
```

Update `src/components/layout/Layout.jsx` — change the logout handler to use
`useApp().logout` (already wired in the new context) and remove any remaining
references to `mockData` or role-based navigation from the old DevLogin system.

---

## STEP 10 — FIRESTORE SECURITY RULES

Replace `firestore.rules` completely:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth() { return request.auth != null; }
    function role() { return request.auth.token.role; }
    function isSuperAdmin() { return isAuth() && role() == 'super_admin'; }
    function isOwnerOf(uid) { return isAuth() && request.auth.uid == uid; }
    function isVetStaff() {
      return isAuth() && (role() == 'veterinary' || role() == 'clinic_admin');
    }
    function isPartner() { return isAuth() && role() == 'partner'; }

    match /users/{userId} {
      allow read: if isOwnerOf(userId) || isSuperAdmin() || isVetStaff();
      allow create: if isOwnerOf(userId);
      allow update: if isOwnerOf(userId)
        && !('role' in request.resource.data.diff(resource.data).affectedKeys());
      allow delete: if isSuperAdmin();
    }

    match /clinics/{clinicId} {
      allow read: if isAuth() && (
        isSuperAdmin() || resource.data.staffUids.hasAny([request.auth.uid])
      );
      allow write: if isSuperAdmin();
    }

    match /pets/{petId} {
      allow read: if true;
      allow create: if isAuth() && request.resource.data.ownerId == request.auth.uid;
      allow update: if isOwnerOf(resource.data.ownerId) || isVetStaff() || isSuperAdmin();
      allow delete: if isOwnerOf(resource.data.ownerId) || isSuperAdmin();

      match /logs/{logId} {
        allow read: if isOwnerOf(
          get(/databases/$(database)/documents/pets/$(petId)).data.ownerId
        ) || isVetStaff() || isSuperAdmin();
        allow create: if isAuth() && (
          isOwnerOf(get(/databases/$(database)/documents/pets/$(petId)).data.ownerId)
          || isVetStaff()
        );
        allow update, delete: if isSuperAdmin();
      }

      match /events/{eventId} {
        allow read: if isOwnerOf(
          get(/databases/$(database)/documents/pets/$(petId)).data.ownerId
        ) || isVetStaff() || isSuperAdmin();
        allow create, update: if isVetStaff() || isSuperAdmin();
        allow delete: if isSuperAdmin();
      }
    }

    match /qrCodes/{qrId} {
      allow read: if isAuth();
      allow write: if isSuperAdmin();
    }

    match /campaigns/{campaignId} {
      allow read: if isAuth();
      allow create: if isPartner() || isSuperAdmin();
      allow update: if (isPartner() && resource.data.partnerId == request.auth.uid)
        || isSuperAdmin();
      allow delete: if isSuperAdmin();
    }

    match /scans/{scanId} {
      allow read: if isSuperAdmin();
      allow create: if true;
      allow update, delete: if isSuperAdmin();
    }
  }
}
```

---

## STEP 11 — FIREBASE STORAGE RULES

Replace `storage.rules` completely:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /pets/{petId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
        && request.resource.size < 2 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 2 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## STEP 12 — CLOUD FUNCTIONS

### 12.1 Install function dependencies

```bash
cd functions
npm install firebase-admin firebase-functions resend
cd ..
```

### 12.2 Replace `functions/index.js` completely

```javascript
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { onRequest, onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const { Resend } = require('resend');

initializeApp();
const db = getFirestore();
const auth = getAuth();
const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
const APP_URL = 'https://pakuna-3413d.web.app';
const FROM_EMAIL = 'alertas@mascotasegura.app'; // change to a verified Resend domain

// ──────────────────────────────────────────────
// FUNCTION 1 — Record QR scan & trigger emergency alert
// ──────────────────────────────────────────────
exports.onQRScanned = onRequest(
  { secrets: [RESEND_API_KEY], cors: true, region: 'us-central1' },
  async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const { petId, petSlug, location, type = 'normal', reporterName, reporterPhone } = req.body;
    if (!petId || !petSlug) return res.status(400).json({ error: 'Faltan petId o petSlug' });

    try {
      await db.collection('scans').add({
        petId, petSlug, type,
        location: location || { lat: null, lng: null, address: null },
        reporterName: reporterName || null,
        reporterPhone: reporterPhone || null,
        timestamp: FieldValue.serverTimestamp(),
      });

      if (type === 'emergency') {
        const petDoc = await db.collection('pets').doc(petId).get();
        if (!petDoc.exists) return res.status(404).json({ error: 'Mascota no encontrada' });

        const pet = petDoc.data();
        const ownerDoc = await db.collection('users').doc(pet.ownerId).get();
        if (!ownerDoc.exists) return res.status(200).json({ ok: true });

        const owner = ownerDoc.data();
        const resend = new Resend(RESEND_API_KEY.value());

        const locationText = location?.lat
          ? `📍 Ver en mapa: https://maps.google.com/?q=${location.lat},${location.lng}`
          : location?.address
          ? `📍 Dirección reportada: ${location.address}`
          : 'Ubicación no disponible';

        await resend.emails.send({
          from: FROM_EMAIL,
          to: owner.email,
          subject: `🚨 ¡Encontraron a ${pet.name}!`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h1 style="color:#0d9488">¡${pet.name} fue encontrado!</h1>
              <p>Alguien escaneó la placa QR de <strong>${pet.name}</strong> y dejó sus datos de contacto.</p>
              <table style="border-collapse:collapse;width:100%">
                <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Samaritano</strong></td>
                    <td style="padding:8px;border:1px solid #e5e7eb">${reporterName || 'Anónimo'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Teléfono</strong></td>
                    <td style="padding:8px;border:1px solid #e5e7eb">${reporterPhone || 'No proporcionó'}</td></tr>
                <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Ubicación</strong></td>
                    <td style="padding:8px;border:1px solid #e5e7eb">${locationText}</td></tr>
              </table>
              <p style="margin-top:24px">
                <a href="${APP_URL}/dashboard" style="background:#0d9488;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
                  Ir a mi dashboard
                </a>
              </p>
            </div>
          `,
        });
      }

      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('onQRScanned error:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// ──────────────────────────────────────────────
// FUNCTION 2 — Firestore trigger: pet status changed to "lost"
// ──────────────────────────────────────────────
exports.onPetStatusChanged = onDocumentUpdated(
  { document: 'pets/{petId}', secrets: [RESEND_API_KEY], region: 'us-central1' },
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    if (before.status === after.status || after.status !== 'lost') return;

    const ownerDoc = await db.collection('users').doc(after.ownerId).get();
    if (!ownerDoc.exists) return;

    const owner = ownerDoc.data();
    const resend = new Resend(RESEND_API_KEY.value());

    await resend.emails.send({
      from: FROM_EMAIL,
      to: owner.email,
      subject: `🔴 Modo Perdido activado para ${after.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h1 style="color:#dc2626">Modo Perdido activado</h1>
          <p>Haz activado el <strong>Modo Perdido</strong> para <strong>${after.name}</strong>.</p>
          <p>La ficha pública de ${after.name} ahora muestra tu número de contacto y el de emergencia a cualquier persona que escanee la placa QR.</p>
          <p>Cuando alguien lo encuentre y escanee la placa, recibirás un correo inmediato con su información de contacto y ubicación GPS.</p>
          <p style="margin-top:24px">
            <a href="${APP_URL}/dashboard" style="background:#dc2626;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
              Ir a mi dashboard
            </a>
          </p>
          <p style="color:#6b7280;font-size:12px;margin-top:24px">
            Si encontraste a ${after.name}, desactiva el modo perdido desde tu dashboard.
          </p>
        </div>
      `,
    });
  }
);

// ──────────────────────────────────────────────
// FUNCTION 3 — Daily vaccination reminder cron (8 AM Lima time)
// ──────────────────────────────────────────────
exports.sendVaccinationReminders = onSchedule(
  { schedule: '0 8 * * *', timeZone: 'America/Lima', secrets: [RESEND_API_KEY], region: 'us-central1' },
  async () => {
    const resend = new Resend(RESEND_API_KEY.value());
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);
    const targetDate = in7Days.toISOString().split('T')[0];

    const eventsSnap = await db.collectionGroup('events')
      .where('dueDate', '==', targetDate)
      .where('status', '==', 'pending')
      .get();

    const jobs = eventsSnap.docs.map(async (eventDoc) => {
      const event = eventDoc.data();
      const petId = eventDoc.ref.parent.parent.id;

      const petDoc = await db.collection('pets').doc(petId).get();
      if (!petDoc.exists) return;
      const pet = petDoc.data();

      const ownerDoc = await db.collection('users').doc(pet.ownerId).get();
      if (!ownerDoc.exists) return;
      const owner = ownerDoc.data();

      return resend.emails.send({
        from: FROM_EMAIL,
        to: owner.email,
        subject: `⏰ ${event.type} de ${pet.name} vence en 7 días`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h1 style="color:#0d9488">Recordatorio médico para ${pet.name}</h1>
            <p>En 7 días vence: <strong>${event.type}</strong></p>
            <p>${event.description || ''}</p>
            <p><strong>Proveedor:</strong> ${event.providerName}</p>
            <p><strong>Fecha:</strong> ${targetDate}</p>
            <p style="margin-top:24px">
              <a href="${APP_URL}/dashboard" style="background:#0d9488;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
                Ver agenda de ${pet.name}
              </a>
            </p>
          </div>
        `,
      });
    });

    const results = await Promise.allSettled(jobs);
    const sent = results.filter((r) => r.status === 'fulfilled').length;
    console.log(`Recordatorios enviados: ${sent}/${eventsSnap.size}`);
  }
);

// ──────────────────────────────────────────────
// FUNCTION 4 — Assign role to user (Super Admin only)
// ──────────────────────────────────────────────
exports.setUserRole = onCall(
  { region: 'us-central1' },
  async (request) => {
    if (request.auth?.token?.role !== 'super_admin') {
      throw new HttpsError('permission-denied', 'Solo el Super Admin puede asignar roles.');
    }
    const { targetUid, role, clinicId } = request.data;
    const valid = ['owner', 'veterinary', 'clinic_admin', 'partner', 'super_admin', 'metrics_viewer'];
    if (!valid.includes(role)) throw new HttpsError('invalid-argument', 'Rol no válido.');

    const claims = { role };
    if (clinicId) claims.clinicId = clinicId;

    await auth.setCustomUserClaims(targetUid, claims);
    await db.collection('users').doc(targetUid).update({
      role,
      clinicId: clinicId || null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { success: true, message: `Rol "${role}" asignado correctamente.` };
  }
);

// ──────────────────────────────────────────────
// FUNCTION 5 — Generate QR code batch (Super Admin only)
// ──────────────────────────────────────────────
exports.generateQRBatch = onCall(
  { region: 'us-central1' },
  async (request) => {
    if (request.auth?.token?.role !== 'super_admin') {
      throw new HttpsError('permission-denied', 'Solo el Super Admin puede generar lotes de QR.');
    }
    const { quantity = 10 } = request.data;
    if (quantity > 500) throw new HttpsError('invalid-argument', 'El máximo por lote es 500.');

    const batch = db.batch();
    const slugs = [];

    for (let i = 0; i < quantity; i++) {
      const slug = Math.random().toString(36).substring(2, 8).toUpperCase();
      const ref = db.collection('qrCodes').doc();
      batch.set(ref, {
        slug,
        status: 'orphan',
        petId: null,
        createdAt: FieldValue.serverTimestamp(),
        claimedAt: null,
      });
      slugs.push(slug);
    }

    await batch.commit();
    return { success: true, quantity, slugs };
  }
);
```

---

## STEP 13 — CLEANUP

Delete files that are no longer needed:

```bash
rm -f src/data/mockData.js
rm -f src/pages/DevLogin.jsx
rm -f src/App.css
```

Verify no remaining imports reference `mockData` or `DevLogin`:

```bash
grep -r "mockData\|DevLogin" src/ && echo "⚠️ Found stale references — fix before deploying" || echo "✅ Clean"
```

---

## STEP 14 — DEPLOY

### 14.1 Deploy Firestore & Storage rules first

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 14.2 Deploy Cloud Functions

```bash
firebase deploy --only functions
```

If any function fails with a secret-related error, verify:

```bash
firebase functions:secrets:access RESEND_API_KEY
```

### 14.3 Build and deploy frontend

```bash
npm run build
firebase deploy --only hosting
```

### 14.4 Full deploy (after individual steps pass)

```bash
firebase deploy
```

---

## STEP 15 — POST-DEPLOY VERIFICATION CHECKLIST

The agent must verify each item before declaring the task complete:

| # | Check | Expected result |
|---|-------|-----------------|
| 1 | Navigate to `/` | Landing page loads, no console errors |
| 2 | Navigate to `/login` | Login form renders with Spanish labels |
| 3 | Register new account | Account created, redirected to `/dashboard` |
| 4 | Create a pet from dashboard | Pet appears in Firestore + Storage, no mock data |
| 5 | Navigate to `/p/{slug}` | Public profile renders with the correct pet |
| 6 | Toggle "Reportar Extravío" | `status: 'lost'` appears in Firestore immediately |
| 7 | Scan page with status=lost | Emergency email sent via Resend |
| 8 | Open browser DevTools | No errors, no warnings about missing env vars |
| 9 | Test Google login | OAuth popup works, profile created in Firestore |
| 10 | Run emulators locally | `firebase emulators:start` launches all services |

---

## ABSOLUTE CONSTRAINTS

1. **Every user-facing string must be in Spanish** — buttons, labels, toasts,
   emails, placeholders, error messages, page titles. No exceptions.
2. **Never modify Tailwind classNames** on existing JSX elements.
3. **Never store passwords** or raw secrets in Firestore or source code.
4. **Always use `serverTimestamp()`** for `createdAt` / `updatedAt` fields.
5. **No additional npm packages** beyond those listed in this prompt.
6. **Report exact error output** before retrying any failed step.
7. **Keep `vercel.json`** — do not delete it even though Vercel is no longer used.
8. **The public route `/p/:slug` must remain accessible without authentication.**
