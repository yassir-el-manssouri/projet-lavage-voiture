import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const members = ['Anass Benbassou', 'Yassir El Manssouri', 'Rokaya El Bekkari', 'Ahmed Aidani'];

  return (
    <footer className="bg-[#2E4057] text-white pt-16 pb-8 border-t border-[#1a2d40]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-8 h-8 text-[#F4A261]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="font-heading font-black text-2xl">Auto<span className="text-[#1A6FC4]">Brillance</span></span>
            </div>
            <p className="text-slate-300 text-sm font-medium leading-relaxed">
              L'excellence du lavage automobile au Maroc. Réservation en ligne, suivi en temps réel et programme fidélité pour vous offrir le meilleur service.
            </p>
            <div className="mt-4 text-xs text-slate-400">
              <p>📍 Boulevard Zerktouni, Casablanca</p>
              <p className="mt-1">📞 05 22 00 11 22</p>
              <p className="mt-1">✉️ contact@autobrillance.ma</p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-[#F4A261] mb-5">Navigation</h3>
            <ul className="space-y-3">
              {[
                { label: 'Nos Services', href: '/#services' },
                { label: 'Programme Fidélité', href: '/#fidelite' },
                { label: 'Comment ça marche', href: '/#avantages' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'Témoignages', href: '/#temoignages' },
                { label: 'Contact', href: '/#contact' },
              ].map(item => (
                <li key={item.label}>
                  <a href={item.href} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account + Légal */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-[#F4A261] mb-5">Mon compte</h3>
            <ul className="space-y-3 mb-8">
              {[
                { label: 'Se connecter', to: '/connexion' },
                { label: 'Créer un compte', to: '/connexion' },
                { label: 'Réserver', to: '/reserver' },
                { label: 'Espace Client', to: '/dashboard' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
            <Link
              to="/reserver"
              className="inline-block bg-[#F4A261] text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-orange-500 transition-colors shadow-lg"
            >
              Réserver maintenant →
            </Link>
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-[#1a2d40] mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-slate-400">© 2026 AutoBrillance · Tous droits réservés · EMSI Rabat</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {members.map(name => (
              <span key={name} className="text-slate-400 font-medium">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
