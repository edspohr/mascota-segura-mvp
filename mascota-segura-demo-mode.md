# DEV PREVIEW PROMPT
## Mascota Segura — Client Demo Mode

> **Scope:** Add a self-contained demo layer so the client can review every
> role and screen without Firebase credentials. This must be 100% reversible —
> all changes are wrapped in `import.meta.env.DEV` guards or a single
> `VITE_DEMO_MODE=true` flag. Zero impact on production.
>
> **Language rule:** all user-facing strings in Spanish.

---

## WHAT THIS PROMPT DOES

1. Creates a rich `mockData.js` file covering all 5 roles and all 3 QR scan cases
2. Adds a `useMockAuth` hook that simulates Firebase auth state with mock profiles
3. Adds "Dev Login" buttons to the Login page (visible only in demo mode)
4. Adds a floating role-switcher pill in the corner (visible only in demo mode)
5. Wires mock data into every dashboard so the client sees realistic content

**Nothing in this prompt modifies Firebase config, Security Rules, or Cloud
Functions. It only adds a parallel data path that activates via env flag.**

---

## STEP 1 — ENVIRONMENT FLAG

Add one line to `.env.local`:

```
VITE_DEMO_MODE=true
```

Add the production override to `.env.production` (create if it doesn't exist):

```
VITE_DEMO_MODE=false
```

Helper constant used throughout this prompt:

```javascript
// src/config/demo.js
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
```

---

## STEP 2 — MOCK DATA FILE

Create `src/data/mockData.js`:

```javascript
// ─────────────────────────────────────────────
// MOCK USERS — one per role
// ─────────────────────────────────────────────
export const MOCK_USERS = {
  owner: {
    uid: 'mock-owner-001',
    email: 'sofia@demo.com',
    name: 'Sofía Martínez',
    role: 'owner',
    phone: '+51 987 654 321',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=sofia',
    clinicId: null,
    emergencyContact: { name: 'Carlos Martínez', phone: '+51 987 000 111' },
  },
  veterinary: {
    uid: 'mock-vet-001',
    email: 'dr.torres@demo.com',
    name: 'Dr. Andrés Torres',
    role: 'veterinary',
    phone: '+51 912 345 678',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=andres',
    clinicId: 'mock-clinic-001',
    emergencyContact: null,
  },
  clinic_admin: {
    uid: 'mock-admin-001',
    email: 'admin@clinicaverde.com',
    name: 'Lucía Fernández',
    role: 'clinic_admin',
    phone: '+51 956 789 012',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=lucia',
    clinicId: 'mock-clinic-001',
    emergencyContact: null,
  },
  partner: {
    uid: 'mock-partner-001',
    email: 'ventas@petshopnatura.com',
    name: 'Miguel Salazar',
    role: 'partner',
    phone: '+51 934 567 890',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=miguel',
    clinicId: null,
    emergencyContact: null,
  },
  super_admin: {
    uid: 'mock-super-001',
    email: 'admin@mascotasegura.app',
    name: 'Admin Sistema',
    role: 'super_admin',
    phone: '+51 900 000 001',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=admin',
    clinicId: null,
    emergencyContact: null,
  },
};

// ─────────────────────────────────────────────
// MOCK PETS — 3 pets for the owner
// ─────────────────────────────────────────────
export const MOCK_PETS = [
  {
    id: 'mock-pet-001',
    slug: 'luna-x8k9m2',
    name: 'Luna',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: 3,
    weight: '28kg',
    photoURL: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg',
    ownerId: 'mock-owner-001',
    status: 'safe',
    compliance: 95,
    funFact: 'Le encanta perseguir burbujas de jabón y nunca las atrapa.',
    medicalAlerts: '',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'mock-pet-002',
    slug: 'milo-j3r7p1',
    name: 'Milo',
    species: 'Gato',
    breed: 'Siamés',
    age: 5,
    weight: '4.2kg',
    photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Siam_lilacpoint.jpg/320px-Siam_lilacpoint.jpg',
    ownerId: 'mock-owner-001',
    status: 'lost',
    compliance: 80,
    funFact: 'Sabe abrir puertas con manija. Literalmente.',
    medicalAlerts: 'Alérgico a ibuprofeno. Toma enalapril 2.5mg cada 12h.',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'mock-pet-003',
    slug: 'coco-t5n2q8',
    name: 'Coco',
    species: 'Perro',
    breed: 'Beagle',
    age: 1,
    weight: '9kg',
    photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Beagle_puppy_6_weeks.jpg/320px-Beagle_puppy_6_weeks.jpg',
    ownerId: 'mock-owner-001',
    status: 'safe',
    compliance: 100,
    funFact: 'Tiene miedo a las bolsas de plástico pero no a los fuegos artificiales.',
    medicalAlerts: '',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
  },
];

// ─────────────────────────────────────────────
// MOCK LOGS — bitácora for Luna
// ─────────────────────────────────────────────
export const MOCK_LOGS = {
  'mock-pet-001': [
    {
      id: 'log-001',
      type: 'Vacuna',
      content: 'Vacuna antirrábica anual aplicada. Sin reacción adversa. Próxima dosis: enero 2026.',
      authorId: 'mock-vet-001',
      authorName: 'Dr. Andrés Torres',
      authorRole: 'veterinary',
      isOfficial: true,
      date: '2025-01-10',
    },
    {
      id: 'log-002',
      type: 'Control',
      content: 'Control de rutina. Peso: 28kg. Dientes en buen estado. Se recomienda limpieza dental en 6 meses.',
      authorId: 'mock-vet-001',
      authorName: 'Dr. Andrés Torres',
      authorRole: 'veterinary',
      isOfficial: true,
      date: '2024-11-20',
    },
    {
      id: 'log-003',
      type: 'Nota',
      content: 'Hoy estuvo muy activa en el parque. Comió bien.',
      authorId: 'mock-owner-001',
      authorName: 'Sofía Martínez',
      authorRole: 'owner',
      isOfficial: false,
      date: '2024-12-05',
    },
    {
      id: 'log-004',
      type: 'Desparasitación',
      content: 'Desparasitación interna y externa completada. Producto: Nexgard + Milbemax.',
      authorId: 'mock-vet-001',
      authorName: 'Dr. Andrés Torres',
      authorRole: 'veterinary',
      isOfficial: true,
      date: '2024-09-14',
    },
  ],
  'mock-pet-002': [
    {
      id: 'log-005',
      type: 'Vacuna',
      content: 'Triple felina aplicada. Se requiere refuerzo en 3 semanas.',
      authorId: 'mock-vet-001',
      authorName: 'Dr. Andrés Torres',
      authorRole: 'veterinary',
      isOfficial: true,
      date: '2025-01-28',
    },
    {
      id: 'log-006',
      type: 'Nota',
      content: 'Se escapó por la ventana del segundo piso. Está bien pero hay que revisar los mosquiteros.',
      authorId: 'mock-owner-001',
      authorName: 'Sofía Martínez',
      authorRole: 'owner',
      isOfficial: false,
      date: '2025-02-01',
    },
  ],
};

// ─────────────────────────────────────────────
// MOCK EVENTS — upcoming appointments
// ─────────────────────────────────────────────
export const MOCK_EVENTS = {
  'mock-pet-001': [
    {
      id: 'evt-001',
      type: 'Vacuna',
      description: 'Refuerzo vacuna antirrábica anual',
      dueDate: '2026-01-10',
      providerId: 'mock-clinic-001',
      providerName: 'Clínica Veterinaria Verde',
      status: 'pending',
    },
    {
      id: 'evt-002',
      type: 'Control',
      description: 'Limpieza dental recomendada por Dr. Torres',
      dueDate: '2025-05-20',
      providerId: 'mock-clinic-001',
      providerName: 'Clínica Veterinaria Verde',
      status: 'pending',
    },
  ],
  'mock-pet-003': [
    {
      id: 'evt-003',
      type: 'Vacuna',
      description: 'Primera vacuna polivalente canina',
      dueDate: '2025-04-05',
      providerId: 'mock-clinic-001',
      providerName: 'Clínica Veterinaria Verde',
      status: 'pending',
    },
  ],
};

// ─────────────────────────────────────────────
// MOCK CAMPAIGNS — for partner dashboard
// ─────────────────────────────────────────────
export const MOCK_CAMPAIGNS = [
  {
    id: 'camp-001',
    title: '20% en alimento premium para mascotas vacunadas',
    description: 'Muestra el perfil digital de tu mascota con 100% de vacunas al día y obtén 20% de descuento en toda la línea Royal Canin.',
    imageURL: 'https://placehold.co/400x200/0d9488/white?text=Royal+Canin+20%25+OFF',
    partnerId: 'mock-partner-001',
    partnerName: 'PetShop Natura',
    targetCompliance: 100,
    active: true,
    stats: { reach: 234, redeemed: 47 },
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'camp-002',
    title: 'Baño y corte gratis en tu primer visita',
    description: 'Registra a tu mascota en Mascota Segura y recibe un baño + corte gratis en cualquiera de nuestras sucursales.',
    imageURL: 'https://placehold.co/400x200/7c3aed/white?text=Ba%C3%B1o+Gratis',
    partnerId: 'mock-partner-001',
    partnerName: 'PetShop Natura',
    targetCompliance: 80,
    active: true,
    stats: { reach: 189, redeemed: 31 },
    createdAt: new Date('2025-02-01'),
  },
];

// ─────────────────────────────────────────────
// MOCK PATIENTS — for vet/clinic_admin dashboard
// ─────────────────────────────────────────────
export const MOCK_PATIENTS = [
  {
    id: 'patient-001',
    petId: 'mock-pet-001',
    petName: 'Luna',
    petSpecies: 'Perro',
    petBreed: 'Golden Retriever',
    petAge: 3,
    petPhotoURL: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1094.jpg',
    ownerName: 'Sofía Martínez',
    ownerPhone: '+51 987 654 321',
    ownerDni: '72345678',
    lastVisit: '2025-01-10',
    compliance: 95,
  },
  {
    id: 'patient-002',
    petId: 'mock-pet-002',
    petName: 'Milo',
    petSpecies: 'Gato',
    petBreed: 'Siamés',
    petAge: 5,
    petPhotoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Siam_lilacpoint.jpg/320px-Siam_lilacpoint.jpg',
    ownerName: 'Sofía Martínez',
    ownerPhone: '+51 987 654 321',
    ownerDni: '72345678',
    lastVisit: '2025-01-28',
    compliance: 80,
  },
  {
    id: 'patient-003',
    petId: 'mock-pet-004',
    petName: 'Thor',
    petSpecies: 'Perro',
    petBreed: 'Labrador',
    petAge: 7,
    petPhotoURL: 'https://images.dog.ceo/breeds/labrador/n02099712_7936.jpg',
    ownerName: 'Roberto Quispe',
    ownerPhone: '+51 945 123 456',
    ownerDni: '43210987',
    lastVisit: '2024-12-18',
    compliance: 60,
  },
  {
    id: 'patient-004',
    petId: 'mock-pet-005',
    petName: 'Nala',
    petSpecies: 'Gato',
    petBreed: 'Persa',
    petAge: 2,
    petPhotoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Gatto_europeo4.jpg/320px-Gatto_europeo4.jpg',
    ownerName: 'Camila Rivas',
    ownerPhone: '+51 967 890 123',
    ownerDni: '56789012',
    lastVisit: '2025-02-10',
    compliance: 100,
  },
];

// ─────────────────────────────────────────────
// MOCK QR CODES — for super admin
// ─────────────────────────────────────────────
export const MOCK_QR_CODES = [
  { id: 'qr-001', slug: 'X8K9M2', status: 'claimed', petId: 'mock-pet-001' },
  { id: 'qr-002', slug: 'J3R7P1', status: 'claimed', petId: 'mock-pet-002' },
  { id: 'qr-003', slug: 'T5N2Q8', status: 'claimed', petId: 'mock-pet-003' },
  { id: 'qr-004', slug: 'F9L4W6', status: 'orphan', petId: null },
  { id: 'qr-005', slug: 'R2M8K5', status: 'orphan', petId: null },
  { id: 'qr-006', slug: 'P7H1D3', status: 'orphan', petId: null },
];

// ─────────────────────────────────────────────
// DEV LOGIN CONFIG — displayed on Login page
// ─────────────────────────────────────────────
export const DEV_LOGIN_ROLES = [
  {
    role: 'owner',
    label: 'Dueño de Mascota',
    description: 'Sofía · 3 mascotas (Luna, Milo en modo perdido, Coco)',
    emoji: '🐾',
    color: 'teal',
  },
  {
    role: 'veterinary',
    label: 'Veterinario',
    description: 'Dr. Torres · Clínica Veterinaria Verde · 4 pacientes',
    emoji: '🩺',
    color: 'blue',
  },
  {
    role: 'clinic_admin',
    label: 'Admin de Clínica',
    description: 'Lucía · Gestión de staff y reportes',
    emoji: '🏥',
    color: 'violet',
  },
  {
    role: 'partner',
    label: 'Partner / Comercio',
    description: 'Miguel · PetShop Natura · 2 campañas activas',
    emoji: '🏪',
    color: 'amber',
  },
  {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Gestión global · QR codes · Roles',
    emoji: '⚙️',
    color: 'red',
  },
];
```

---

## STEP 3 — MOCK AUTH HOOK

Create `src/hooks/useMockAuth.js`:

```javascript
import { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';

// Persists mock session across hot-reloads via sessionStorage
const STORAGE_KEY = 'mascota_segura_demo_role';

const getInitialRole = () => sessionStorage.getItem(STORAGE_KEY) || null;

export const useMockAuth = () => {
  const [activeRole, setActiveRole] = useState(getInitialRole);

  const loginAs = (role) => {
    sessionStorage.setItem(STORAGE_KEY, role);
    setActiveRole(role);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setActiveRole(null);
  };

  const profile = activeRole ? MOCK_USERS[activeRole] : null;

  return {
    user: profile,
    firebaseUser: profile ? { uid: profile.uid } : null,
    profile,
    role: activeRole,
    loading: false,
    isOwner: activeRole === 'owner',
    isVeterinary: activeRole === 'veterinary',
    isClinicAdmin: activeRole === 'clinic_admin',
    isPartner: activeRole === 'partner',
    isSuperAdmin: activeRole === 'super_admin',
    loginAs,
    logout,
  };
};
```

---

## STEP 4 — WIRE MOCK AUTH INTO APP CONTEXT

Update `src/context/AppProvider.jsx` to use mock auth when `DEMO_MODE` is active.

```javascript
import React from 'react';
import { ToastProvider } from '../components/ui/Toast';
import { useToast } from './ToastContext';
import { AppContext } from './Context';
import { useAuth } from '../hooks/useAuth';
import { useMockAuth } from '../hooks/useMockAuth';
import { logout as logoutService } from '../services/auth.service';
import { DEMO_MODE } from '../config/demo';

export const AppProvider = ({ children }) => (
  <ToastProvider>
    <AppProviderInternal>{children}</AppProviderInternal>
  </ToastProvider>
);

const AppProviderInternal = ({ children }) => {
  const realAuth = useAuth();
  const mockAuth = useMockAuth();
  const { addToast } = useToast();

  // In demo mode, bypass Firebase entirely
  const auth = DEMO_MODE ? mockAuth : realAuth;

  const handleLogout = async () => {
    if (DEMO_MODE) {
      mockAuth.logout();
    } else {
      await logoutService();
    }
    addToast('Sesión cerrada correctamente', 'info');
  };

  const value = {
    user: auth.profile,
    firebaseUser: auth.firebaseUser,
    role: auth.role,
    loading: auth.loading,
    isOwner: auth.isOwner,
    isVeterinary: auth.isVeterinary,
    isClinicAdmin: auth.isClinicAdmin,
    isPartner: auth.isPartner,
    isSuperAdmin: auth.isSuperAdmin,
    addToast,
    logout: handleLogout,
    // Expose loginAs only in demo mode (used by Login page)
    demoLoginAs: DEMO_MODE ? mockAuth.loginAs : null,
    isDemo: DEMO_MODE,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

---

## STEP 5 — DEV LOGIN PANEL ON LOGIN PAGE

Update `src/pages/Login.jsx` to render the dev panel when `DEMO_MODE` is true.

Add the following import at the top of `Login.jsx`:

```javascript
import { DEMO_MODE } from '../config/demo';
import { DEV_LOGIN_ROLES } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
```

Add this component at the bottom of `Login.jsx` (before the default export):

```javascript
const colorMap = {
  teal:   { bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   text: 'text-teal-300',   hover: 'hover:bg-teal-500/20'   },
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-300',   hover: 'hover:bg-blue-500/20'   },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-300', hover: 'hover:bg-violet-500/20' },
  amber:  { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-300',  hover: 'hover:bg-amber-500/20'  },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-300',    hover: 'hover:bg-red-500/20'    },
};

