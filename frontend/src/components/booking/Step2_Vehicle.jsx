import React, { useState, useEffect } from 'react';
import { VEHICLE_TYPES } from '../../data/mockData';
import { getVehicles } from '../../services/api';

const Step2_Vehicle = ({ data, onChange }) => {
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoadingSaved(true);
      getVehicles()
        .then(res => setSavedVehicles(res))
        .catch(err => console.error(err))
        .finally(() => setLoadingSaved(false));
    }
  }, []);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const selectSaved = (v) => {
    onChange({
      ...data,
      brand: v.brand,
      model: v.model,
      plate: v.plate,
      color: v.color || ''
    });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-black text-[#2E4057]">Informations du véhicule</h2>
        <p className="text-slate-500 mt-2 font-medium">Ces informations nous aident à préparer le traitement adapté</p>
      </div>

      {/* Véhicules sauvegardés */}
      {savedVehicles.length > 0 && (
        <div className="mb-8">
          <label className="block text-sm font-bold text-[#2E4057] mb-3 ml-1">Vos véhicules enregistrés</label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {savedVehicles.map((v) => {
              const isActive = data.plate === v.plate;
              return (
                <button
                  key={v.id}
                  onClick={() => selectSaved(v)}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all
                    ${isActive ? 'border-[#1A6FC4] bg-blue-50' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
                >
                  <span className="text-xl">🚗</span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#2E4057] leading-tight">{v.brand} {v.model}</p>
                    <p className="text-[10px] font-mono text-slate-400">{v.plate}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Type de véhicule */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-[#2E4057] mb-3 ml-1">Type de véhicule</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VEHICLE_TYPES.map((type) => {
            const isSelected = data.type === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleChange('type', type.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 hover:border-[#1A6FC4]/40
                  ${isSelected ? 'border-[#1A6FC4] bg-blue-50 shadow-sm' : 'border-slate-200 bg-white'}`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-[#1A6FC4]' : 'text-slate-600'}`}>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulaire */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold text-[#2E4057] mb-2 ml-1">Marque *</label>
          <input
            type="text"
            placeholder="ex: Toyota, BMW, Dacia..."
            value={data.brand || ''}
            onChange={(e) => handleChange('brand', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1A6FC4] focus:outline-none transition-colors text-[#2E4057] font-bold placeholder:text-slate-300"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#2E4057] mb-2 ml-1">Modèle *</label>
          <input
            type="text"
            placeholder="ex: Corolla, X5, Clio..."
            value={data.model || ''}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1A6FC4] focus:outline-none transition-colors text-[#2E4057] font-bold placeholder:text-slate-300"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#2E4057] mb-2 ml-1">Immatriculation *</label>
          <input
            type="text"
            placeholder="ex: 12345-A-26"
            value={data.plate || ''}
            onChange={(e) => handleChange('plate', e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1A6FC4] focus:outline-none transition-colors text-[#2E4057] font-bold placeholder:text-slate-300 uppercase font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#2E4057] mb-2 ml-1">Couleur</label>
          <input
            type="text"
            placeholder="ex: Blanc, Noir, Gris..."
            value={data.color || ''}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1A6FC4] focus:outline-none transition-colors text-[#2E4057] font-bold placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block text-sm font-bold text-[#2E4057] mb-2 ml-1">Note pour l'agent (optionnel)</label>
        <textarea
          placeholder="Ex: Tache sur le siège conducteur, attention aux jantes..."
          value={data.note || ''}
          onChange={(e) => handleChange('note', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#1A6FC4] focus:outline-none transition-colors text-[#2E4057] font-bold placeholder:text-slate-300 resize-none"
        />
      </div>
    </div>
  );
};

export default Step2_Vehicle;
