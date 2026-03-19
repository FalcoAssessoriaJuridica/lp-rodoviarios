import React from 'react';
import { CheckCircle } from 'lucide-react';

const Services = () => {
  const rights = [
    "Horas Extras não pagas corretamente",
    "Adicional de Insalubridade e Periculosidade",
    "Intervalos Intrajornada desrespeitados",
    "Diferenças de FGTS e Verbas Rescisórias",
    "Acidentes de Trabalho e Doenças Ocupacionais",
    "Danos Morais por condições de trabalho degradantes"
  ];

  return (
    <section id="casos" className="services">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Nossa Atuação nos Seus <span className="text-accent">Direitos</span></h2>
          <p className="section-subtitle">Identificamos as irregularidades mais comuns no setor rodoviário para garantir sua indenização.</p>
        </div>

        <div className="services-grid">
          {rights.map((right, index) => (
            <div key={index} className="service-card">
              <CheckCircle className="service-icon" size={24} />
              <p className="service-text">{right}</p>
            </div>
          ))}
        </div>

        <div className="services-cta text-center">
          <a href="https://wa.me/5521964074111?text=Olá,%20gostaria%20de%20falar%20com%20um%20advogado%20especializado%20em%20defesa%20dos%20rodoviários." className="btn-whatsapp">
            QUERO UMA ANÁLISE DO MEU CASO
          </a>
        </div>
      </div>
      <style>{`
        .services {
          background-color: #f9f9f9;
        }
        .text-center { text-align: center; }
        .section-header { margin-bottom: 60px; max-width: 800px; margin-left: auto; margin-right: auto; }
        .section-title { font-size: 2.5rem; margin-bottom: 15px; }
        .section-subtitle { font-size: 1.1rem; color: #666; }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 50px;
        }
        .service-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          transition: var(--transition);
          border: 1px solid transparent;
        }
        .service-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .service-icon {
          color: var(--accent);
          flex-shrink: 0;
        }
        .service-text {
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          color: var(--text-dark);
        }
        .services-cta {
          margin-top: 40px;
        }
        @media (max-width: 768px) {
          .section-title { font-size: 2rem; }
        }
      `}</style>
    </section>
  );
};

export default Services;
