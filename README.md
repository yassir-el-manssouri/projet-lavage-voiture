# AutoBrillance — Système de Gestion de Centre de Lavage Automobile

## 📋 Fonctionnalités conformes au CDC
- ✅ Réservation en ligne avec vérification de disponibilité
- ✅ 4 formules : Express (15 min / 60 MAD), Standard (30 min / 120 MAD), Premium (60 min / 250 MAD), Complet (sur devis / 800+ MAD)
- ✅ Suivi en temps réel (WebSockets)
- ✅ Système de fidélité (1 point = 1 MAD, 500 pts = lavage gratuit)
- ✅ 4 rôles : Client, Agent, Manager, Admin
- ✅ Tableau de bord client (historique, points, réservation active)
- ✅ Interface Agent (gestion des tâches, statuts, photos avant/après)
- ✅ Dashboard Manager (KPIs, CA, statistiques)
- ✅ Paiement en ligne ou sur place
- ✅ Notifications toast en temps réel
- ✅ FAQ et page Contact
- ✅ Section Programme Fidélité
- ✅ Design Mobile-First responsive

## 🚀 Installation et démarrage

### Backend
```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma db seed  # données de démo
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Comptes de démonstration
- **Client** : youssef@email.com / demo1234
- **Agent** : karim.agent@autobrillance.ma / demo1234
- **Manager** : admin@autobrillance.ma / demo1234

## 🏗️ Stack Technique
- **Frontend** : React.js + Vite + Tailwind CSS v4
- **Backend** : Node.js + Express.js + Prisma ORM
- **Base de données** : SQLite (dev) / PostgreSQL (prod)
- **Temps réel** : Socket.io
- **Auth** : JWT
---

## 👤 Auteur

- **Yassir EL MANSSOURI** - [@yassir-el-manssouri](https://github.com/yassir-el-manssouri) | [LinkedIn](https://www.linkedin.com/in/yassir-el-manssouri/)
