import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
            <span className="font-heading font-black text-2xl text-[#2E4057] flex items-center gap-2 tracking-tighter">
              <div className="w-10 h-10 bg-[#2E4057] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              Auto<span className="text-[#1A6FC4]">Brillance</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-7">
            <a href="/#services" className="text-slate-600 hover:text-[#2E4057] transition-colors font-semibold text-sm">Services</a>
            <a href="/#fidelite" className="text-slate-600 hover:text-[#2E4057] transition-colors font-semibold text-sm">Fidélité</a>
            <a href="/#avantages" className="text-slate-600 hover:text-[#2E4057] transition-colors font-semibold text-sm">Comment ça marche</a>
            <a href="/#faq" className="text-slate-600 hover:text-[#2E4057] transition-colors font-semibold text-sm">FAQ</a>
            <a href="/#contact" className="text-slate-600 hover:text-[#2E4057] transition-colors font-semibold text-sm">Contact</a>
          </nav>

          {/* CTA & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <Link to="/dashboard" className="text-sm font-semibold text-[#2E4057] hover:text-[#1A6FC4] transition-colors">Mon espace</Link>
            ) : (
              <Link to="/connexion" className="text-sm font-semibold text-slate-600 hover:text-[#2E4057] transition-colors">Connexion</Link>
            )}
            <Link
              to="/reserver"
              className="bg-[#F4A261] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-orange-100 hover:bg-orange-500 transition-all active:scale-95"
            >
              Réserver maintenant
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-[#2E4057] focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/#services" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:text-[#2E4057] hover:bg-slate-50">Services</a>
            <a href="/#fidelite" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:text-[#2E4057] hover:bg-slate-50">Fidélité</a>
            <a href="/#avantages" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:text-[#2E4057] hover:bg-slate-50">Comment ça marche</a>
            <a href="/#faq" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:text-[#2E4057] hover:bg-slate-50">FAQ</a>
            <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-slate-700 hover:text-[#2E4057] hover:bg-slate-50">Contact</a>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col space-y-2 px-3">
               <Link to="/connexion" onClick={() => setIsMenuOpen(false)} className="text-center text-slate-700 font-bold py-2 hover:bg-slate-50 rounded-lg">Connexion</Link>
               <Link to="/reserver" onClick={() => setIsMenuOpen(false)} className="w-full bg-[#F4A261] text-white px-6 py-3 rounded-full font-black text-center shadow-md hover:bg-orange-500">Réserver maintenant</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
