import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentModal = ({ reservation, onConfirm, onClose }) => {
  const [method, setMethod] = useState('CASH');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-green-100">
            💰
          </div>
          <h2 className="text-2xl font-heading font-black text-[#0F172A]">Clôture du Lavage</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Montant à encaisser : <span className="font-black text-[#2563EB]">{reservation.price} MAD</span></p>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">Mode de règlement</p>
          
          <button 
            onClick={() => setMethod('CASH')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${method === 'CASH' ? 'border-[#0F172A] bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💵</span>
              <span className="font-bold text-[#0F172A]">Espèces</span>
            </div>
            {method === 'CASH' && <div className="w-3 h-3 bg-[#0F172A] rounded-full"></div>}
          </button>

          <button 
            onClick={() => setMethod('CARD')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${method === 'CARD' ? 'border-[#0F172A] bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <span className="font-bold text-[#0F172A]">Carte Bancaire</span>
            </div>
            {method === 'CARD' && <div className="w-3 h-3 bg-[#0F172A] rounded-full"></div>}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onClose}
            className="py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
          >
            Annuler
          </button>
          <button 
            onClick={() => onConfirm(method)}
            className="py-3.5 bg-green-500 text-white rounded-xl font-black hover:bg-green-600 transition-all shadow-lg shadow-green-200 active:scale-95"
          >
            ✓ Valider
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
