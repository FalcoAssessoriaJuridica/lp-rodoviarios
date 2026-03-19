import React from 'react';
import robertoImg from '../assets/roberto_hero.png';

const Hero = () => {
  return (
    <section className="hero bg-dark">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-tagline">ESPECIALISTA EM DIREITO RODOVIÁRIO</span>
          <h1 className="hero-title">
            Defesa <span className="text-accent">Especializada</span> para Motoristas e Cobradores
          </h1>
          <p className="hero-description">
            Garanta seus direitos trabalhistas com quem entende a rotina e os desafios da categoria rodoviária. Atendimento humanizado e focado em resultados rápidos.
          </p>
          <div className="hero-ctas">
            <a href="https://wa.me/5521964074111?text=Olá,%20gostaria%20de%20falar%20com%20um%20advogado%20especializado%20em%20defesa%20dos%20rodoviários." className="btn-whatsapp">
              FALAR COM UM ESPECIALISTA AGORA
            </a>
            <p className="hero-trust">Atendimento em todo o Brasil via vídeo chamada</p>
          </div>
        </div>
        <div className="hero-image-container">
          <img src={robertoImg} alt="Roberto Falco" className="hero-image" />
        </div>
      </div>
      <style>{`
        .hero {
          padding-top: 140px;
          padding-bottom: 80px;
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(193, 154, 107, 0.1) 0%, transparent 70%);
          z-index: 0;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hero-tagline {
          color: var(--accent);
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 15px;
        }
        .hero-title {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 25px;
          font-weight: 800;
        }
        .hero-description {
          font-size: 1.1rem;
          color: var(--text-gray);
          margin-bottom: 40px;
          max-width: 600px;
        }
        .hero-trust {
          font-size: 0.8rem;
          color: var(--text-gray);
          margin-top: 15px;
          opacity: 0.7;
        }
        .hero-image-container {
          position: relative;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(193, 154, 107, 0.3);
          box-shadow: 0 0 50px rgba(193, 154, 107, 0.1);
          margin: 0 auto;
        }
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: drop-shadow(0 20px 50px rgba(0,0,0,0.5));
        }
        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-image {
            margin: 0 auto;
            max-width: 350px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
