const express = require('express');
const prisma = require('../prismaClient');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// GET availability (Public)
router.get('/availability', async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD
  if (!date) return res.status(400).json({ error: 'Date requise' });

  try {
    const reservations = await prisma.reservation.findMany({
      where: { 
        date,
        status: { not: 'cancelled' } 
      }
    });

    // Compter les occurrences par créneau
    const counts = {};
    reservations.forEach(r => {
      counts[r.time] = (counts[r.time] || 0) + 1;
    });

    // Un créneau est indisponible s'il y a 3 réservations (3 agents max)
    const unavailableSlots = Object.keys(counts).filter(time => counts[time] >= 3);
    
    res.json(unavailableSlots);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST trigger demo generation (Manager only)
router.post('/generate-demo', protect, authorize('MANAGER'), async (req, res) => {
  try {
    const { exec } = require('child_process');
    const path = require('path');
    
    // On lance le script de démo
    const scriptPath = path.join(__dirname, '../prisma/generate_demo.js');
    
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: 'Échec de la génération' });
      }
      res.json({ message: 'Données de démo générées !' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// GET toutes les réservations
router.get('/', protect, async (req, res) => {
  try {
    let reservations;
    
    // Si c'est un client, on ne renvoie que SES réservations
    if (req.user.role === 'CLIENT') {
      reservations = await prisma.reservation.findMany({
        where: { clientId: req.user.id },
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { name: true } } }
      });
    } else {
      // Pour les AGENTS et MANAGERS, on renvoie tout
      reservations = await prisma.reservation.findMany({
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { name: true } } }
      });
    }

    res.json(reservations);
  } catch (err) {
    console.error('[API Error] GET /reservations:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations.' });
  }
});

// POST créer une réservation (Client)
router.post('/', protect, authorize('CLIENT', 'MANAGER'), async (req, res) => {
  const { vehicle, service, date, time, price, usePoints } = req.body;
  
  // 1. Blindage des Entrées (Sécurité)
  if (!vehicle || typeof vehicle !== 'string' || vehicle.trim() === '') {
    return res.status(400).json({ error: 'Le véhicule est requis et doit être valide.' });
  }
  if (!service || typeof service !== 'string') {
    return res.status(400).json({ error: 'La prestation est requise.' });
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Format de date invalide (attendu: YYYY-MM-DD).' });
  }
  
  // Vérification des heures d'ouverture autorisées
  const ALL_TIMESLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  if (!time || !ALL_TIMESLOTS.includes(time)) {
    return res.status(400).json({ error: 'Format d\'heure invalide ou hors des heures d\'ouverture.' });
  }
  
  // Vérification des dates dans le passé côté serveur
  const selectedDate = new Date(`${date}T${time}:00`);
  if (selectedDate < new Date()) {
    return res.status(400).json({ error: 'Impossible de réserver une date ou heure dans le passé.' });
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Le prix doit être un montant valide supérieur ou égal à 0.' });
  }

  try {
    let finalPrice = price;
    let reservation;

    // 2. Zéro Bug Logique (Transaction pour protéger les points ET éviter l'overbooking)
    await prisma.$transaction(async (tx) => {
      // VÉRIFICATION DE DISPONIBILITÉ (CRITIQUE)
      const existingReservations = await tx.reservation.count({
        where: {
          date,
          time,
          status: { not: 'cancelled' }
        }
      });

      if (existingReservations >= 3) {
        throw new Error('SLOT_FULL');
      }

      if (usePoints) {
        const user = await tx.user.findUnique({ where: { id: req.user.id } });
        if (!user || user.points < 500) {
          throw new Error('INSUFFICIENT_POINTS');
        }

        await tx.user.update({
          where: { id: req.user.id },
          data: { points: { decrement: 500 } }
        });
        finalPrice = 0;
      }

      reservation = await tx.reservation.create({
        data: {
          clientId: req.user.id,
          vehicle: vehicle.trim(),
          service: service.trim(),
          date,
          time,
          price: finalPrice,
          status: 'waiting'
        }
      });
    });

    // 3. Fonctionnalités Externes (WebSockets)
    const io = req.app.get('io');
    if (io) {
      io.emit('globalUpdate', reservation);
    }

    res.status(201).json(reservation);
  } catch (err) {
    // 4. Gestion des Erreurs (Fail-safe & logs)
    console.error('[API Error] POST /reservations:', err);
    if (err.message === 'SLOT_FULL') {
      return res.status(409).json({ error: 'Ce créneau vient juste d\'être complet. Veuillez en choisir un autre.' });
    }
    if (err.message === 'INSUFFICIENT_POINTS') {
      return res.status(400).json({ error: 'Solde de points insuffisant (500 pts requis).' });
    }
    res.status(500).json({ error: 'Erreur lors de la création de la réservation.' });
  }
});

