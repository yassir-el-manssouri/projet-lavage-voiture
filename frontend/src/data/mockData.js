// ============================================
// AutoBrillance - Données Mock (Phase 2)
// ============================================

export const SERVICES = [
  {
    id: 'express',
    name: 'Express',
    price: 60,
    duration: '15 min',
    icon: '⚡',
    description: 'Lavage extérieur rapide et efficace.',
    features: ['Lavage carrosserie', 'Nettoyage jantes', 'Séchage'],
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 120,
    duration: '30 min',
    icon: '✨',
    description: 'Intérieur/extérieur complet pour une propreté optimale.',
    features: ['Tout Express', 'Aspiration habitacle', 'Nettoyage vitres', 'Désodorisant'],
    color: 'from-secondary to-blue-700',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 250,
    duration: '60 min',
    icon: '🛡️',
    description: 'Soin minutieux avec traitement des plastiques et cuirs.',
    features: ['Tout Standard', 'Nettoyage sièges', 'Cire de finition', 'Traitement cuir'],
    color: 'from-accent to-orange-600',
  },
  {
    id: 'complet',
    name: 'Complet',
    price: 800,
    duration: 'Sur devis',
    icon: '⭐',
    description: 'Polissage et detailing intérieur approfondi. État showroom.',
    features: ['Tout Premium', 'Nettoyage moteur', 'Polissage carrosserie', 'Céramique'],
    color: 'from-primary to-gray-800',
  },
];

export const VEHICLE_TYPES = [
  { id: 'citadine', label: 'Citadine', icon: '🚗' },
  { id: 'berline', label: 'Berline', icon: '🚘' },
  { id: 'suv', label: 'SUV / 4x4', icon: '🚙' },
  { id: 'utilitaire', label: 'Utilitaire', icon: '🚐' },
];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00',
];

export const UNAVAILABLE_SLOTS = ['09:00', '10:30', '14:00', '16:30'];

// --- MOCK User ---
export const MOCK_CLIENT = {
  name: 'Youssef El Amrani',
  email: 'youssef@email.com',
  points: 340,
  nextReward: 500,
  avatar: 'YE',
};

// --- MOCK Réservations ---
export const MOCK_RESERVATIONS = [
  {
    id: 'RES-001',
    client: 'Youssef El Amrani',
    vehicle: 'Toyota Corolla · BEA-2291',
    service: 'Standard',
    date: '15 Avr 2026',
    time: '09:30',
    status: 'in_progress',
    agent: 'Karim B.',
    price: 120,
  },
  {
    id: 'RES-002',
    client: 'Sara Moussaoui',
    vehicle: 'Dacia Sandero · MA-5544',
    service: 'Express',
    date: '15 Avr 2026',
    time: '10:00',
    status: 'waiting',
    agent: null,
    price: 60,
  },
  {
    id: 'RES-003',
    client: 'Omar Tahiri',
    vehicle: 'BMW X5 · MA-1199',
    service: 'Premium',
    date: '15 Avr 2026',
    time: '10:30',
    status: 'waiting',
    agent: null,
    price: 250,
  },
  {
    id: 'RES-004',
    client: 'Fatima Zahra',
    vehicle: 'Renault Clio · BE-7732',
    service: 'Standard',
    date: '15 Avr 2026',
    time: '08:00',
    status: 'done',
    agent: 'Ahmed S.',
    price: 120,
  },
  {
    id: 'RES-005',
    client: 'Mehdi Alaoui',
    vehicle: 'Hyundai Tucson · MA-0021',
    service: 'Complet',
    date: '15 Avr 2026',
    time: '08:30',
    status: 'done',
    agent: 'Karim B.',
    price: 800,
  },
  {
    id: 'RES-006',
    client: 'Nadia Bensalah',
    vehicle: 'Peugeot 208 · MA-3345',
    service: 'Express',
    date: '14 Avr 2026',
    time: '14:30',
    status: 'done',
    agent: 'Ahmed S.',
    price: 60,
  },
];

// Historique pour le client
export const CLIENT_HISTORY = MOCK_RESERVATIONS.filter(r => r.client === 'Youssef El Amrani' || r.status === 'done').slice(0, 4);

// --- MOCK Agents ---
export const MOCK_AGENTS = [
  { id: 1, name: 'Karim Benmoussa', avatar: 'KB', status: 'active', tasks: 3, done: 2 },
  { id: 2, name: 'Ahmed Soussi', avatar: 'AS', status: 'active', tasks: 2, done: 3 },
  { id: 3, name: 'Hassan Rifai', avatar: 'HR', status: 'break', tasks: 0, done: 1 },
];

// --- KPIs Manager ---
export const MANAGER_KPIS = {
  revenue_today: 1350,
  reservations_today: 6,
  agents_active: 2,
  satisfaction: 98,
};

// Graphique Semaine (CA fictif)
export const WEEKLY_REVENUE = [
  { day: 'Lun', value: 980 },
  { day: 'Mar', value: 1200 },
  { day: 'Mer', value: 750 },
  { day: 'Jeu', value: 1450 },
  { day: 'Ven', value: 1800 },
  { day: 'Sam', value: 2100 },
  { day: 'Dim', value: 1350 },
];

export const STATUS_LABELS = {
  waiting: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  done: { label: 'Terminé', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-600', dot: 'bg-red-400' },
};
