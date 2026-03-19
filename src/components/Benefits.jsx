import React from 'react';
import { Shield, Zap, FileText, UserCheck } from 'lucide-react';

const Benefits = () => {
    const pillars = [
        {
            icon: <Shield size={40} />,
            title: "Defesa Técnica Rigorosa",
            desc: "Análise minuciosa de cada detalhe do contrato e da jornada de trabalho."
        },
        {
            icon: <Zap size={40} />,
            title: "Agilidade Processual",
            desc: "Foco em soluções rápidas e eficazes para que você receba o que é seu por direito."
        },
        {
            icon: <FileText size={40} />,
            title: "Transparência Total",
            desc: "Você acompanha cada passo do seu processo de forma clara e direta."
        },
        {
            icon: <UserCheck size={40} />,
            title: "Atendimento Humanizado",
            desc: "Entendemos sua rotina e estamos sempre disponíveis para tirar suas dúvidas."
        }
    ];

    return (
        <section className="benefits bg-dark">
            <div className="container">
                <div className="benefits-grid">
                    {pillars.map((pillar, index) => (
                        <div key={index} className="benefit-card">
                            <div className="benefit-icon-wrapper">
                                {pillar.icon}
                            </div>
                            <h3 className="benefit-title">{pillar.title}</h3>
                            <p className="benefit-desc">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        .benefits {
          padding: 100px 0;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 40px;
        }
        .benefit-card {
          text-align: center;
          padding: 20px;
        }
        .benefit-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(193, 154, 107, 0.1);
          border: 1px solid rgba(193, 154, 107, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 25px;
          color: var(--accent);
          transition: var(--transition);
        }
        .benefit-card:hover .benefit-icon-wrapper {
          background: var(--accent);
          color: var(--bg-dark);
          transform: rotate(5deg);
        }
        .benefit-title {
          font-size: 1.2rem;
          margin-bottom: 15px;
          color: var(--text-white);
        }
        .benefit-desc {
          color: var(--text-gray);
          font-size: 0.95rem;
          line-height: 1.6;
        }
      `}</style>
        </section>
    );
};

export default Benefits;