// PUT mettre à jour le statut (Agent / Manager)
router.put('/:id/status', protect, async (req, res) => {
  const { id } = req.params;
  const { status, paymentMethod, step } = req.body;

  // Validation du statut autorisé
  const VALID_STATUSES = ['waiting', 'in_progress', 'done', 'cancelled', 'WAITING', 'IN_PROGRESS', 'DONE'];
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide.' });
  }

  try {
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });

    let finalStep = step ?? reservation.step;
    
    // Auto-update step based on status if not provided
    if (status === 'in_progress' && finalStep === 0) finalStep = 1;
    if (status === 'done' || status === 'DONE') finalStep = 4;

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { 
        status: status || reservation.status, 
        paymentMethod: paymentMethod || reservation.paymentMethod,
        step: finalStep
      }
    });

    // Si terminé, ajouter les points de fidélité au client
    if (status === 'done' || status === 'DONE') {
      const client = await prisma.user.findUnique({ where: { id: reservation.clientId } });
      if (client) {
        await prisma.user.update({
          where: { id: client.id },
          data: { points: client.points + Math.round(reservation.price) }
        });
      }
    }

    // Émettre l'événement temps réel
    const io = req.app.get('io');
    if (io) {
      // On envoie au client spécifique (via son userId comme room name)
      io.to(updatedReservation.clientId.toString()).emit('reservationUpdated', updatedReservation);
      // On envoie aussi aux agents/managers pour mettre à jour leurs kanban
      io.emit('globalUpdate', updatedReservation);
    }

    res.json(updatedReservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut.' });
  }
});

// PUT soumettre un avis (Client)
router.put('/:id/feedback', protect, authorize('CLIENT'), async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body; // rating: 1-5, comment: string

  try {
    // Vérifier que la réservation appartient au client et est terminée
    const reservation = await prisma.reservation.findFirst({
      where: { id, clientId: req.user.id }
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée.' });
    }

    if (reservation.status !== 'done' && reservation.status !== 'DONE') {
      return res.status(400).json({ error: 'Vous ne pouvez noter qu\'une prestation terminée.' });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { 
        rating: parseInt(rating), 
        comment 
      }
    });

    // Émettre un événement global pour que le manager voit l'avis en temps réel
    const io = req.app.get('io');
    if (io) {
      io.emit('globalUpdate', updatedReservation);
    }

    res.json(updatedReservation);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la soumission de l\'avis.' });
  }
});

// PUT ajouter des photos de diagnostic (Agent)
router.put('/:id/photos', protect, authorize('AGENT'), async (req, res) => {
  const { id } = req.params;
  const { photoBefore, photoAfter } = req.body;

  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { 
        photoBefore, 
        photoAfter 
      }
    });

    // Notifier le client en temps réel
    const io = req.app.get('io');
    if (io) {
      io.to(updatedReservation.clientId.toString()).emit('reservationUpdated', updatedReservation);
    }

    res.json(updatedReservation);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout des photos.' });
  }
});

module.exports = router;
