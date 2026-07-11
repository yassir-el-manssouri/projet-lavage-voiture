import React, { useState, useRef } from 'react';

const PhotoComparison = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const getPercent = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setSliderPos(getPercent(e.clientX));
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    setSliderPos(getPercent(touch.clientX));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avant</span>
        <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Après</span>
      </div>
      
      <div 
        ref={containerRef}
        className="relative aspect-video rounded-3xl overflow-hidden cursor-col-resize shadow-xl border border-slate-100 select-none"
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Image Après (base, toujours visible) */}
        <img 
          src={after} 
          alt="Après" 
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Image Avant (clippée à gauche du slider) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img 
            src={before} 
            alt="Avant" 
            className="absolute inset-0 h-full object-cover"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
            draggable={false}
          />
        </div>

        {/* Barre de séparation + Handle */}
        <div 
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute inset-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-[#0F172A] font-bold text-xs pointer-events-auto cursor-col-resize select-none border-2 border-slate-100">
            ↔
          </div>
        </div>

        {/* Labels overlay */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm pointer-events-none">
          AVANT
        </div>
        <div className="absolute bottom-3 right-3 bg-blue-600/80 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm pointer-events-none">
          APRÈS
        </div>
      </div>
    </div>
  );
};

export default PhotoComparison;
