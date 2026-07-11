import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitFeedback } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const RatingModal = ({ reservation, onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return showToast("Veuillez sélectionner une note", "info");

    setLoading(true);
    try {
      await submitFeedback(reservation.id, { rating, comment });
      showToast("Merci pour votre avis !", "success");
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || "Erreur lors de l'envoi", "error");
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
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#0F172A] transition-colors w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            ✨
          </div>
          <h2 className="text-2xl font-heading font-black text-[#0F172A]">Votre avis compte</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Comment s'est passée votre prestation pour la <strong className="text-[#0F172A]">{reservation.vehicle}</strong> ?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className={`text-4xl transition-colors ${
                  (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-slate-200'
                }`}
              >
                ★
              </motion.button>
            ))}
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">Commentaire (optionnel)</label>
            <textarea
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-[#0F172A] font-bold focus:outline-none focus:border-[#2563EB] focus:bg-white resize-none h-24 text-sm placeholder:text-slate-400 transition-all"
              placeholder="Un petit mot sur la qualité du lavage..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || rating === 0}
            className={`w-full py-4 rounded-full font-black text-lg shadow-xl transition-all active:scale-95
              ${loading || rating === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-[#0F172A] text-white hover:bg-slate-800'}`}
          >
            {loading ? 'Envoi...' : 'Envoyer mon avis'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RatingModal;
