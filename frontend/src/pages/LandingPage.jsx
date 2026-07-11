import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BackToTop from '../components/common/BackToTop';
import { useToast } from '../context/ToastContext';

const FAQS = [
  {
    q: "Comment fonctionne la réservation en ligne ?",
    a: "Choisissez votre formule, sélectionnez une date et un créneau disponible, renseignez votre véhicule, puis confirmez. Vous recevez un email et SMS de confirmation immédiatement."
  },
  {
    q: "Quels sont les délais de chaque prestation ?",
    a: "Express : 15 minutes — Standard : 30 minutes — Premium : 60 minutes — Complet : sur devis selon les besoins du véhicule."
  },
  {
    q: "Puis-je annuler ou modifier ma réservation ?",
    a: "Oui, l\'annulation est gratuite jusqu\'à 2 heures avant votre créneau. Connectez-vous à votre espace client pour gérer vos réservations."
  },
  {
    q: "Comment fonctionne le programme de fidélité ?",
    a: "À chaque lavage, vous cumulez des points équivalents au prix payé en MAD. Lorsque vous atteignez 500 points, vous pouvez les utiliser pour obtenir un lavage gratuit."
  },
  {
    q: "Quels modes de paiement sont acceptés ?",
    a: "Nous acceptons le paiement en ligne par carte bancaire (Visa, Mastercard) ainsi que le paiement en espèces sur place. Le virement bancaire est aussi disponible."
  },
  {
    q: "Comment savoir quand mon véhicule est prêt ?",
    a: "Vous recevez une notification SMS et/ou Email dès que l'agent termine le lavage. Vous pouvez aussi suivre la progression en temps réel depuis votre tableau de bord client."
  },
  {
    q: "L'application est-elle disponible sur mobile ?",
    a: "Notre site est entièrement responsive (Mobile-First). Une application mobile native iOS/Android est en cours de développement."
  },
  {
    q: "Que comprend le paiement sur place ?",
    a: "Vous pouvez réserver en ligne et payer directement à l'accueil du centre au moment de déposer votre véhicule, en espèces ou par carte."
  },
];

