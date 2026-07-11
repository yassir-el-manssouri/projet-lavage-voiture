const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretwash2026';

// Enregistrement (Uniquement pour les CLIENTS)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  // 1. Blindage des Entrées (Sécurité)
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Le nom complet est requis.' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) return res.status(400).json({ error: 'Email déjà utilisé.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Faille de sécurité (Privilege Escalation) corrigée : 
    // Le rôle est forcé à 'CLIENT' publiquement. Un admin devra changer le rôle en base manuellement
    // ou via une route protégée dédiée.
    const userRole = 'CLIENT';

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: userRole,
      },
    });

    res.status(201).json({ message: 'Utilisateur créé', user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('[API Error] POST /auth/register:', err);
    res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(400).json({ error: 'Identifiants invalides.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Identifiants invalides.' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, points: user.points },
    });
  } catch (err) {
    console.error('[API Error] POST /auth/login:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// Récupérer les infos de l'utilisateur actuel
router.get('/me', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, points: true }
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
