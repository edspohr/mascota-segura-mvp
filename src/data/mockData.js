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
    partner: {
      id: "u2",
      name: "Veterinaria Rondón",
      role: "partner",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
      address: "Av. Principal 123, Lima",
    },
    admin: {
      id: "u3",
      name: "Admin Mascota Segura",
      role: "admin",
      avatar: "https://ui-avatars.com/api/?name=Admin+Mascota",
    },
    superadmin: {
      id: "u4",
      name: "Super Admin Global",
      role: "superadmin",
      avatar:
        "https://ui-avatars.com/api/?name=Super+Admin&background=0D9488&color=fff",
    },
    staff: {
      id: "u5",
      name: "Staff Interno",
      role: "staff",
      avatar:
        "https://ui-avatars.com/api/?name=Staff+Interno&background=6366f1&color=fff",
    },
  },
  organizations: [
    {
      id: "o1",
      name: "Veterinaria Rondón",
      type: "Veterinaria",
      status: "Active",
      users: 5,
    },
    {
      id: "o2",
      name: "PetShop Lima",
      type: "PetShop",
      status: "Active",
      users: 2,
    },
    {
      id: "o3",
      name: "Refugio Patitas",
      type: "NGO",
      status: "Pending",
      users: 0,
    },
  ],
  usersList: [
    {
      id: "u1",
      name: "Betsy Cueva",
      email: "betsy@example.com",
      role: "Owner",
      status: "Active",
    },
    {
      id: "u2",
      name: "Dr. Rondón",
      email: "dr.rondon@vetrondon.com",
      role: "Partner",
      status: "Active",
    },
    {
      id: "u3",
      name: "Admin Mascota",
      email: "admin@mascotasegura.com",
      role: "Admin",
      status: "Active",
    },
  ],
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
      medicalHistory: [
        {
          id: "m1",
          date: "2023-12-10",
          type: "Vacuna",
          description: "Quíntuple (1/3)",
          veterinarian: "Veterinaria Rondón",
        },
        {
          id: "m2",
          date: "2024-01-15",
          type: "Control",
          description: "Desparasitación interna",
          veterinarian: "Veterinaria Rondón",
        },
      ],
      upcomingEvents: [
        {
          id: "e1",
          date: "2024-02-20",
          type: "Vacuna",
          description: "Refuerzo anual antirrábica",
        },
      ],
      status: "healthy", // healthy, lost, critical
    },
    {
      id: "p2",
      slug: "luna-lima-456",
      name: "Luna",
      species: "Gato",
      breed: "Mestizo",
      age: 2,
      weight: "4kg",
      ownerId: "u1",
      photo:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80",
      medicalHistory: [],
      upcomingEvents: [],
      status: "healthy",
    },
  ],
  stats: {
    qrScans: 12,
    emergencyContacts: 2,
  },
};