const roleRoutes = {
  owner: '/dashboard',
  veterinary: '/veterinary',
  clinic_admin: '/veterinary',
  partner: '/partner',
  super_admin: '/dashboard',
};

export const DevLoginPanel = () => {
  const { demoLoginAs, addToast } = useApp();
  const navigate = useNavigate();

  const handleDevLogin = (role) => {
    demoLoginAs(role);
    addToast(`Sesión demo: ${role}`, 'success');
    navigate(roleRoutes[role]);
  };

  return (
    <div className="w-full max-w-md mt-6">
      {/* Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2
                         bg-zinc-900 border border-zinc-700 rounded-full py-1">
          🛠 Acceso Demo
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Role buttons */}
      <div className="flex flex-col gap-2">
        {DEV_LOGIN_ROLES.map(({ role, label, description, emoji, color }) => {
          const c = colorMap[color];
          return (
            <button
              key={role}
              onClick={() => handleDevLogin(role)}
              className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border
                          ${c.bg} ${c.border} ${c.hover} transition-all text-left`}
            >
              <span className="text-2xl flex-shrink-0">{emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${c.text}`}>{label}</p>
                <p className="text-zinc-500 text-xs mt-0.5 truncate">{description}</p>
              </div>
              <svg className="w-4 h-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-700 mt-4">
        Modo demo activo — no se requiere cuenta real
      </p>
    </div>
  );
};
```

Inside the `Login` component's return, add the panel at the very bottom,
after the card and before the terms paragraph:

```jsx
{/* Dev Login Panel — only in demo mode */}
{DEMO_MODE && <DevLoginPanel />}
```

---

## STEP 6 — FLOATING ROLE SWITCHER (Demo Toolbar)

Create `src/components/ui/DemoToolbar.jsx`:

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context';
import { DEMO_MODE } from '../../config/demo';
import { DEV_LOGIN_ROLES } from '../../data/mockData';

const roleRoutes = {
  owner: '/dashboard',
  veterinary: '/veterinary',
  clinic_admin: '/veterinary',
  partner: '/partner',
  super_admin: '/dashboard',
};

export const DemoToolbar = () => {
  const { role, demoLoginAs, addToast } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!DEMO_MODE || !role) return null;

  const current = DEV_LOGIN_ROLES.find(r => r.role === role);

  const switchTo = (newRole) => {
    demoLoginAs(newRole);
    addToast(`Cambiado a: ${newRole}`, 'info');
    navigate(roleRoutes[newRole]);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Role menu */}
      {open && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-2 shadow-2xl w-64">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-3 py-2">
            Cambiar perfil demo
          </p>
          {DEV_LOGIN_ROLES.map(({ role: r, label, emoji }) => (
            <button
              key={r}
              onClick={() => switchTo(r)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-colors
                         ${r === role ? 'bg-teal-500/10 text-teal-300' : 'text-zinc-300 hover:bg-zinc-800'}`}
            >
              <span className="text-lg">{emoji}</span>
              <span className="text-sm font-medium">{label}</span>
              {r === role && (
                <span className="ml-auto text-xs text-teal-500 font-bold">Activo</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Toggle pill */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full
                   px-4 py-2.5 shadow-xl hover:bg-zinc-800 transition-colors"
      >
        <span className="text-lg">{current?.emoji}</span>
        <div className="text-left">
          <p className="text-xs text-zinc-500 leading-none">Demo</p>
          <p className="text-sm font-bold text-white leading-tight">{current?.label}</p>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform ml-1 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};
```

Add `<DemoToolbar />` inside `src/components/layout/Layout.jsx`:

```javascript
import { DemoToolbar } from '../ui/DemoToolbar';
import { DEMO_MODE } from '../../config/demo';

// Inside Layout's return, after children and before closing tag:
{DEMO_MODE && <DemoToolbar />}
```

---

## STEP 7 — WIRE MOCK DATA INTO DASHBOARDS

Each dashboard must check `DEMO_MODE` and use mock data instead of
Firebase subscriptions. The pattern is the same in all cases:

```javascript
// Pattern to apply in every dashboard:
if (DEMO_MODE) {
  // Use mock data directly — no Firebase calls
} else {
  // Existing Firebase hooks (unchanged)
}
```

### 7.1 `OwnerDashboard.jsx`

```javascript
import { DEMO_MODE } from '../config/demo';
import { MOCK_PETS, MOCK_CAMPAIGNS, MOCK_LOGS } from '../data/mockData';
import { usePets } from '../hooks/usePets';
import { useActiveCampaigns } from '../hooks/useCampaigns';

// Replace pet and campaign data sources:
const { firebaseUser } = useApp();
const { pets: realPets, loading: realPetsLoading } = usePets(
  DEMO_MODE ? null : firebaseUser?.uid
);
const { campaigns: realCampaigns } = useActiveCampaigns();

const pets = DEMO_MODE ? MOCK_PETS : realPets;
const petsLoading = DEMO_MODE ? false : realPetsLoading;
const campaigns = DEMO_MODE ? MOCK_CAMPAIGNS : realCampaigns;

// Stub mutations in demo mode (show toast, no Firebase write):
const handleAddPet = async (e) => {
  e.preventDefault();
  if (DEMO_MODE) {
    addToast('Demo: mascota registrada (sin persistencia)', 'success');
    setShowAddPetModal(false);
    return;
  }
  // ... existing real implementation
};

const handleToggleStatus = async (petId, currentStatus) => {
  if (DEMO_MODE) {
    addToast('Demo: en producción esto cambiaría el estado en Firestore', 'info');
    return;
  }
  // ... existing real implementation
};
```

### 7.2 `VeterinaryDashboard.jsx`

```javascript
import { DEMO_MODE } from '../config/demo';
import { MOCK_PATIENTS, MOCK_LOGS } from '../data/mockData';

// Replace patients list:
const [patients, setPatients] = useState(DEMO_MODE ? MOCK_PATIENTS : []);
const [logs, setLogs] = useState([]);

// When a patient is selected, load their mock logs:
const handleSelectPatient = (patient) => {
  setSelectedPatient(patient);
  if (DEMO_MODE) {
    setLogs(MOCK_LOGS[patient.petId] || []);
  }
  // ... real Firestore subscription if not demo
};

// Stub the register visit mutation:
const handleRegisterVisit = async (e) => {
  e.preventDefault();
  if (DEMO_MODE) {
    addToast('Demo: visita registrada (sin persistencia)', 'success');
    setShowVisitModal(false);
    return;
  }
  // ... existing real implementation
};
```

### 7.3 `PartnerDashboard.jsx`

```javascript
import { DEMO_MODE } from '../config/demo';
import { MOCK_CAMPAIGNS } from '../data/mockData';

const { campaigns: realCampaigns } = usePartnerCampaigns(
  DEMO_MODE ? null : firebaseUser?.uid
);
const campaigns = DEMO_MODE ? MOCK_CAMPAIGNS : realCampaigns;

const handleCreateCampaign = async (e) => {
  e.preventDefault();
  if (DEMO_MODE) {
    addToast('Demo: campaña creada (sin persistencia)', 'success');
    setShowCampaignModal(false);
    return;
  }
  // ... existing real implementation
};
```

---

## STEP 8 — MOCK PUBLIC PROFILES FOR QR SCAN CASES

The public profile pages at `/p/:slug` must work in demo mode using mock data.

Update `src/pages/PublicProfile.jsx` — replace the `useEffect` data loading:

```javascript
import { DEMO_MODE } from '../config/demo';
import { MOCK_PETS, MOCK_USERS } from '../data/mockData';

useEffect(() => {
  const load = async () => {
    let petData, ownerData;

    if (DEMO_MODE) {
      // Find pet by slug in mock data
      petData = MOCK_PETS.find(p => p.slug === slug) || null;
      ownerData = petData ? MOCK_USERS.owner : null;
    } else {
      petData = await getPetBySlug(slug);
      if (petData) {
        ownerData = await getUserProfile(petData.ownerId);
        // Record passive scan (real mode only)
        const location = await getGeolocation();
        await recordScan({ petId: petData.id, petSlug: slug, location, type: 'normal' });
      }
    }

    setPet(petData);
    setOwner(ownerData);
    setLoading(false);
  };
  load();
}, [slug]);
```

Also stub the scan recording handlers in demo mode:

```javascript
const handleFoundSafe = async (e) => {
  e.preventDefault();
  if (DEMO_MODE) {
    setFoundStep('done');
    return;
  }
  // ... existing real implementation
};

const handleSendLocationWhatsApp = async () => {
  if (DEMO_MODE) {
    setReportSent(true);
    addToast('Demo: ubicación enviada al dueño (simulado)', 'success');
    return;
  }
  // ... existing real implementation
};
```

---

## STEP 9 — DEMO ROUTE SHORTCUTS

Add two demo-only routes so the client can navigate directly to each QR scan
case by URL without needing a physical QR code.

Update `src/App.jsx` — add inside `<Routes>`:

```jsx
{/* Demo shortcuts — only active in demo mode */}
{DEMO_MODE && <>
  {/* Case 1 & 2: safe pet */}
  <Route path="/demo/qr-segura" element={<PublicProfile />} />
  {/* Case 3: lost pet */}
  <Route path="/demo/qr-perdida" element={<PublicProfile />} />
</>}
```

Update `useParams` handling in `PublicProfile.jsx` to map demo routes to mock slugs:

```javascript
const { slug: rawSlug } = useParams();

// Map demo route shortcuts to mock slugs
const slug = DEMO_MODE
  ? (rawSlug === undefined
      ? (window.location.pathname.includes('perdida') ? 'milo-j3r7p1' : 'luna-x8k9m2')
      : rawSlug)
  : rawSlug;
```

This means:
- `/demo/qr-segura` → shows Luna (status: safe) → demonstrates Case 1 + Case 2
- `/demo/qr-perdida` → shows Milo (status: lost) → demonstrates Case 3

---

## STEP 10 — DEMO BANNER

Add a non-intrusive banner at the top of every page when demo mode is active.
This prevents the client from confusing the demo with the production app.

Create `src/components/ui/DemoBanner.jsx`:

```javascript
import React from 'react';
import { DEMO_MODE } from '../../config/demo';

export const DemoBanner = () => {
  if (!DEMO_MODE) return null;
  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
      <p className="text-amber-400 text-xs font-bold tracking-wide">
        🛠 MODO DEMO — Los datos son de ejemplo. Ninguna acción afecta la base de datos real.
      </p>
    </div>
  );
};
```

Add `<DemoBanner />` at the very top of `Layout.jsx`, before everything else:

```javascript
import { DemoBanner } from '../ui/DemoBanner';

// First child inside Layout's root div:
<DemoBanner />
```

---

## STEP 11 — CLEANUP GUARD

Add a pre-deploy safety check. Add this script to `package.json`:

```json
"scripts": {
  "check:demo": "grep -r 'VITE_DEMO_MODE' .env.production && echo '✅ DEMO_MODE=false in production' || echo '⚠️  Check .env.production'",
  "prebuild": "npm run check:demo"
}
```

---

## VERIFICATION CHECKLIST

| # | URL / Action | Expected |
|---|---|---|
| 1 | `/login` | Shows "Acceso Demo" section with 5 colored role buttons |
| 2 | Click "Dueño de Mascota" | Redirects to `/dashboard`, shows Luna, Milo, Coco with real photos |
| 3 | Click Milo (lost) | Red badge visible, option to deactivate lost mode |
| 4 | Click "Registrar Mascota" | Form opens, submit shows toast "Demo: mascota registrada" |
| 5 | `/demo/qr-segura` | Luna's public profile — safe mode — Case 1 view |
| 6 | Press "¿Encontraste a esta mascota?" | Form shows, submit shows "¡El dueño fue avisado!" |
| 7 | `/demo/qr-perdida` | Milo's public profile — red emergency UI — Case 3 view |
| 8 | Press "Llamar al Dueño Ahora" | `tel:` link activates (mobile) or shows phone number |
| 9 | Press "Enviar mi ubicación por WhatsApp" | `wa.me` deep link opens in new tab |
| 10 | Click "Veterinario" from demo toolbar | Redirects to `/veterinary`, shows 4 patients with photos |
| 11 | Click on patient in vet view | Shows medical log with official + owner entries |
| 12 | Click "Partner / Comercio" | Redirects to `/partner`, shows 2 active campaigns with stats |
| 13 | Demo toolbar pill visible on every page | Bottom-right corner shows current role + switch menu |
| 14 | Yellow banner visible on every page | "MODO DEMO" banner at top |
| 15 | `npm run build` | Build passes, no demo data leaks to production bundle |

---

## REVERTING DEMO MODE

To ship to production, do only two things:

1. Set `VITE_DEMO_MODE=false` in `.env.production`
2. Run `npm run build`

No code deletions needed. All demo code is gated behind `DEMO_MODE` checks
and compiles to dead code that tree-shaking removes in production builds.
```
