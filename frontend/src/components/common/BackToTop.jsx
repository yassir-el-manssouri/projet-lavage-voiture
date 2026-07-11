import React, { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-[#0F172A] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-[#2563EB] hover:-translate-y-1 hover:shadow-2xl active:scale-90 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default BackToTop;
