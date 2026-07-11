import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ id, message, type, onRemove }) => {
  const styles = {
    success: {
      bg: 'bg-[#0F172A] border-green-500/40',
      icon: 'bg-green-500/20 text-green-400',
      dot: 'bg-green-400',
    },
    error: {
      bg: 'bg-[#0F172A] border-red-500/40',
      icon: 'bg-red-500/20 text-red-400',
      dot: 'bg-red-400',
    },
    info: {
      bg: 'bg-[#0F172A] border-[#2563EB]/40',
      icon: 'bg-[#2563EB]/20 text-[#2563EB]',
      dot: 'bg-[#2563EB]',
    },
  };

  const s = styles[type] || styles.info;

  const icons = {
    success: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`pointer-events-auto flex items-center gap-4 px-5 py-4 rounded-2xl text-white shadow-2xl border backdrop-blur-sm ${s.bg} w-full`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-white leading-snug">{message}</p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-white/40 hover:text-white transition-colors flex-shrink-0 ml-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};
