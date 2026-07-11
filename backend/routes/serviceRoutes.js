const express = require('express');
const prisma = require('../prismaClient');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all active services (Public)
router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des services.' });
  }
});

// POST create a service (Manager)
router.post('/', protect, authorize('MANAGER'), async (req, res) => {
  const { name, description, price, duration, icon } = req.body;
  try {
    const service = await prisma.service.create({
      data: { name, description, price: parseInt(price), duration, icon }
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du service.' });
  }
});

// PUT update a service (Manager)
router.put('/:id', protect, authorize('MANAGER'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration, icon, isActive } = req.body;
  try {
    const service = await prisma.service.update({
      where: { id: parseInt(id) },
      data: { 
        name, 
        description, 
        price: price ? parseInt(price) : undefined, 
        duration, 
        icon, 
        isActive 
      }
    });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// DELETE a service (Manager)
router.delete('/:id', protect, authorize('MANAGER'), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.service.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Service supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

module.exports = router;
