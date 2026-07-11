import React, { useState, useEffect } from 'react';
import { getReservations, API_URL, logout } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useToast } from '../../context/ToastContext';
import socketService from '../../services/socket';
import { motion, AnimatePresence } from 'framer-motion';
import DiagnosticModal from '../../components/dashboard/DiagnosticModal';
import PaymentModal from '../../components/dashboard/PaymentModal';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diagnosticReservation, setDiagnosticReservation] = useState(null);
  const [paymentReservation, setPaymentReservation] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const fetchData = () => {
    getReservations()
      .then(data => {
        setReservations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    const handleGlobalUpdate = (updatedRes) => {
      setReservations(prev => {
        const exists = prev.find(r => r.id === updatedRes.id);
        if (exists) {
          return prev.map(r => r.id === updatedRes.id ? updatedRes : r);
        } else {
          return [updatedRes, ...prev];
        }
      });
      
      if (updatedRes.status === 'waiting' || updatedRes.status === 'WAITING') {
        showToast(`Nouveau client : ${updatedRes.vehicle}`, "info");
      }
    };

    if (user && user.id) {
      socketService.connect(user.id);
      socketService.on('globalUpdate', handleGlobalUpdate);
    }

    return () => {
      socketService.off('globalUpdate', handleGlobalUpdate);
    };
  }, []);

  const waiting = reservations.filter(r => r.status === 'waiting' || r.status === 'WAITING');
  const inProgress = reservations.filter(r => r.status === 'in_progress' || r.status === 'IN_PROGRESS');
  const done = reservations.filter(r => r.status === 'done' || r.status === 'DONE');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const updateStatus = async (id, newStatus, paymentMethod = null, step = null) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, paymentMethod, step })
      });
      if (res.ok) {
        // CORRECTION QA : L\'API renvoie l\'objet complet, on l\'utilise pour remplacer l\'ancienne version
        const updatedReservation = await res.json();
        setReservations(prev =>
          prev.map(r => r.id === id ? updatedReservation : r)
        );
        showToast(newStatus === 'done' ? "Paiement validé ✓" : "Progression enregistrée", "success");
      } else {
        showToast("Erreur de mise à jour", "error");
      }
    } catch (e) {
      showToast("Erreur réseau", "error");
    }
  };

  const localUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentAgent = { 
    name: localUser.name || 'Agent', 
    avatar: localUser.name ? localUser.name.substring(0, 2).toUpperCase() : 'AG'
  };

  const todayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const KanbanCard = ({ reservation }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg">
          #{reservation.id.substring(0, 8)}
        </span>
        <StatusBadge status={reservation.status} />
      </div>
      <h4 className="font-black text-[#2E4057] mb-1 text-sm leading-tight">{reservation.vehicle}</h4>
      <p className="text-xs text-slate-500 mb-3 font-medium">{reservation.service}</p>
      
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-bold text-slate-500">{reservation.time}</span>
        <span className="text-xs text-slate-300">·</span>
        <span className="text-xs font-bold text-[#1A6FC4] bg-blue-50 px-2 py-0.5 rounded-full">{reservation.price} MAD</span>
      </div>

      <div className="flex flex-col gap-2">
        {(reservation.status === 'waiting' || reservation.status === 'WAITING') && (
          <button
            onClick={() => updateStatus(reservation.id, 'in_progress')}
            className="w-full text-xs font-black py-2.5 bg-[#2E4057] text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
          >
            ▶ Démarrer le lavage
          </button>
        )}
        {(reservation.status === 'in_progress' || reservation.status === 'IN_PROGRESS') && (
          <div className="flex flex-col gap-2">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-[#1A6FC4] uppercase tracking-wider">
                  {['', '🫧 Lavage', '💨 Séchage', '✨ Finition', '✓ Terminé'][reservation.step || 1]}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Étape {reservation.step || 1}/3</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1A6FC4] to-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${((reservation.step || 1) / 4) * 100}%` }}
                />
              </div>
            </div>
            {(reservation.step || 1) < 3 ? (
              <button
                onClick={() => updateStatus(reservation.id, 'in_progress', null, (reservation.step || 1) + 1)}
                className="w-full text-xs font-black py-2.5 bg-[#1A6FC4] text-white rounded-xl hover:bg-blue-600 transition-all active:scale-95 shadow-sm"
              >
                ⏭️ Étape suivante : {['', 'Séchage', 'Finition', 'Terminer'][(reservation.step || 1)]}
              </button>
            ) : (
              <button
                onClick={() => setPaymentReservation(reservation)}
                className="w-full text-xs font-black py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all active:scale-95 shadow-sm shadow-green-200"
              >
                ✓ Valider & Encaisser
              </button>
            )}
            <button
              onClick={() => setDiagnosticReservation(reservation)}
              className="w-full text-[10px] font-bold py-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
            >
              📸 Ajouter Photos Diagnostic
            </button>
          </div>
        )}
        {(reservation.status === 'done' || reservation.status === 'DONE') && (
          <div className="w-full text-xs font-black py-2.5 text-center text-green-600 bg-green-50 rounded-xl border border-green-100">
            ✓ Terminé & Encaissé
          </div>
        )}
      </div>
    </motion.div>
  );

  const kanbanCols = [
    { key: 'waiting', label: 'En attente', items: waiting, dot: 'bg-amber-400', bg: 'bg-amber-50 border-amber-100', count_bg: 'bg-amber-100 text-amber-700' },
    { key: 'in_progress', label: 'En cours', items: inProgress, dot: 'bg-[#1A6FC4] animate-pulse', bg: 'bg-blue-50 border-blue-100', count_bg: 'bg-blue-100 text-blue-700' },
    { key: 'done', label: 'Terminés', items: done, dot: 'bg-green-500', bg: 'bg-green-50 border-green-100', count_bg: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#2E4057]">
      {/* Nav */}
      <nav className="bg-[#2E4057] text-white px-6 h-20 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1A6FC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-heading font-black text-xl tracking-tighter">Auto<span className="text-[#1A6FC4]">Brillance</span></span>
            </a>
            <span className="hidden sm:flex items-center gap-2 text-sm text-slate-400 border-l border-white/10 pl-4 font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Espace Agent
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-10 h-10 bg-[#1A6FC4] text-white rounded-full flex items-center justify-center font-black text-sm shadow-md">
                  {currentAgent.avatar}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-white leading-tight">{currentAgent.name}</p>
                </div>
              </div>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Clique en dehors pour fermer */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-[#2E4057] tracking-tight">Tableau de bord Agent</h1>
            <p className="text-slate-500 font-medium capitalize">{todayStr} · Centre AutoBrillance</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-5 py-2.5">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold text-green-700">Service ouvert</span>
          </div>
        </div>

        {/* Compteurs */}
        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#1A6FC4]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'En attente', count: waiting.length, icon: '⏳', color: 'bg-white border-amber-100', text: 'text-amber-600', num: 'text-[#2E4057]' },
                { label: 'En cours', count: inProgress.length, icon: '🫧', color: 'bg-[#2E4057]', text: 'text-slate-300', num: 'text-white' },
                { label: 'Terminés', count: done.length, icon: '✅', color: 'bg-white border-green-100', text: 'text-green-600', num: 'text-[#2E4057]' },
              ].map(stat => (
                <div key={stat.label} className={`rounded-3xl border p-5 text-center shadow-sm ${stat.color}`}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-4xl font-black mb-1 ${stat.num}`}>{stat.count}</div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${stat.text}`}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Kanban */}
            <div className="grid md:grid-cols-3 gap-5">
              {kanbanCols.map(col => (
                <div key={col.key}>
                  <div className={`flex items-center justify-between mb-4 px-4 py-3 rounded-2xl border ${col.bg}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`}></div>
                      <h3 className="font-black text-[#2E4057] text-sm">{col.label}</h3>
                    </div>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${col.count_bg}`}>
                      {col.items.length}
                    </span>
                  </div>
                  <div className="space-y-3 min-h-[120px]">
                    <AnimatePresence mode="popLayout">
                      {col.items.length > 0 ? (
                        col.items.map(r => <KanbanCard key={r.id} reservation={r} />)
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium"
                        >
                          Aucun véhicule
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {diagnosticReservation && (
          <DiagnosticModal 
            reservation={diagnosticReservation}
            onClose={() => setDiagnosticReservation(null)}
            onUpdate={fetchData}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {paymentReservation && (
          <PaymentModal 
            reservation={paymentReservation}
            onClose={() => setPaymentReservation(null)}
            onConfirm={(method) => {
              updateStatus(paymentReservation.id, 'done', method);
              setPaymentReservation(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentDashboard;
