const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  const password = await bcrypt.hash('demo1234', 10);

  // --- CLIENTS ---
  const usersData = [
    { name: 'Youssef El Amrani', email: 'youssef@email.com', role: 'CLIENT', points: 340 },
    { name: 'Sarah Bennani', email: 'sarah@email.com', role: 'CLIENT', points: 150 },
    { name: 'Omar Kadiri', email: 'omar@email.com', role: 'CLIENT', points: 80 },
    { name: 'Karim Benmoussa', email: 'karim.agent@autobrillance.ma', role: 'AGENT' },
    { name: 'Driss Mansouri', email: 'driss.agent@autobrillance.ma', role: 'AGENT' },
    { name: 'Responsable Admin', email: 'admin@autobrillance.ma', role: 'MANAGER' },
  ];

  const users = {};
  for (const u of usersData) {
    users[u.email] = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password,
        role: u.role,
        points: u.points || 0,
      },
    });
  }

  // Nettoyage des anciennes réservations pour avoir un test propre
  await prisma.reservation.deleteMany({});

  // --- RESERVATIONS ---
  const reservations = [
    {
      clientId: users['youssef@email.com'].id,
      agentId: users['karim.agent@autobrillance.ma'].id,
      vehicle: 'Toyota Corolla · BEA-2291',
      service: 'Lavage Complet',
      date: '2026-04-15',
      time: '09:00',
      status: 'in_progress',
      price: 120,
    },
    {
      clientId: users['sarah@email.com'].id,
      vehicle: 'Range Rover Evoque · W-9908',
      service: 'Lavage Express',
      date: '2026-04-15',
      time: '10:00',
      status: 'waiting',
      price: 80,
    },
    {
      clientId: users['omar@email.com'].id,
      agentId: users['driss.agent@autobrillance.ma'].id,
      vehicle: 'Mercedes Classe C · MA-7766',
      service: 'Lavage Premium',
      date: '2026-04-15',
      time: '11:00',
      status: 'done',
      price: 250,
    },
    {
      clientId: users['youssef@email.com'].id,
      vehicle: 'Dacia Sandero · MA-5544',
      service: 'Lavage Express',
      date: '2026-04-16',
      time: '14:00',
      status: 'waiting',
      price: 60,
    },
    {
      clientId: users['sarah@email.com'].id,
      agentId: users['karim.agent@autobrillance.ma'].id,
      vehicle: 'Fiat 500 · B-1122',
      service: 'Lavage Complet',
      date: '2026-04-14',
      time: '16:00',
      status: 'done',
      price: 120,
    },
  ];

  for (const res of reservations) {
    await prisma.reservation.create({ data: res });
  }

  // --- SERVICES ---
  const servicesData = [
    { 
      name: 'Express', 
      description: 'Lavage extérieur rapide et efficace.', 
      features: 'Lavage carrosserie,Nettoyage jantes,Séchage', 
      price: 60, 
      duration: '20 min', 
      icon: '⚡', 
      color: 'from-blue-400 to-blue-600' 
    },
    { 
      name: 'Standard', 
      description: 'Intérieur/extérieur complet pour une propreté optimale.', 
      features: 'Tout Express,Aspiration habitacle,Nettoyage vitres,Désodorisant', 
      price: 120, 
      duration: '45 min', 
      icon: '✨', 
      color: 'from-secondary to-blue-700', 
      popular: true 
    },
    { 
      name: 'Premium', 
      description: 'Soin minutieux avec traitement des plastiques et cuirs.', 
      features: 'Tout Standard,Nettoyage sièges,Cire de finition,Traitement cuir', 
      price: 250, 
      duration: '1h30', 
      icon: '🛡️', 
      color: 'from-accent to-orange-600' 
    },
    { 
      name: 'Complet', 
      description: 'Polissage et detailing intérieur approfondi. État showroom.', 
      features: 'Tout Premium,Nettoyage moteur,Polissage carrosserie,Céramique', 
      price: 800, 
      duration: '3h+', 
      icon: '⭐', 
      color: 'from-primary to-gray-800' 
    },
  ];

  // Nettoyer les services existants pour éviter les doublons au re-seed
  await prisma.service.deleteMany({});

  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }

  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
