export const mockData = {
  users: {
    owner: {
      id: "u1",
      name: "Betsy Cueva",
      role: "owner",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      phone: "+51 987 654 321",
      emergencyContact: {
        name: "Jorge Perez (Hermano)",
        phone: "+51 999 111 222",
      },
    },
    veterinary: {
      id: "u2",
      name: "Veterinaria Rondón",
      role: "veterinary",
      avatar:
        "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=150&q=80",
      address: "Av. Principal 123, Lima",
    },
    partner: {
      id: "u3",
      name: "Purina Partners",
      role: "partner",
      avatar:
        "https://ui-avatars.com/api/?name=Purina&background=0D9488&color=fff",
    },
  },
  pets: [
    {
      id: "p1",
      slug: "bobby-lima-123",
      name: "Bobby",
      species: "Perro",
      breed: "Golden Retriever",
      age: 3,
      weight: "28kg",
      ownerId: "u1",
      photo:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80",
      logs: [
        {
          id: "l1",
          date: "2023-12-10",
          type: "Vacuna",
          content: "Aplicación vacuna Quíntuple (1/3)",
          authorRole: "veterinary",
          authorName: "Veterinaria Rondón",
        },
        {
          id: "l2",
          date: "2024-01-15",
          type: "Control",
          content: "Desparasitación interna. Todo en orden, peso ideal.",
          authorRole: "veterinary",
          authorName: "Veterinaria Rondón",
        },
        {
          id: "l3",
          date: "2024-02-05",
          type: "Nota",
          content:
            "Bobby estuvo jugando en el parque y se raspó un poco la patita. Lo limpié con suero.",
          authorRole: "owner",
          authorName: "Betsy Cueva",
        },
      ],
      upcomingEvents: [
        {
          id: "e1",
          date: "2024-03-20",
          type: "Vacuna",
          description: "Refuerzo anual antirrábica",
          provider: "Veterinaria Rondón",
        },
      ],
      status: "safe", // safe, lost, critical
    },
  ],
  campaigns: [
    {
      id: "c1",
      title: "20% DSCTO en Pro Plan",
      description: "Por mantener las vacunas de Bobby al día.",
      partner: "Purina",
      redeemed: 142,
      reach: 530,
      active: true,
      image:
        "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "c2",
      title: "Antipulgas Bravecto",
      description: "Protección 12 semanas al precio de 8.",
      partner: "Bravecto",
      redeemed: 89,
      reach: 300,
      active: true,
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=300&q=80",
    },
  ],
  stats: {
    qrScans: 12,
    emergencyContacts: 2,
  },
  veterinaryData: {
    retentionRate: 85,
    upcomingReminders: 42,
    recentPatients: [
      {
        id: "rp1",
        petName: "Bobby",
        ownerName: "Betsy Cueva",
        lastVisit: "2024-01-15",
        nextDue: "2024-03-20",
        status: "pending",
      },
      {
        id: "rp2",
        petName: "Luna",
        ownerName: "Carlos Ruiz",
        lastVisit: "2023-11-05",
        nextDue: "2024-02-05",
        status: "overdue",
      },
      {
        id: "rp3",
        petName: "Max",
        ownerName: "Ana Soto",
        lastVisit: "2024-02-10",
        nextDue: "2024-05-10",
        status: "ok",
      },
    ],
  },
  partnerData: {
    activeCampaigns: 2,
    totalRedeemed: 231,
    totalVisibility: 830,
  },
};
