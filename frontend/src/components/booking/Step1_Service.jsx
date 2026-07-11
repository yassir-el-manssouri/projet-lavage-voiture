import React, { useState, useEffect } from 'react';
import { getServices } from '../../services/api';

const Step1_Service = ({ selected, onSelect }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then(data => {
        const formatted = data.map(s => ({
          ...s,
          features: s.features ? s.features.split(',') : []
        }));
        setServices(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#1A6FC4] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 animate-pulse font-medium">Chargement des forfaits...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-black text-[#2E4057]">Choisissez votre prestation</h2>
        <p className="text-slate-500 mt-2 font-medium">Sélectionnez la formule adaptée à votre véhicule</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {services.map((service) => {
          const isSelected = selected?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`relative text-left rounded-3xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none group
                ${isSelected
                  ? 'border-[#1A6FC4] bg-blue-50/50 shadow-md shadow-blue-100'
                  : 'border-slate-200 bg-white hover:border-[#1A6FC4]/40'
                }`}
            >
              {service.popular && (
                <span className="absolute top-3 right-3 text-[10px] font-black bg-[#1A6FC4] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                  Populaire
                </span>
              )}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color || 'from-blue-400 to-blue-600'} flex items-center justify-center text-2xl mb-4 shadow-md`}>
                {service.icon}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="font-heading font-black text-lg text-[#2E4057]">{service.name}</h3>
                <span className="text-xs text-slate-400 font-bold">· {service.duration}</span>
              </div>
              <p className="text-sm text-slate-500 mb-4 font-medium">{service.description}</p>
              <ul className="space-y-1.5 mb-4">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#2E4057]">
                  {service.price} <span className="text-sm font-bold text-slate-400">MAD</span>
                </span>
                {isSelected && (
                  <span className="w-7 h-7 rounded-full bg-[#1A6FC4] flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Step1_Service;
