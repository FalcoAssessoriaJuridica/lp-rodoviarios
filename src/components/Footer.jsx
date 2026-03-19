import React from 'react';
import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-amber-500/20">
      <div className="container">
        <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap justify-between gap-12 lg:gap-8">

          {/* Coluna 1: Logo e Bio */}
          <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col items-start space-y-6">
            <img
              src={logoImg}
              alt="Logo Falco"
              className="w-72 lg:w-80 h-auto object-contain -ml-4 brightness-110" // Logo expandida para alinhar melhor com o tamanho do texto
            />
            <p className="text-sm leading-relaxed text-justify">
              Justiça e dignidade para quem move o Brasil. Especialistas em causas rodoviárias com atuação em todo o território nacional. Atendimento focado em resultados rápidos e humanizados para motoristas e cobradores.
            </p>
          </div>

          {/* Coluna 2: Links */}
          <div className="w-full md:w-[45%] lg:w-[15%] text-left lg:ml-auto">
            <h4 className="text-amber-500 font-bold uppercase tracking-widest mb-6 text-sm">Links Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#casos" className="hover:text-amber-400 transition-colors">Nossa Atuação</a></li>
              <li><a href="#como-funciona" className="hover:text-amber-400 transition-colors">Como Trabalhamos</a></li>
              <li><a href="#depoimentos" className="hover:text-amber-400 transition-colors">Depoimentos</a></li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento (Deslocado para a direita) */}
          <div className="w-full md:w-[45%] lg:w-[25%] text-left">
            <h4 className="text-amber-500 font-bold uppercase tracking-widest mb-6 text-sm">Atendimento</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1"><MapPin size={18} /></span>
                <span>Rua Campo Grande, 1014, sala 205<br />Campo Grande - RJ</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-500"><Phone size={18} /></span>
                <span>(21) 96407-4111</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Redes */}
          <div className="w-full md:w-[45%] lg:w-[15%] text-left lg:text-right flex flex-col items-start lg:items-end">
            <h4 className="text-amber-500 font-bold uppercase tracking-widest mb-6 text-sm">Siga-nos</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all cursor-pointer text-zinc-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all cursor-pointer text-zinc-300">
                <Facebook size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Roberto Falco Advogados. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300">Privacidade</a>
            <a href="#" className="hover:text-zinc-300">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
