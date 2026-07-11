const express = require('express');
const prisma = require('../prismaClient');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all vehicles for the logged-in client
router.get('/', protect, async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des véhicules.' });
  }
});

// POST create a new vehicle
router.post('/', protect, async (req, res) => {
  const { brand, model, plate, color } = req.body;
  
  // 1. Blindage des Entrées (Sécurité)
  if (!brand || typeof brand !== 'string' || brand.trim() === '') {
    return res.status(400).json({ error: 'La marque est requise.' });
  }
  if (!model || typeof model !== 'string' || model.trim() === '') {
    return res.status(400).json({ error: 'Le modèle est requis.' });
  }
  if (!plate || typeof plate !== 'string' || !/^\d{1,5}-([A-Z]|[\u0600-\u06FF])-\d{1,2}$/i.test(plate)) {
    return res.status(400).json({ error: 'Format de plaque d\'immatriculation invalide.' });
  }

  try {
    // 2. Limitation anti-abus (max 10 véhicules par client)
    const count = await prisma.vehicle.count({ where: { ownerId: req.user.id } });
    if (count >= 10) {
      return res.status(403).json({ error: 'Vous avez atteint la limite maximale de véhicules (10).' });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        brand: brand.trim(),
        model: model.trim(),
        plate: plate.toUpperCase().trim(),
        color: color ? String(color).trim() : '',
        ownerId: req.user.id
      }
    });
    res.status(201).json(vehicle);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Cette plaque d\'immatriculation est déjà enregistrée.' });
    }
    console.error('[API Error] POST /vehicles:', err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du véhicule.' });
  }
});

// DELETE a vehicle
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;
  try {
    // Check ownership
    const exists = await prisma.vehicle.findFirst({
      where: { id: parseInt(id), ownerId: req.user.id }
    });
    
    if (!exists) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }

    await prisma.vehicle.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Véhicule supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

module.exports = router;
