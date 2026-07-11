const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateDemoData() {
  console.log('🚀 Début de la génération des données de démo...');

  // 1. Nettoyage des réservations existantes
  await prisma.reservation.deleteMany({});
  console.log('🧹 Réservations nettoyées.');

  // 2. Récupération des services et clients pour association
  const services = await prisma.service.findMany();
  const clients = await prisma.user.findMany({ where: { role: 'CLIENT' } });
  
  if (services.length === 0 || clients.length === 0) {
    console.error('❌ Erreur : Veuillez lancer le seed initial d\'abord (services et clients manquants).');
    return;
  }

  const vehicles = ['Audi A3 (1234-A-1)', 'Golf 7 (5678-B-6)', 'Mercedes GLC (9999-C-9)', 'Toyota Yaris (1122-D-7)', 'BMW X5 (0011-E-1)'];
  const statusList = ['waiting', 'waiting', 'in_progress', 'done', 'done', 'done', 'done', 'done', 'done', 'done']; // Mock distribution
  const paymentMethods = ['CASH', 'CASH', 'CARD'];
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  
  const comments = [
    'Super travail, ma voiture brille !',
    'Prestation un peu longue mais résultat impeccable.',
    'Agent très professionnel, je reviendrai.',
    'L\'intérieur est comme neuf, merci.',
    'Rapport qualité prix imbattable sur Casablanca.',
    'Un peu cher mais le soin premium en vaut la peine.',
    'Détail des jantes incroyable.'
  ];

  const photoBefore = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800';
  const photoAfter = 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800';

  // 3. Génération sur 30 jours
  const now = new Date();
  for (let i = 0; i < 60; i++) {
    const randomDayOffset = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(now.getDate() - randomDayOffset);
    const dateStr = date.toISOString().split('T')[0];

    const service = services[Math.floor(Math.random() * services.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const status = statusList[Math.floor(Math.random() * statusList.length)];
    
    // Si la date est aujourd'hui, on peut avoir du waiting/in_progress. 
    // Sinon, on force à "done".
    const finalStatus = (dateStr === now.toISOString().split('T')[0]) ? status : 'done';

    await prisma.reservation.create({
      data: {
        clientId: client.id,
        vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
        service: service.name,
        price: service.price,
        date: dateStr,
        time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
        status: finalStatus,
        paymentMethod: finalStatus === 'done' ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : null,
        rating: finalStatus === 'done' ? (Math.floor(Math.random() * 2) + 4) : null, // 4 or 5 stars
        comment: finalStatus === 'done' && Math.random() > 0.5 ? comments[Math.floor(Math.random() * comments.length)] : null,
        photoBefore: finalStatus === 'done' ? photoBefore : null,
        photoAfter: finalStatus === 'done' ? photoAfter : null
      }
    });
  }

  console.log('✅ 60 réservations de démo générées avec succès !');
}

generateDemoData()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
