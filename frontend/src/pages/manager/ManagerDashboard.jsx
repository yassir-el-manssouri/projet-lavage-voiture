import React, { useState, useEffect } from 'react';
import { getReservations, API_URL, logout } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { WEEKLY_REVENUE, STATUS_LABELS, MOCK_AGENTS } from '../../data/mockData';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useToast } from '../../context/ToastContext';
import socketService from '../../services/socket';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { motion, AnimatePresence } from 'framer-motion';

const ManagerDashboard = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '', icon: '🚐' });

  // --- ANALYTICS DYNAMIQUES ---
  const getWeeklyStats = () => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      return {
        dateStr: d.toISOString().split('T')[0],
        day: days[d.getDay()],
        value: 0
      };
    });

    reservations.filter(r => r.status === 'done' || r.status === 'DONE').forEach(res => {
      const resDate = res.date; // assuming ISO or YYYY-MM-DD
      const found = last7Days.find(d => resDate.includes(d.dateStr));
      if (found) found.value += res.price;
    });

    return last7Days;
  };

  const dynamicWeeklyRevenue = getWeeklyStats();
  const maxRevenue = Math.max(...dynamicWeeklyRevenue.map(d => d.value), 500);

  useEffect(() => {
    getReservations()
      .then(data => setReservations(data))
      .catch(err => console.error(err));

    import('../../services/api').then(m => m.getServices())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Setup Socket.io
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
      
      // Notification toast pour le manager
      if (updatedRes.status === 'done' || updatedRes.status === 'DONE') {
        showToast(`Encaissement terminé : ${updatedRes.price} MAD`, "success");
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

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  // Calcul des KPIs réels
  const ratedReservations = reservations.filter(r => r.rating);
  const averageRating = ratedReservations.length > 0 
    ? (ratedReservations.reduce((sum, r) => sum + r.rating, 0) / ratedReservations.length).toFixed(1)
    : 0;

  const stats = {
    revenue_today: reservations
      .filter(r => r.status === 'done' || r.status === 'DONE')
      .reduce((sum, r) => sum + r.price, 0),
    reservations_today: reservations.length,
    waiting_count: reservations.filter(r => r.status === 'waiting' || r.status === 'WAITING').length,
    satisfaction: averageRating
  };

  const filtered = filterStatus === 'all' ? reservations : reservations.filter(r => r.status === filterStatus);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedReservation = await res.json();
        setReservations(prev =>
          prev.map(r => r.id === id ? updatedReservation : r)
        );
        showToast(`Statut mis à jour : ${newStatus.toUpperCase()}`, 'success');
      } else {
        showToast("Erreur lors de la mise à jour du statut", 'error');
      }
    } catch (e) {
      showToast("Erreur réseau", 'error');
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Vue d\'ensemble' },
    { id: 'planning', label: '📅 Planning' },
    { id: 'reservations', label: '📋 Réservations' },
    { id: 'finances', label: '💰 Finances' },
    { id: 'catalog', label: '🏷️ Catalogue' },
    { id: 'feedback', label: '⭐ Avis Clients' },
    { id: 'team', label: '👥 Équipe' },
  ];

  const handleUpdatePrice = async (id, newPrice) => {
    try {
      const { updateService } = await import('../../services/api');
      await updateService(id, { price: newPrice });
      setServices(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
      showToast("Prix mis à jour", "success");
    } catch (err) {
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const handleToggleService = async (id, currentStatus) => {
    try {
      const { updateService } = await import('../../services/api');
      await updateService(id, { isActive: !currentStatus });
      setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
      showToast(currentStatus ? "Service désactivé" : "Service activé", "info");
    } catch (err) {
      showToast("Erreur", "error");
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm("Voulez-vous vraiment écraser les données et générer 60 réservations de démo ?")) return;
    try {
      const token = localStorage.getItem('token');
      showToast("Génération en cours...", "info");
      const res = await fetch(`${API_URL}/reservations/generate-demo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        showToast("Données de démo générées !", "success");
        window.location.reload();
      }
    } catch (err) {
      showToast("Erreur", "error");
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price || !newService.duration) {
      showToast("Nom, prix et durée sont requis", "error");
      return;
    }
    try {
      const { createService } = await import('../../services/api');
      const created = await createService({
        name: newService.name,
        description: newService.description,
        price: parseInt(newService.price),
        duration: newService.duration,
        icon: newService.icon || '🚐'
      });
      setServices(prev => [...prev, created]);
      showToast("Service créé avec succès !", "success");
      setShowNewServiceModal(false);
      setNewService({ name: '', description: '', price: '', duration: '', icon: '🚐' });
    } catch (err) {
      showToast(err.message || "Erreur lors de la création", "error");
    }
  };

  const exportToCSV = () => {
    const doneRes = reservations.filter(r => r.status === 'done' || r.status === 'DONE');
    
    if (doneRes.length === 0) {
      showToast("Aucune donnée à exporter", "info");
      return;
    }

    const headers = ['ID', 'Date', 'Heure', 'Client', 'Vehicule', 'Prestation', 'Mode Paiement', 'Montant (MAD)'];
    const rows = doneRes.map(r => [
      r.id,
      r.date,
      r.time,
      r.client?.name || 'Client',
      r.vehicle,
      r.service,
      r.paymentMethod || 'CASH',
      r.price
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(item => `"${item}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `autobrillance_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Export CSV réussi", "success");
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <React.Fragment>
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
              Espace Responsable
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-10 h-10 bg-[#1A6FC4] text-white rounded-full flex items-center justify-center font-black text-sm shadow-md">R</div>
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
            <h1 className="text-3xl font-heading font-black text-[#2E4057] tracking-tight">Tableau de bord</h1>
            <p className="text-slate-500 font-medium capitalize">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Centre AutoBrillance Casablanca</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${activeTab === tab.id ? 'bg-[#2E4057] text-white shadow-md' : 'text-slate-500 hover:text-[#2E4057] hover:bg-slate-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* TAB: Planning Quotidien */}
        {activeTab === 'planning' && (
          <div className="space-y-6">
             <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <h3 className="font-heading font-black text-[#2E4057]">Agenda du jour — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Capacité centre</span>
                  <div className="flex gap-1">
                     {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-green-400"></div>)}
                  </div>
                </div>
             </div>

             <div className="grid gap-4">
                {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(slot => {
                  const dayRes = reservations.filter(r => r.date === new Date().toISOString().split('T')[0] && r.time === slot && r.status !== 'cancelled');
                  return (
                    <div key={slot} className="flex gap-4">
                      <div className="w-16 pt-3 text-right">
                        <span className="text-sm font-black text-[#2E4057] font-mono">{slot}</span>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-3">
                         {dayRes.map(r => (
                           <motion.div 
                             key={r.id}
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             className="bg-white border-l-4 border-[#1A6FC4] rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                           >
                              <div className="text-xs font-bold text-[#2E4057] truncate">{r.vehicle}</div>
                              <div className="text-[10px] text-gray-400 mt-1">{r.service}</div>
                           </motion.div>
                         ))}
                         {dayRes.length < 3 && Array.from({ length: 3 - dayRes.length }).map((_, i) => (
                           <div key={`empty-${i}`} className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Libre</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {/* TAB: Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-heading font-black text-[#2E4057]">Tableau de Bord</h1>
              <button 
                onClick={handleResetDemo}
                className="text-[10px] font-bold text-slate-400 hover:text-[#2E4057] transition-colors border border-slate-200 px-3 py-1.5 rounded-full hover:border-slate-300"
              >
                🔄 Reset Données Démo
              </button>
            </div>
            
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Chiffre d'affaires"
                value={<AnimatedCounter value={stats.revenue_today} />}
                unit="MAD"
                icon="💰"
                color="bg-[#1A6FC4]"
                trend={12}
              />
              <StatCard
                label="Total Réservations"
                value={<AnimatedCounter value={stats.reservations_today} />}
                unit="total"
                icon="📅"
                color="bg-[#2E4057]"
              />
              <StatCard
                label="En attente"
                value={<AnimatedCounter value={stats.waiting_count} />}
                unit="véhicules"
                icon="🔧"
                color="bg-amber-500"
              />
              <StatCard
                label="Satisfaction"
                value={stats.satisfaction}
                unit="/ 5"
                icon="⭐"
                color="bg-yellow-400"
              />
            </div>

            {/* Graphique semaine */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-heading font-black text-[#2E4057] text-lg">Activité de la semaine</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Chiffre d'affaires quotidien (MAD)</p>
                </div>
                <span className="text-sm font-bold text-green-600 bg-green-50 border border-green-100 px-4 py-1.5 rounded-full">↑ +12% vs semaine passée</span>
              </div>
              <div className="flex items-end gap-3" style={{ height: '200px' }}>
                {dynamicWeeklyRevenue.map((day, i) => {
                  const heightPercent = (day.value / maxRevenue) * 100;
                  const isToday = i === 6;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.value > 0 ? day.value.toLocaleString() + ' MAD' : ''}
                      </span>
                      <div className="w-full flex items-end flex-1">
                        <div
                          className={`w-full rounded-t-2xl transition-all duration-700 cursor-pointer
                            ${isToday ? 'bg-gradient-to-t from-[#1A6FC4] to-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-gradient-to-t from-slate-200 to-slate-100 group-hover:from-[#1A6FC4]/30 group-hover:to-[#1A6FC4]/10'}`}
                          style={{ height: `${Math.max(heightPercent, 3)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold capitalize ${isToday ? 'text-[#1A6FC4]' : 'text-slate-400'}`}>{day.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Réservations récentes */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-heading font-black text-[#2E4057] text-lg">Réservations récentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest font-black">
                    <tr>
                      <th className="text-left px-6 py-4">ID</th>
                      <th className="text-left px-6 py-4">Véhicule</th>
                      <th className="text-left px-6 py-4">Prestation</th>
                      <th className="text-left px-6 py-4">Heure</th>
                      <th className="text-left px-6 py-4">Statut</th>
                      <th className="text-left px-6 py-4">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout">
                      {reservations.slice(0, 10).map(r => (
                        <motion.tr 
                          key={r.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-slate-400 text-[10px]">{r.id.substring(0, 8)}...</td>
                          <td className="px-6 py-4 font-black text-[#2E4057] text-sm">{r.vehicle}</td>
                          <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-50 text-[#1A6FC4] text-xs font-bold rounded-full">{r.service}</span></td>
                          <td className="px-6 py-4 text-slate-500 font-mono font-bold">{r.time}</td>
                          <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                          <td className="px-6 py-4 font-black text-[#1A6FC4]">{r.price} MAD</td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Avis Clients */}
        {activeTab === 'feedback' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {ratedReservations.length > 0 ? (
                ratedReservations.map(r => (
                  <motion.div 
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={star <= r.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">{r.date}</span>
                      </div>
                      <p className="text-gray-700 italic text-sm mb-4">"{r.comment || 'Aucun commentaire'}"</p>
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs">👤</div>
                      <div>
                        <p className="text-xs font-bold text-[#2E4057]">{r.vehicle}</p>
                        <p className="text-[10px] text-gray-400">{r.service}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium italic">Aucun avis client pour le moment.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Filtres */}
            <div className="px-8 py-5 border-b border-slate-100 flex flex-wrap gap-2 items-center justify-between">
              <h3 className="font-heading font-black text-[#2E4057] text-lg">Toutes les réservations</h3>
              <div className="flex gap-2 flex-wrap">
                {['all', 'waiting', 'in_progress', 'done'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all
                      ${filterStatus === f ? 'bg-[#2E4057] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {f === 'all' ? 'Tous' : STATUS_LABELS[f]?.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-6 py-3">ID</th>
                    <th className="text-left px-6 py-3">Client</th>
                    <th className="text-left px-6 py-3">Véhicule</th>
                    <th className="text-left px-6 py-3">Prestation</th>
                    <th className="text-left px-6 py-3">Date · Heure</th>
                    <th className="text-left px-6 py-3">Statut</th>
                    <th className="text-left px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-400 text-xs">{r.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 font-bold text-[#2E4057] text-sm">{r.client?.name || 'Inconnu'}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{r.vehicle}</td>
                      <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-50 text-[#1A6FC4] text-xs font-bold rounded-full">{r.service}</span></td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{r.date} · {r.time}</td>
                      <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {r.status === 'waiting' && (
                            <button onClick={() => updateStatus(r.id, 'in_progress')} className="text-xs bg-[#1A6FC4] text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-600 transition-colors font-bold">Démarrer</button>
                          )}
                          {r.status === 'in_progress' && (
                            <button onClick={() => updateStatus(r.id, 'done')} className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-colors">Terminer</button>
                          )}
                          {r.status !== 'cancelled' && r.status !== 'done' && (
                            <button onClick={() => updateStatus(r.id, 'cancelled')} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors">Annuler</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* TAB: Finances */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-heading font-black text-[#2E4057]">Vue Financière</h2>
              <button 
                onClick={exportToCSV} 
                className="bg-[#1A6FC4] text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>📥</span> Exporter CSV
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'CA Total (Validé)', value: `${reservations.filter(r => r.status === 'done' || r.status === 'DONE').reduce((sum, r) => sum + r.price, 0)} MAD`, color: 'bg-green-50 text-green-700' },
                { label: 'Espèces (Cash)', value: `${reservations.filter(r => (r.status === 'done' || r.status === 'DONE') && r.paymentMethod === 'CASH').reduce((sum, r) => sum + r.price, 0)} MAD`, color: 'bg-blue-50 text-blue-700' },
                { label: 'Carte Bancaire', value: `${reservations.filter(r => (r.status === 'done' || r.status === 'DONE') && r.paymentMethod === 'CARD').reduce((sum, r) => sum + r.price, 0)} MAD`, color: 'bg-blue-50 text-blue-700' },
                { label: 'Panier Moyen', value: `${(reservations.filter(r => r.status === 'done' || r.status === 'DONE').reduce((sum, r) => sum + r.price, 0) / (reservations.filter(r => r.status === 'done' || r.status === 'DONE').length || 1)).toFixed(0)} MAD`, color: 'bg-orange-50 text-orange-700' },
              ].map(stat => (
                <div key={stat.label} className={`rounded-2xl border p-6 ${stat.color}`}>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Répartition Paiements */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                <h3 className="font-heading font-black text-[#2E4057] mb-6 self-start">Modes de Paiement</h3>
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 rounded-full border-[16px] border-blue-500"></div>
                  <div className="absolute inset-0 rounded-full border-[16px] border-blue-100 border-t-transparent border-l-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-[#2E4057]">
                       {Math.round((reservations.filter(r => r.paymentMethod === 'CASH').length / (reservations.filter(r => r.paymentMethod).length || 1)) * 100)}%
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Cash <br/> Dominant</span>
                  </div>
                </div>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Cash</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-100 rounded-sm"></span> Carte</div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-heading font-black text-[#2E4057]">Transactions Récentes</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold tracking-widest">
                      <tr>
                        <th className="text-left px-6 py-3">Véhicule</th>
                        <th className="text-left px-6 py-3">Montant</th>
                        <th className="text-left px-6 py-3">Mode</th>
                        <th className="text-left px-6 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {reservations.filter(r => r.status === 'done' || r.status === 'DONE').slice(0, 8).map(r => (
                         <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="px-6 py-4">
                             <div className="font-bold text-[#2E4057]">{r.vehicle}</div>
                             <div className="text-[10px] text-gray-400">{r.service}</div>
                           </td>
                           <td className="px-6 py-4 font-black text-[#1A6FC4]">{r.price} MAD</td>
                           <td className="px-6 py-4 text-center">
                             <span className="text-xl" title={r.paymentMethod}>{r.paymentMethod === 'CASH' ? '💵' : '💳'}</span>
                           </td>
                           <td className="px-6 py-4 text-gray-500 text-xs">{r.date}</td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* TAB: Catalogue des Services */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-heading font-black text-[#2E4057]">Gestion du Catalogue</h3>
              <button onClick={() => setShowNewServiceModal(true)} className="bg-[#2E4057] text-white px-4 py-2.5 rounded-xl text-xs font-black hover:bg-slate-800 transition-all">
                + Ajouter un forfait
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-6 py-3">Forfait</th>
                    <th className="text-left px-6 py-3">Prix (MAD)</th>
                    <th className="text-left px-6 py-3">Durée</th>
                    <th className="text-left px-6 py-3">Statut</th>
                    <th className="text-left px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {services.map(s => (
                    <tr key={s.id} className={`hover:bg-gray-50/50 transition-colors ${!s.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{s.icon}</span>
                          <div>
                            <p className="font-bold text-[#2E4057]">{s.name}</p>
                            <p className="text-[10px] text-gray-400">{s.description?.substring(0, 40)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            defaultValue={s.price}
                            onBlur={(e) => {
                              const val = parseInt(e.target.value);
                              if (isNaN(val) || val < 0) {
                                e.target.value = s.price;
                                showToast("Prix invalide", "error");
                                return;
                              }
                              if (val !== s.price) handleUpdatePrice(s.id, val);
                            }}
                            className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-[#2E4057] focus:ring-2 focus:ring-[#1A6FC4] outline-none"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{s.duration}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {s.isActive ? 'ACTIF' : 'INACTIF'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleToggleService(s.id, s.isActive)}
                          className={`text-xs font-bold ${s.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                        >
                          {s.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Équipe */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_AGENTS.map(agent => (
                <div key={agent.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#2E4057] to-[#1A6FC4] text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md">
                      {agent.avatar}
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-[#2E4057]">{agent.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                        <span className={`text-xs font-medium ${agent.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                          {agent.status === 'active' ? 'En service' : 'En pause'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-black text-green-600">{agent.done}</div>
                      <div className="text-xs text-green-600 mt-0.5">Terminés</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <div className="text-2xl font-black text-blue-600">{agent.tasks}</div>
                      <div className="text-xs text-blue-600 mt-0.5">En cours</div>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#1A6FC4] to-green-500"
                      style={{ width: `${(agent.done / (agent.done + agent.tasks + 1)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 text-center">Progression du jour</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Modal Nouveau Service */}
    <AnimatePresence>
      {showNewServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
            onClick={() => setShowNewServiceModal(false)}
          />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <button onClick={() => setShowNewServiceModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-[#0F172A] w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-heading font-black text-[#2E4057] mb-6">Nouveau Forfait</h2>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Nom du forfait *</label>
                  <input type="text" required placeholder="Ex: Lavage Premium" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1A6FC4] font-bold" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Prix (MAD) *</label>
                  <input type="number" required min="0" placeholder="120" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1A6FC4] font-bold" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Durée *</label>
                  <input type="text" required placeholder="30 min" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1A6FC4] font-bold" value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Description</label>
                  <input type="text" placeholder="Description courte du service" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1A6FC4]" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Icône (emoji)</label>
                  <input type="text" placeholder="🚐" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-[#1A6FC4] font-bold text-2xl" value={newService.icon} onChange={e => setNewService({...newService, icon: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowNewServiceModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all">
                  Annuler
                </button>
                <button type="submit" className="flex-1 py-3 bg-[#2E4057] text-white rounded-xl font-black hover:bg-slate-800 transition-all shadow-lg">
                  Créer le forfait
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </React.Fragment>
  );
};

export default ManagerDashboard;
