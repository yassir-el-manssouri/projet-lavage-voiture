import React, { useState } from 'react';
import { VEHICLE_TYPES } from '../../data/mockData';

const Step4_Confirm = ({ service, vehicle, dateTime, onConfirm, confirmed, userPoints, usePoints, onTogglePoints }) => {
  const [contact, setContact] = useState({ name: '', phone: '', email: '' });

  const vehicleTypeLabel = VEHICLE_TYPES.find(t => t.id === vehicle.type)?.label || vehicle.type;
  const formattedDate = dateTime.date
    ? new Date(dateTime.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const finalPrice = usePoints ? 0 : service.price;
  const canRedeem = userPoints >= 500;

  const isValid = contact.name.trim() && contact.phone.trim() && contact.email.trim();

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce" style={{ animationDuration: '1s', animationIterationCount: 3 }}>
          <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-heading font-black text-[#2E4057] mb-3">Réservation confirmée ! 🎉</h2>
        <p className="text-slate-500 max-w-sm mb-2 font-medium">
          Votre réservation <strong className="text-[#1A6FC4]">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</strong> a été enregistrée.
        </p>
        <p className="text-slate-400 text-sm mb-8 font-medium">Un SMS de confirmation va vous être envoyé au <strong className="text-[#2E4057]">{contact.phone}</strong></p>
        <div className="bg-slate-50 rounded-3xl p-6 text-left w-full max-w-sm mb-8 border border-slate-100 shadow-sm">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Prestation</span><span className="font-black text-[#2E4057]">{service.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Véhicule</span><span className="font-black text-[#2E4057]">{vehicle.brand} {vehicle.model}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Date</span><span className="font-black text-[#2E4057] capitalize">{formattedDate}</span></div>
            <div className="flex justify-between"><span className="text-slate-500 font-medium">Heure</span><span className="font-black text-[#2E4057]">{dateTime.time}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-3 mt-3"><span className="text-slate-500 font-medium">Total payé</span><span className="font-black text-xl text-[#1A6FC4]">{finalPrice} MAD</span></div>
            {usePoints && <div className="flex justify-center mt-2"><span className="text-[10px] text-green-600 font-black tracking-wider uppercase bg-green-50 border border-green-100 px-3 py-1 rounded-full">✓ Points de fidélité utilisés</span></div>}
          </div>
        </div>
        <a href="/" className="bg-[#2E4057] text-white px-8 py-3.5 rounded-full font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95">
          Retour à l'accueil
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-black text-[#2E4057]">Récapitulatif & Confirmation</h2>
        <p className="text-slate-500 mt-2 font-medium">Vérifiez vos informations avant de finaliser</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Récap */}
        <div className="space-y-4">
          <h3 className="font-black text-[#2E4057] text-[11px] uppercase tracking-[0.15em] ml-1">Détails de la réservation</h3>

          <div className="bg-gradient-to-br from-[#2E4057] to-slate-800 text-white rounded-3xl p-6 space-y-4 shadow-xl shadow-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-2xl">{service.icon}</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prestation choisie</p>
                <p className="font-black text-lg">{service.name} — <span className="text-[#1A6FC4]">{service.price} MAD</span></p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Véhicule</span>
                <span className="text-white font-bold">{vehicle.brand} {vehicle.model}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Type</span>
                <span className="text-white font-bold">{vehicleTypeLabel}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Immatriculation</span>
                <span className="text-white font-bold font-mono tracking-wider">{vehicle.plate}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Date</span>
                <span className="text-white font-bold capitalize">{formattedDate}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Heure</span>
                <span className="text-white font-bold">{dateTime.time}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Durée estimée</span>
                <span className="text-[#1A6FC4] font-black">{service.duration}</span>
              </div>
            </div>
          </div>

          {vehicle.note && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm">
              <p className="font-black text-yellow-700 mb-1 flex items-center gap-2"><span className="text-lg">📝</span> Note pour l'agent</p>
              <p className="text-yellow-600 font-medium">{vehicle.note}</p>
            </div>
          )}
        </div>

        {/* Coordonnées */}
        <div className="space-y-4">
          <h3 className="font-black text-[#2E4057] text-[11px] uppercase tracking-[0.15em] ml-1">Vos coordonnées</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#2E4057] mb-2 ml-1">Nom complet *</label>
              <input
                type="text"
                placeholder="ex: Youssef El Amrani"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1A6FC4] focus:bg-white focus:outline-none transition-colors text-[#2E4057] font-bold placeholder:text-slate-300 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2E4057] mb-2 ml-1">Téléphone *</label>
              <input
                type="tel"
                placeholder="+212 6XX-XXXXXX"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1A6FC4] focus:bg-white focus:outline-none transition-colors text-[#2E4057] font-bold placeholder:text-slate-300 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2E4057] mb-2 ml-1">Email *</label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1A6FC4] focus:bg-white focus:outline-none transition-colors text-[#2E4057] font-bold placeholder:text-slate-300 bg-slate-50"
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-xs font-bold text-[#1A6FC4] border border-blue-100 flex items-start gap-3">
            <span className="text-lg leading-none">🔒</span> 
            <span className="leading-relaxed">Vos données sont sécurisées. Annulation gratuite jusqu'à 2h avant votre rendez-vous.</span>
          </div>

          {/* Points de fidélité */}
          {canRedeem ? (
            <div className={`p-5 rounded-3xl border-2 transition-all shadow-sm ${usePoints ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${usePoints ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-400'}`}>🏆</div>
                  <div>
                    <h4 className="font-black text-[#2E4057] text-sm tracking-tight">UTILISER MES POINTS</h4>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Vous avez {userPoints} points</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={onTogglePoints}
                  className={`w-14 h-8 rounded-full relative transition-colors duration-300 shadow-inner ${usePoints ? 'bg-green-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${usePoints ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              {usePoints && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-xs text-green-700 font-black text-center uppercase tracking-widest">Récompense appliquée : Lavage offert !</p>
                </div>
              )}
            </div>
          ) : userPoints > 0 ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 font-medium">
              <span className="font-black text-[#2E4057]">Programme Fidélité</span> : Vous avez <span className="text-[#1A6FC4] font-black">{userPoints} pts</span>. Accumulez encore {500 - userPoints} pts pour un lavage offert.
            </div>
          ) : null}

          <button
            onClick={() => isValid && onConfirm(contact)}
            disabled={!isValid}
            className={`w-full py-4 rounded-full font-black text-lg transition-all duration-300 active:scale-95
              ${isValid
                ? 'bg-[#2E4057] text-white hover:bg-slate-800 shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-0.5'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
          >
            ✅ Confirmer ma réservation — {finalPrice} MAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4_Confirm;
