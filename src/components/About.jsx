import React from 'react';
import robertoAbout from '../assets/roberto_about.png';

const About = () => {
  return (
    <section id="sobre" className="about">
      <div className="container about-container">
        <div className="about-image-side">
          <div className="about-image-wrapper">
            <img src={robertoAbout} alt="Roberto Falco" className="about-img" />
            <div className="about-experience">
              <span className="exp-number">15+</span>
              <span className="exp-text">Anos de Experiência</span>
            </div>
          </div>
        </div>
        <div className="about-content">
          <span className="hero-tagline">CONHEÇA SEU DEFENSOR</span>
          <h2 className="section-title">Somos Especialistas No Que <span className="text-accent">Fazemos!</span></h2>
          <p className="about-text">
            Somos uma equipe de advogados dedicados, liderados pelo renomado advogado Roberto Falco, com mais de 15 anos de experiência no mercado jurídico.
          </p>
          <p className="about-text">
            Entendemos que cada cliente é único e merece um atendimento personalizado e de qualidade. Por isso, trabalhamos de forma próxima e dedicada, colocando os interesses dos nossos clientes em primeiro lugar.
          </p>
          <p className="about-text">
            Nossa missão é buscar a justiça e proteger seus direitos, enquanto buscamos soluções ágeis e eficazes para os desafios jurídicos que enfrentam.
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <h4 className="stat-value">5.000+</h4>
              <p className="stat-label">Processos Atendidos</p>
            </div>
            <div className="stat-item">
              <h4 className="stat-value">98%</h4>
              <p className="stat-label">Satisfação dos Clientes</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .about {
          background-color: white;
          padding: 120px 0;
        }
        .about-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .about-image-wrapper {
          position: relative;
          background-color: white;
          border-radius: 30px;
          padding-top: 50px;
          overflow: visible;
        }
        .about-img {
          width: 100%;
          display: block;
          position: relative;
          z-index: 1;
        }
        .about-experience {
          position: absolute;
          bottom: -30px;
          right: -30px;
          background: var(--accent);
          color: var(--bg-dark);
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 15px 40px rgba(193, 154, 107, 0.4);
          z-index: 2;
          display: flex;
          flex-direction: column;
        }
        .exp-number {
          font-size: 2.5rem;
          font-weight: 800;
          line-height:1;
        }
        .exp-text {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .about-text {
          font-size: 1.05rem;
          color: #555;
          margin-bottom: 20px;
          line-height: 1.8;
        }
        .about-stats {
          display: flex;
          gap: 40px;
          margin-top: 40px;
          border-top: 1px solid #eee;
          padding-top: 40px;
        }
        .stat-value {
          font-size: 1.8rem;
          color: var(--accent);
          margin-bottom: 5px;
        }
        .stat-label {
          font-size: 0.85rem;
          color: #888;
          font-weight: 600;
        }
        @media (max-width: 992px) {
          .about-container {
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .about-image-side {
            order: 2;
          }
          .about-image-wrapper {
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
