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
    slug: 'LUNA-X8K9M2',
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
    slug: 'MILO-J3R7P1',
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
    slug: 'COCO-T5N2Q8',
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
