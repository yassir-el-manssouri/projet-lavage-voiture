import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCall, registerCall } from '../services/api';
import { useToast } from '../context/ToastContext';

const ROLES = [
  { id: 'client', label: 'Client', icon: '👤', desc: 'Espace réservation & suivi', path: '/dashboard' },
  { id: 'agent', label: 'Agent', icon: '🔧', desc: 'Gestion des tâches du jour', path: '/agent' },
  { id: 'manager', label: 'Responsable', icon: '📊', desc: 'Tableaux de bord & KPIs', path: '/manager' },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('client');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isLogin) {
        // Inscription
        await registerCall(form.name, form.email, form.password);
        showToast("Compte créé avec succès ! Connexion en cours...", 'success');
      }
      
      // Connexion (dans tous les cas après inscription ou directement)
      const data = await loginCall(form.email, form.password);
      showToast(`Bienvenue ${data.user.name || ''} !`, 'success');
      const roleFound = ROLES.find(r => r.id.toLowerCase() === data.user.role.toLowerCase());
      
      // Si une réservation est en attente, on redirige vers /reserver
      if (sessionStorage.getItem('pendingBooking')) {
        navigate('/reserver');
      } else {
        navigate(roleFound ? roleFound.path : '/dashboard');
      }
    } catch (err) {
      // Erreur réseau (serveur injoignable)
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        showToast("Impossible de joindre le serveur. Vérifiez votre connexion.", 'error');
      } else {
        showToast(err.message || "Une erreur est survenue.", 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = {
    client: { email: 'youssef@email.com', password: '••••••••' },
    agent: { email: 'karim.agent@autobrillance.ma', password: '••••••••' },
    manager: { email: 'admin@autobrillance.ma', password: '••••••••' },
  };

  const fillDemo = () => {
    const demo = demoAccounts[selectedRole];
    setForm({ email: demo.email, password: 'demo1234' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-[#2E4057]">
      {/* Panel Gauche */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2E4057] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-[#2563EB] to-transparent transform -skew-x-12"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1A6FC4] rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <a href="/" className="flex items-center gap-2 mb-16">
            <svg className="w-8 h-8 text-[#1A6FC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="font-heading font-black text-2xl text-white">Auto<span className="text-[#1A6FC4]">Brillance</span></span>
          </a>
          <h2 className="text-4xl font-heading font-extrabold text-white mb-4 leading-tight">
            Bienvenue sur votre<br />espace personnel
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-medium">
            Gérez vos réservations, suivez vos lavages en temps réel et cumulez vos points fidélité.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '5K+', label: 'Clients' },
            { value: '98%', label: 'Satisfaction' },
            { value: '2 min', label: 'Réservation' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel Droit - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile + Retour */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <a href="/" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-[#1A6FC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="font-heading font-black text-2xl text-[#2E4057]">Auto<span className="text-[#1A6FC4]">Brillance</span></span>
            </a>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#2E4057] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Accueil
            </button>
          </div>

          {/* Bouton retour (desktop) */}
          <button
            onClick={() => navigate('/')}
            className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#2E4057] transition-colors mb-10 group"
          >
            <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            Retour à l'accueil
          </button>

          <h1 className="text-3xl font-heading font-black text-[#2E4057] mb-2 tracking-tight">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-slate-500 mb-8 font-medium">
            {isLogin ? 'Accédez à votre espace en quelques secondes' : 'Rejoignez-nous et gérez vos lavages'}
          </p>

          {/* Sélecteur de rôle (uniquement en mode connexion) */}
          {isLogin && (
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Se connecter en tant que</label>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 text-center
                    ${selectedRole === role.id ? 'border-[#1A6FC4] bg-blue-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                >
                  <span className="text-2xl">{role.icon}</span>
                  <span className={`text-xs font-bold ${selectedRole === role.id ? 'text-[#1A6FC4]' : 'text-slate-600'}`}>{role.label}</span>
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Youssef El Amrani"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#1A6FC4] focus:bg-white focus:outline-none transition-all text-[#2E4057] font-bold placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Adresse email</label>
              <input
                type="email"
                required
                placeholder="exemple@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#1A6FC4] focus:bg-white focus:outline-none transition-all text-[#2E4057] font-bold placeholder:text-slate-400 placeholder:font-medium"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-sm font-bold text-slate-700">Mot de passe</label>
                {isLogin && (
                  <a href="#" className="text-xs text-[#1A6FC4] hover:underline font-bold">Mot de passe oublié ?</a>
                )}
              </div>
              <input
                type="password"
                required
                placeholder={isLogin ? '••••••••' : 'Choisissez un mot de passe'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#1A6FC4] focus:bg-white focus:outline-none transition-all text-[#2E4057] font-bold placeholder:text-slate-400"
              />
              {!isLogin && (
                <p className="text-xs text-slate-400 mt-1.5 ml-1 font-medium">Aucune restriction — choisissez le mot de passe que vous voulez.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#2E4057] hover:bg-slate-800 text-white py-4 rounded-full font-black text-lg transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isLogin ? 'Connexion en cours...' : 'Création en cours...'}
                </span>
              ) : (isLogin ? 'Se connecter' : "S\'inscrire")}
            </button>
          </form>

          {/* Demo shortcut */}
          <div className="mt-6 text-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <button onClick={fillDemo} className="text-sm text-[#1A6FC4] hover:text-blue-800 font-bold flex items-center justify-center gap-2 w-full transition-colors">
              <span className="text-lg">⚡</span> Remplir avec le compte démo ({ROLES.find(r => r.id === selectedRole)?.label})
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[#2E4057] font-black hover:underline"
            >
              {isLogin ? "S\'inscrire maintenant" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
