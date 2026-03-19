import React from 'react';
import logoImg from '../assets/logo.png';

const Header = () => {
  return (
    <header className="w-full bg-zinc-950/90 backdrop-blur-md fixed top-0 z-50 border-b border-amber-500/10">
      <div className="container h-24 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={logoImg}
            alt="Logo Falco"
            className="w-56 md:w-64 h-auto object-contain -ml-4" // Logo slightly pulled left to compensate for PNG padding and align with Hero text
          />
        </div>

        <nav className="hidden lg:flex space-x-8 text-zinc-300 font-medium text-sm uppercase tracking-widest">
          <a href="#casos" className="hover:text-amber-500 transition-colors">Casos</a>
          <a href="#como-funciona" className="hover:text-amber-500 transition-colors">Como Funciona</a>
          <a href="#sobre" className="hover:text-amber-500 transition-colors">Sobre Nós</a>
        </nav>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-bold text-xs uppercase transition-all shadow-lg shadow-emerald-900/20 hidden md:block">
          Falar com Advogado
        </button>
      </div>
    </header>
  );
};

export default Header;
