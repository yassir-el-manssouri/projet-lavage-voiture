import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

const DiagnosticModal = ({ reservation, onClose, onUpdate }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Simulation de captures
  const [photoBefore, setPhotoBefore] = useState(reservation.photoBefore || '');
  const [photoAfter, setPhotoAfter] = useState(reservation.photoAfter || '');

  const handleCapture = async (type) => {
    setLoading(true);
    try {
      // Simulation d\'upload : on utilise des URLs mockées basées sur les générations d\'images préalables
      // Note: l'URL réelle serait récupérée après un upload sur Cloudinary/S3
      const mockPhotoUrl = type === 'before' 
        ? 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800' // Placeholder dirty
        : 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800'; // Placeholder shiny
      
      const API_URL = 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const payload = type === 'before' 
        ? { photoBefore: mockPhotoUrl, photoAfter } 
        : { photoBefore, photoAfter: mockPhotoUrl };

      const res = await fetch(`${API_URL}/reservations/${reservation.id}/photos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        if (type === 'before') setPhotoBefore(mockPhotoUrl);
        else setPhotoAfter(mockPhotoUrl);
        showToast(`Photo ${type === 'before' ? 'Avant' : 'Après'} enregistrée`, "success");
        onUpdate();
      }
    } catch (e) {
      showToast("Erreur simulation upload", "error");
    } finally {
      setLoading(false);
    }
  };

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
        className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-[#0F172A] w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-heading font-black text-[#0F172A]">Diagnostic Visuel</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">{reservation.vehicle} · {reservation.service}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Photo Avant */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">État Avant</p>
            <div className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative flex items-center justify-center">
              {photoBefore ? (
                <img src={photoBefore} alt="Avant" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl opacity-20">📸</span>
              )}
            </div>
            <button 
              disabled={loading}
              onClick={() => handleCapture('before')}
              className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${photoBefore ? 'bg-slate-100 text-slate-500' : 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-lg'}`}
            >
              {photoBefore ? '🔄 Reprendre' : '📸 Capturer Avant'}
            </button>
          </div>

          {/* Photo Après */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">État Après</p>
            <div className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative flex items-center justify-center">
              {photoAfter ? (
                <img src={photoAfter} alt="Après" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl opacity-20">✨</span>
              )}
            </div>
            <button 
              disabled={loading}
              onClick={() => handleCapture('after')}
              className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${photoAfter ? 'bg-slate-100 text-slate-500' : 'bg-[#2563EB] text-white hover:bg-blue-600 shadow-lg'}`}
            >
              {photoAfter ? '🔄 Reprendre' : '✨ Capturer Après'}
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
        >
          Fermer le diagnostic
        </button>
      </motion.div>
    </div>
  );
};

export default DiagnosticModal;