const LandingPage = () => {
  const { showToast } = useToast();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9FAFB]">
      <Header />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative bg-[#2E4057] overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
             <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-[#1A6FC4] to-transparent transform -skew-x-12"></div>
             <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1A6FC4] rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <span className="inline-block py-1 px-3 rounded-full bg-[#F4A261]/20 text-[#F4A261] text-sm font-bold tracking-wider mb-6 border border-[#F4A261]/30 shadow-sm">NOUVEAU — RÉSERVATION EN LIGNE</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight mb-6 leading-tight">
                  L'excellence pour <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A6FC4] to-blue-300">
                    votre véhicule
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed font-medium">
                  Gagnez du temps. Réservez votre lavage auto en ligne, suivez son évolution en temps réel, et profitez d'un véhicule impeccable.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/reserver" className="bg-[#F4A261] hover:bg-orange-500 text-white px-8 py-4 rounded-full font-black text-lg transition-all shadow-[0_0_20px_rgba(244,162,97,0.4)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(244,162,97,0.6)] text-center">
                    Réserver maintenant
                  </Link>
                  <a href="#services" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-white/20 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Voir nos prestations
                  </a>
                </div>
                
                <div className="mt-10 flex items-center gap-4 text-sm text-slate-400 font-medium">
                   <div className="flex -space-x-2">
                     <img className="w-8 h-8 rounded-full border-2 border-[#2E4057]" src="https://i.pravatar.cc/100?img=1" alt="Client" />
                     <img className="w-8 h-8 rounded-full border-2 border-[#2E4057]" src="https://i.pravatar.cc/100?img=2" alt="Client" />
                     <img className="w-8 h-8 rounded-full border-2 border-[#2E4057]" src="https://i.pravatar.cc/100?img=3" alt="Client" />
                     <div className="w-8 h-8 rounded-full border-2 border-[#2E4057] bg-[#1A6FC4] flex items-center justify-center text-xs text-white font-bold">+5k</div>
                   </div>
                   <p>Clients satisfaits au Maroc</p>
                </div>
              </div>
              
              <div className="relative hidden md:block">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#1A6FC4]/40 to-blue-400/20 rounded-3xl transform rotate-3 scale-105 z-0"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                   alt="Lavage Premium AutoBrillance" 
                   className="relative z-10 rounded-3xl shadow-2xl object-cover h-[500px] w-full border border-white/10"
                 />
                 
                 {/* Floating Badge */}
                 <div className="absolute -left-8 top-1/4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Prêt en 15 min!</p>
                      <p className="text-slate-300 text-xs text-left">Suivi temps réel</p>
                    </div>
                 </div>

                 {/* Stats badge */}
                 <div className="absolute -right-6 bottom-1/4 bg-[#F4A261] p-4 rounded-2xl shadow-xl z-20 text-white">
                   <p className="text-2xl font-black">98%</p>
                   <p className="text-xs font-bold opacity-90">Satisfaction</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAND */}
        <section className="bg-[#1A6FC4] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
              {[
                { value: '5 000+', label: 'Clients satisfaits' },
                { value: '98%', label: 'Taux de satisfaction' },
                { value: '15 min', label: 'Réservation Express' },
                { value: '99.5%', label: 'Disponibilité app' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-black">{stat.value}</div>
                  <div className="text-blue-100 text-sm font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#1A6FC4] font-bold tracking-widest uppercase text-xs bg-blue-100 px-3 py-1 rounded-full">Nos Formules</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black mt-4 text-[#2E4057]">Choisissez la prestation adaptée</h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-medium">Du lavage classique au detailing complet, nous avons la formule adaptée à votre véhicule et votre budget.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card Express */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                 <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1A6FC4] group-hover:text-white transition-colors">
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xl font-bold font-heading text-[#2E4057]">Express</h3>
                   <span className="text-xs font-bold bg-blue-50 text-[#1A6FC4] px-2 py-1 rounded-full">15 min</span>
                 </div>
                 <p className="text-slate-500 text-sm mb-6 h-10">Lavage extérieur rapide et efficace. Idéal pour un entretien régulier.</p>
                 <div className="text-4xl font-black text-[#2E4057] mb-6">60 <span className="text-base font-bold text-slate-400">MAD</span></div>
                 <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Lavage carrosserie</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Nettoyage jantes</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Séchage soigné</li>
                   <li className="flex items-center gap-3 text-slate-300"><svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg> Aspiration habitacle</li>
                 </ul>
                 <Link to="/reserver" className="block w-full py-3.5 rounded-xl border-2 border-slate-100 text-[#2E4057] font-bold hover:border-[#2E4057] transition-colors text-center">Réserver</Link>
              </div>

              {/* Card Standard - Populaire */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-100/50 border-2 border-[#1A6FC4] hover:-translate-y-2 transition-all duration-300 relative group">
                 <div className="absolute top-0 right-0 bg-[#1A6FC4] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl uppercase tracking-widest">Populaire</div>
                 <div className="w-14 h-14 bg-[#1A6FC4] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                 </div>
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xl font-bold font-heading text-[#2E4057]">Standard</h3>
                   <span className="text-xs font-bold bg-blue-50 text-[#1A6FC4] px-2 py-1 rounded-full">30 min</span>
                 </div>
                 <p className="text-slate-500 text-sm mb-6 h-10">Lavage intérieur/extérieur complet pour une propreté optimale.</p>
                 <div className="text-4xl font-black text-[#2E4057] mb-6">120 <span className="text-base font-bold text-slate-400">MAD</span></div>
                 <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Formule Express incluse</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Aspiration habitacle</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Nettoyage vitres</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Désodorisant</li>
                 </ul>
                 <Link to="/reserver" className="block w-full py-3.5 rounded-xl bg-[#1A6FC4] text-white font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 text-center">Réserver</Link>
              </div>

              {/* Card Premium */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                 <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F4A261] group-hover:text-white transition-colors">
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 </div>
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xl font-bold font-heading text-[#2E4057]">Premium</h3>
                   <span className="text-xs font-bold bg-orange-50 text-[#F4A261] px-2 py-1 rounded-full">60 min</span>
                 </div>
                 <p className="text-slate-500 text-sm mb-6 h-10">Soin minutieux incluant le traitement des plastiques et cuirs.</p>
                 <div className="text-4xl font-black text-[#2E4057] mb-6">250 <span className="text-base font-bold text-slate-400">MAD</span></div>
                 <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Formule Standard incluse</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Nettoyage sièges</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Cire de finition</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Traitement cuir</li>
                 </ul>
                 <Link to="/reserver" className="block w-full py-3.5 rounded-xl border-2 border-slate-100 text-[#2E4057] font-bold hover:border-[#2E4057] transition-colors text-center">Réserver</Link>
              </div>

              {/* Card Complet */}
              <div className="bg-[#2E4057] text-white rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                 <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                   <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                 </div>
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xl font-bold font-heading">Complet</h3>
                   <span className="text-xs font-bold bg-white/10 text-white px-2 py-1 rounded-full">Sur devis</span>
                 </div>
                 <p className="text-slate-400 text-sm mb-6 h-10">Polissage et detailing intérieur approfondi. L'état showroom.</p>
                 <div className="text-4xl font-black mb-6">800+ <span className="text-base font-bold text-slate-500">MAD</span></div>
                 <ul className="space-y-3 mb-8 text-sm text-slate-300 font-medium">
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-[#F4A261] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Formule Premium incluse</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-[#F4A261] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Nettoyage moteur</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-[#F4A261] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Polissage carrosserie</li>
                   <li className="flex items-center gap-3"><svg className="w-5 h-5 text-[#F4A261] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Revêtement céramique</li>
                 </ul>
                 <Link to="/reserver" className="block w-full py-3.5 rounded-xl bg-[#F4A261] text-white font-black hover:bg-orange-500 transition-colors text-center">Demander un devis</Link>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRAMME FIDÉLITÉ */}
        <section id="fidelite" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[#F4A261] font-bold tracking-widest uppercase text-xs bg-orange-50 px-3 py-1 rounded-full">Programme Fidélité</span>
                <h2 className="text-3xl md:text-4xl font-heading font-black mt-4 mb-6 text-[#2E4057]">Cumulez des points, <span className="text-[#F4A261]">profitez gratuitement</span></h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-8">
                  Chaque euro dépensé en lavage se transforme en points fidélité. Atteignez 500 points et obtenez un lavage offert. C'est notre façon de vous remercier de votre confiance.
                </p>
                <div className="space-y-6">
                  {[
                    { step: '1', title: 'Réservez et payez', desc: 'À chaque prestation payée, vous accumulez des points équivalents au montant en MAD.', color: 'bg-[#1A6FC4]' },
                    { step: '2', title: 'Atteignez 500 points', desc: 'Suivez votre solde en temps réel dans votre tableau de bord client.', color: 'bg-[#F4A261]' },
                    { step: '3', title: 'Profitez d\'un lavage gratuit', desc: 'Utilisez vos points lors de votre prochaine réservation pour obtenir un lavage gratuit.', color: 'bg-[#2E4057]' },
                  ].map(item => (
                    <div key={item.step} className="flex gap-5 items-start">
                      <div className={`w-10 h-10 ${item.color} text-white rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0`}>{item.step}</div>
                      <div>
                        <h4 className="font-bold text-[#2E4057] mb-1">{item.title}</h4>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/connexion" className="mt-8 inline-block bg-[#2E4057] text-white px-8 py-3.5 rounded-full font-black hover:bg-[#1A6FC4] transition-colors shadow-lg mt-6">
                  Rejoindre le programme
                </Link>
              </div>
              <div className="bg-gradient-to-br from-[#2E4057] to-[#1A6FC4] rounded-3xl p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-24 -mt-24"></div>
                <h3 className="text-2xl font-heading font-black mb-8 relative z-10">Votre tableau de fidélité</h3>
                
                {/* Exemple carte fidélité */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Points cumulés</p>
                      <p className="text-4xl font-black mt-1">340 <span className="text-xl text-slate-300">pts</span></p>
                    </div>
                    <div className="w-12 h-12 bg-[#F4A261] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
                    <div className="h-2.5 rounded-full bg-[#F4A261] transition-all" style={{width: '68%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 font-bold">
                    <span>0 pts</span>
                    <span className="text-[#F4A261]">68% — encore 160 pts</span>
                    <span>500 pts</span>
                  </div>
                </div>

                {/* Avantages */}
                <div className="space-y-3 relative z-10">
                  {[
                    { pts: '500 pts', avantage: 'Lavage Express offert (60 MAD)', unlocked: false },
                    { pts: '1000 pts', avantage: 'Lavage Standard offert (120 MAD)', unlocked: false },
                    { pts: '2500 pts', avantage: 'Lavage Premium offert (250 MAD)', unlocked: false },
                  ].map(item => (
                    <div key={item.pts} className={`flex items-center gap-4 p-3 rounded-xl ${item.unlocked ? 'bg-green-500/20 border border-green-400/30' : 'bg-white/5 border border-white/10'}`}>
                      <span className="text-sm font-black text-[#F4A261] w-20 flex-shrink-0">{item.pts}</span>
                      <span className="text-sm text-slate-200 font-medium">{item.avantage}</span>
                      {item.unlocked && <svg className="w-5 h-5 text-green-400 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="avantages" className="py-24 bg-[#F9FAFB]">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-[#1A6FC4] font-bold tracking-widest uppercase text-xs bg-blue-100 px-3 py-1 rounded-full">Processus</span>
                <h2 className="text-3xl md:text-4xl font-heading font-black mt-4 text-[#2E4057]">Simple, transparent et digitalisé</h2>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Oubliez les attentes inutiles. Notre application simplifie tout, de la prise de rendez-vous jusqu'au paiement.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    n: '1',
                    title: 'Réservez en ligne',
                    desc: 'Choisissez la date, l\'heure et la prestation. Connectez-vous à votre espace pour cumuler vos points fidélité. Confirmation par SMS et email.',
                    icon: '📅', color: 'bg-[#1A6FC4]'
                  },
                  {
                    n: '2',
                    title: 'Déposez et suivez',
                    desc: 'Laissez les clés à nos agents. Suivez l\'état d\'avancement (En attente → En cours → Terminé) en temps réel depuis votre mobile.',
                    icon: '📱', color: 'bg-[#2E4057]'
                  },
                  {
                    n: '3',
                    title: 'Récupérez votre véhicule',
                    desc: 'Une notification SMS/Email vous prévient quand c\'est prêt. Payez en ligne ou sur place, au choix.',
                    icon: '✅', color: 'bg-[#F4A261]'
                  }
                ].map(step => (
                  <div key={step.n} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                    <div className={`w-16 h-16 ${step.color} text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Étape {step.n}</div>
                    <h4 className="text-xl font-bold font-heading text-[#2E4057] mb-3">{step.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-gradient-to-br from-[#2E4057] to-[#1A3050] relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">Prêt à faire briller votre auto ?</h2>
            <p className="text-xl text-slate-400 mb-10 font-medium">Rejoignez des milliers de clients satisfaits et profitez du meilleur lavage de la ville.</p>
            <Link to="/reserver" className="inline-block bg-[#F4A261] hover:bg-orange-500 text-white px-12 py-5 rounded-full font-black text-lg transition-all shadow-[0_0_20px_rgba(244,162,97,0.4)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(244,162,97,0.6)]">
               Prendre Rendez-Vous Maintenant
            </Link>
            <div className="mt-8 text-sm text-slate-500 font-bold tracking-widest uppercase">Paiement sécurisé · Annulation gratuite jusqu'à 2h avant</div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="temoignages" className="py-24 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#1A6FC4] font-bold tracking-widest uppercase text-xs bg-blue-100 px-3 py-1 rounded-full">Ils nous font confiance</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black mt-4 text-[#2E4057]">Avis de nos clients</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Amine B.', role: 'Client fidèle — 340 pts', text: 'Service impeccable ! J\'ai réservé en 2 minutes et le résultat est bluffant. Le suivi en temps réel est une vraie révolution.', avatar: 'https://i.pravatar.cc/150?u=amine', rating: 5 },
                { name: 'Sofia R.', role: 'Propriétaire SUV', text: 'Le suivi en temps réel est génial. On sait exactement quand repasser. Équipe très professionnelle et efficace.', avatar: 'https://i.pravatar.cc/150?u=sofia', rating: 5 },
                { name: 'Yassine K.', role: 'Berline de luxe', text: 'Le formule Premium redonne l\'aspect showroom à ma voiture. J\'ai aussi cumulé assez de points pour un lavage gratuit !', avatar: 'https://i.pravatar.cc/150?u=yassine', rating: 5 }
              ].map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl border border-slate-100 shadow-sm" />
                    <div>
                      <h4 className="font-bold text-[#2E4057]">{t.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium italic">"{t.text}"</p>
                  <div className="mt-6 flex text-[#F4A261]">
                    {Array(t.rating).fill(0).map((_, j) => (
                      <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#1A6FC4] font-bold tracking-widest uppercase text-xs bg-blue-100 px-3 py-1 rounded-full">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-heading font-black mt-4 text-[#2E4057]">Questions fréquentes</h2>
              <p className="text-slate-500 mt-4">Tout ce que vous devez savoir avant de réserver.</p>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-bold text-[#2E4057] pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-[#1A6FC4] flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-slate-600 font-medium leading-relaxed border-t border-slate-100 bg-slate-50/50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-slate-500 mb-4">Vous n'avez pas trouvé votre réponse ?</p>
              <a href="#contact" className="inline-block bg-[#2E4057] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1A6FC4] transition-colors">
                Contactez-nous
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#2E4057] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-[#1a2d40]">
              <div className="lg:w-1/2 p-12 lg:p-16 text-white">
                <span className="text-[#F4A261] font-bold tracking-widest uppercase text-xs mb-4 block">Support en ligne</span>
                <h2 className="text-3xl font-heading font-black mb-4">Informations de contact</h2>
                <p className="text-slate-400 mb-10 font-medium">Notre équipe est disponible du lundi au samedi, de 8h à 18h.</p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#1A6FC4]">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span className="font-medium text-slate-300">Boulevard Zerktouni, Casablanca, Maroc</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#1A6FC4]">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <span className="font-medium text-slate-300">05 22 00 11 22 / 06 00 11 22 33</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#1A6FC4]">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <span className="font-medium text-slate-300">contact@autobrillance.ma</span>
                  </div>
                </div>
                
                <div className="mt-12">
                  <p className="text-slate-500 text-sm mb-4 font-bold">Suivez-nous</p>
                  <div className="flex gap-3">
                    {['Instagram', 'Facebook', 'LinkedIn'].map(social => (
                      <div key={social} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1A6FC4] transition-colors text-white text-xs font-bold">
                         {social[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 bg-white p-12 lg:p-16">
                 <h3 className="text-2xl font-black text-[#2E4057] mb-2">Envoyez-nous un message</h3>
                 <p className="text-slate-500 mb-8 font-medium">Réponse garantie sous 24h ouvrées.</p>
                 <form className="space-y-5" onSubmit={(e) => {
                   e.preventDefault();
                   showToast("Message envoyé avec succès ! Nous vous répondrons très vite.", "success");
                   e.target.reset();
                 }}>
                    <div className="grid md:grid-cols-2 gap-5">
                       <input required type="text" placeholder="Nom" className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:outline-none focus:border-[#1A6FC4] focus:bg-white transition-all text-[#2E4057] font-bold placeholder:text-slate-400" />
                       <input required type="email" placeholder="Email" className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:outline-none focus:border-[#1A6FC4] focus:bg-white transition-all text-[#2E4057] font-bold placeholder:text-slate-400" />
                    </div>
                    <input type="tel" placeholder="Téléphone (optionnel)" className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:outline-none focus:border-[#1A6FC4] focus:bg-white transition-all text-[#2E4057] font-bold placeholder:text-slate-400" />
                    <input required type="text" placeholder="Sujet" className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:outline-none focus:border-[#1A6FC4] focus:bg-white transition-all text-[#2E4057] font-bold placeholder:text-slate-400" />
                    <textarea required rows="4" placeholder="Votre message..." className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:outline-none focus:border-[#1A6FC4] focus:bg-white transition-all text-[#2E4057] font-bold placeholder:text-slate-400"></textarea>
                    <button type="submit" className="w-full bg-[#2E4057] text-white font-black py-4 rounded-full hover:bg-[#1A6FC4] transition-all shadow-xl shadow-slate-200 mt-2 active:scale-95">Envoyer le message</button>
                 </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default LandingPage;
