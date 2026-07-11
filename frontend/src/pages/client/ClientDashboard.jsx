import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../../components/dashboard/StatusBadge';
import socketService from '../../services/socket';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { motion, AnimatePresence } from 'framer-motion';
import RatingModal from '../../components/dashboard/RatingModal';
import PhotoComparison from '../../components/dashboard/PhotoComparison';
import { notifyStatusChange } from '../../services/notifications';
import InvoiceTemplate from '../../components/dashboard/InvoiceTemplate';

const PAYMENT_LABELS = {
  CASH: { label: 'Espèces', icon: '💵' },
  CARD: { label: 'Carte bancaire', icon: '💳' },
  ONLINE: { label: 'En ligne', icon: '🌐' },
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userState, setUserState] = useState(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      id: localUser.id,
      name: localUser.name || 'Client',
      email: localUser.email || '@',
      points: localUser.points || 0,
      nextReward: 500,
      avatar: localUser.name ? localUser.name.substring(0, 2).toUpperCase() : 'C'
    };
  });

  const fetchData = async () => {
    try {
      const { getReservations, API_URL } = await import('../../services/api');
      
      const token = localStorage.getItem('token');
      if (token) {
        const userRes = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserState(prev => ({
            ...prev,
            ...userData,
            avatar: userData.name ? userData.name.substring(0, 2).toUpperCase() : 'C'
          }));
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...localUser, ...userData }));
        }
      }

      const data = await getReservations();
      
      setHistory(prevHistory => {
        const current = data.find(r => r.status === 'in_progress' || r.status === 'done');
        const prev = prevHistory.find(r => r.status === 'in_progress' || r.status === 'done');
        if (current && (!prev || prev.status !== current.status || prev.step !== current.step)) {
          notifyStatusChange(current.vehicle, current.status);
        }
        return data;
      });
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (userState.id) {
      socketService.connect(userState.id);
      const handleSocketUpdate = (data) => {
        if (data.clientId === userState.id) fetchData();
      };
      socketService.on('reservationUpdated', handleSocketUpdate);
      socketService.on('globalUpdate', handleSocketUpdate);
      return () => {
        socketService.off('reservationUpdated', handleSocketUpdate);
        socketService.off('globalUpdate', handleSocketUpdate);
        socketService.disconnect();
      };
    }
  }, [userState.id]);

  const handleLogout = () => {
    import('../../services/api').then(({ logout }) => {
      logout();
      navigate('/connexion');
    });
  };

  const user = userState;

  // Réservation active = waiting ou in_progress
  const currentReservation = history.find(r =>
    ['WAITING', 'IN_PROGRESS', 'waiting', 'in_progress'].includes(r.status)
  );

  const [ratingReservation, setRatingReservation] = useState(null);
  const [comparisonReservation, setComparisonReservation] = useState(null);
  const [invoiceReservation, setInvoiceReservation] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Historique = toutes les réservations sauf celle en cours
  const pastHistory = history
    .filter(r => currentReservation ? r.id !== currentReservation.id : true)
    .slice(0, 10);

  const statusSteps = ['waiting', 'in_progress', 'done'];
  const statusProgress = {
    waiting:     { step: 0, label: 'En attente', width: '15%' },
    in_progress: { step: 1, label: 'En cours de lavage', width: '55%' },
    done:        { step: 2, label: 'Terminé', width: '100%' },
    WAITING:     { step: 0, label: 'En attente', width: '15%' },
    IN_PROGRESS: { step: 1, label: 'En cours de lavage', width: '55%' },
    DONE:        { step: 2, label: 'Terminé', width: '100%' },
  };

  const progressPercent = currentReservation ? statusProgress[currentReservation.status]?.width : '0%';
  const loyaltyPercent = Math.min(100, Math.round((user.points / user.nextReward) * 100));

  // ---- VEHICLE STATUS CARD (affiché toujours si réservation active) ----
  const VehicleStatusCard = ({ reservation }) => {
    const isWaiting = ['waiting', 'WAITING'].includes(reservation.status);
    const isInProgress = ['in_progress', 'IN_PROGRESS'].includes(reservation.status);

    const steps = [
      { label: 'Réception', icon: '🔑', done: true },
      { label: 'Lavage', icon: '🚿', done: isInProgress && reservation.step >= 1 },
      { label: 'Séchage', icon: '💨', done: isInProgress && reservation.step >= 2 },
      { label: 'Finition', icon: '✨', done: isInProgress && reservation.step >= 3 },
      { label: 'Prêt', icon: '✅', done: false },
    ];

    return (
      <div className="mt-6 bg-white/10 rounded-2xl p-5 border border-white/10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          État du véhicule
        </p>
        <div className="flex items-center justify-between gap-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: s.done
                      ? '#22c55e'
                      : isInProgress && reservation.step === i
                      ? '#1A6FC4'
                      : isWaiting && i === 0
                      ? '#1A6FC4'
                      : 'rgba(255,255,255,0.08)',
                    scale: (isInProgress && reservation.step === i) || (isWaiting && i === 0) ? 1.15 : 1,
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base shadow"
                >
                  {s.done ? '✓' : <span className="text-white/60 text-sm">{s.icon}</span>}
                </motion.div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center leading-tight">
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: s.done ? '100%' : '0%' }}
                    transition={{ duration: 0.6 }}
                    className="h-full bg-green-500"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#2E4057]">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-[#2E4057] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-heading font-black text-2xl tracking-tighter text-[#2E4057]">
              Auto<span className="text-[#1A6FC4]">Brillance</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/reserver')}
              className="hidden sm:block bg-blue-100 text-[#1A6FC4] font-bold px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              + Nouvelle réservation
            </button>
            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="w-10 h-10 bg-[#2E4057] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {user.avatar}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-[#2E4057]">{user.name.split(' ')[0]}</span>
              </div>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 mb-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-[#2E4057]">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button onClick={() => navigate('/vehicules')} className="w-full text-left px-4 py-2 text-sm text-[#2E4057] hover:bg-slate-50 font-semibold flex items-center gap-2">
                    🚗 Mes véhicules
                  </button>
                  <div className="h-px bg-slate-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2">
                    🚪 Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isDropdownOpen && <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />}

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-[#2E4057] tracking-tight">Bonjour, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 font-medium">Bienvenue dans votre espace AutoBrillance</p>
          </div>
          <button onClick={() => navigate('/reserver')} className="sm:hidden bg-[#2E4057] text-white font-bold px-6 py-3 rounded-full text-sm shadow-lg">
            + Nouvelle réservation
          </button>
        </div>

        {/* Réservation en cours */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-[#1A6FC4] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Chargement...</p>
          </div>
        ) : currentReservation ? (
          <div className="bg-gradient-to-br from-[#2E4057] to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/10">
                  Réservation en cours
                </span>
                <h2 className="text-2xl font-heading font-black">{currentReservation.service}</h2>
                <p className="text-slate-300 text-sm mt-1">{currentReservation.vehicle}</p>
              </div>
              <StatusBadge status={currentReservation.status} />
            </div>

            {/* ÉTAT DU VÉHICULE — toujours visible */}
            <VehicleStatusCard reservation={currentReservation} />

            {/* Progression globale */}
            <div className="mt-6 mb-2 flex justify-between text-sm text-slate-300 font-medium">
              <span>Progression globale</span>
              <span className="font-bold text-blue-400">{statusProgress[currentReservation.status]?.label}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-[#1A6FC4] to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: progressPercent }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </div>

            <div className="pt-5 border-t border-white/10 flex items-center justify-between text-sm flex-wrap gap-4">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Agent assigné</span>
                <span className="text-white font-bold">{currentReservation.agent || 'En attente'}</span>
              </div>
              {currentReservation.photoBefore && currentReservation.photoAfter && (
                <button
                  onClick={() => setComparisonReservation(currentReservation)}
                  className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#1A6FC4] hover:text-white transition-all flex items-center gap-2"
                >
                  ✨ Voir le résultat
                </button>
              )}
              <div className="flex flex-col items-end">
                <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Date & Heure</span>
                <span className="text-white font-bold">{currentReservation.date} à {currentReservation.time}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 text-[#1A6FC4] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🚗</div>
            <h2 className="text-2xl font-heading font-black text-[#2E4057] mb-2">Aucune réservation active</h2>
            <p className="text-slate-500 mb-8">Votre véhicule mérite un coup d\'éclat&nbsp;?</p>
            <button onClick={() => navigate('/reserver')} className="bg-[#2E4057] text-white font-black px-8 py-3.5 rounded-full text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95">
              Réserver maintenant
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Points fidélité */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-[#1A6FC4]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="font-heading font-black text-[#2E4057] text-lg mb-6">Programme Fidélité</h3>
              <div className="text-4xl font-black text-[#1A6FC4] mb-1">
                <AnimatedCounter value={user.points} unit="pts" />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-6">
                Encore <AnimatedCounter value={Math.max(0, user.nextReward - user.points)} /> pts pour votre prochain avantage
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-[#1A6FC4] to-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${loyaltyPercent}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>0 pts</span>
                <span className="text-[#1A6FC4]">{loyaltyPercent}%</span>
                <span>{user.nextReward} pts</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="font-heading font-black text-[#2E4057] text-lg mb-6">Mes statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Lavages total', value: history.filter(r => ['done', 'DONE'].includes(r.status)).length, icon: '💧' },
                { label: 'En cours / attente', value: history.filter(r => ['waiting', 'WAITING', 'in_progress', 'IN_PROGRESS'].includes(r.status)).length, icon: '⏳' },
                { label: 'Points gagnés', value: user.points, icon: '⭐' },
                { label: 'Total réservations', value: history.length, icon: '📅' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-black text-[#2E4057]">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-heading font-black text-[#2E4057] text-lg">Historique des réservations</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full">{pastHistory.length} réservation{pastHistory.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {pastHistory.length === 0 ? (
              <div className="p-10 text-center text-slate-400 font-medium italic">
                Aucun historique disponible.
              </div>
            ) : pastHistory.map(r => {
              const isDone = ['done', 'DONE'].includes(r.status);
              const payment = r.paymentMethod ? PAYMENT_LABELS[r.paymentMethod] : null;

              return (
                <div key={r.id} className="px-8 py-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#2E4057] text-base mb-1">{r.service}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {r.vehicle} · <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{r.date} à {r.time}</span>
                    </p>
                    {/* PAIEMENT */}
                    {isDone && payment && (
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                        {payment.icon} Payé par {payment.label}
                      </span>
                    )}
                    {isDone && !payment && (
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                        💰 Paiement non renseigné
                      </span>
                    )}
                    {r.comment && (
                      <p className="text-[11px] text-slate-400 mt-2 italic bg-slate-50 border border-slate-100 p-2 rounded-lg">"{r.comment}"</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {r.photoBefore && r.photoAfter && (
                      <button
                        onClick={() => setComparisonReservation(r)}
                        className="text-xs font-bold text-[#1A6FC4] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        ✨ Photos
                      </button>
                    )}
                    {isDone && (
                      <button
                        onClick={() => {
                          setInvoiceReservation(r);
                          // Attendre 2 frames pour garantir le rendu de InvoiceTemplate
                          requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                              window.print();
                            });
                          });
                        }}
                        className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        🧾 Facture
                      </button>
                    )}
                    {r.rating ? (
                      <div className="flex items-center gap-1 text-yellow-500 text-sm font-black bg-yellow-50 px-3 py-1.5 rounded-lg">
                        {r.rating} ★
                      </div>
                    ) : isDone ? (
                      <button
                        onClick={() => setRatingReservation(r)}
                        className="text-xs font-bold text-white bg-[#2E4057] px-4 py-1.5 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
                      >
                        Donner un avis
                      </button>
                    ) : null}
                    <StatusBadge status={r.status} />
                    <span className="font-black text-[#1A6FC4] text-base">{r.price} MAD</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {ratingReservation && (
            <RatingModal
              reservation={ratingReservation}
              onClose={() => setRatingReservation(null)}
              onSuccess={fetchData}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {comparisonReservation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#2E4057]/80 backdrop-blur-md"
                onClick={() => setComparisonReservation(null)}
              />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl"
              >
                <button onClick={() => setComparisonReservation(null)} className="absolute -top-12 right-0 text-white hover:text-slate-300 flex items-center gap-2 font-bold transition-colors">
                  Fermer <span className="text-3xl font-light">×</span>
                </button>
                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-black text-[#2E4057]">Résultat de la prestation ✨</h3>
                  <p className="text-slate-500 font-medium mt-1">{comparisonReservation.vehicle} · {comparisonReservation.service}</p>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <PhotoComparison before={comparisonReservation.photoBefore} after={comparisonReservation.photoAfter} />
                </div>
                <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-sm text-center text-slate-500 font-medium">
                    Glissez le curseur central pour comparer l\'état du véhicule avant et après le lavage.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <InvoiceTemplate reservation={invoiceReservation} user={JSON.parse(localStorage.getItem('user'))} />
      </div>
    </div>
  );
};

export default ClientDashboard;
