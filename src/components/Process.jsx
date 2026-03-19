import React from 'react';
import { ClipboardList, Search, Gavel, CheckCircle2 } from 'lucide-react';

const Process = () => {
    const steps = [
        {
            icon: <ClipboardList size={32} />,
            title: "Relato Inicial",
            desc: "Você nos conta o seu problema e envia os documentos básicos."
        },
        {
            icon: <Search size={32} />,
            title: "Análise Técnica",
            desc: "Nossos especialistas analisam viabilidade e calculam seus direitos."
        },
        {
            icon: <Gavel size={32} />,
            title: "Ação Judicial",
            desc: "Entramos com o processo e lutamos pela sua máxima indenização."
        },
        {
            icon: <CheckCircle2 size={32} />,
            title: "Recebimento",
            desc: "Monitoramos o cumprimento da sentença para que você receba rápido."
        }
    ];

    return (
        <section id="como-funciona" className="process">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Como <span className="text-accent">Funciona</span></h2>
                    <p className="section-subtitle">Um processo simples, transparente e focado no seu resultado.</p>
                </div>

                <div className="process-timeline">
                    {steps.map((step, index) => (
                        <div key={index} className="process-step">
                            <div className="step-number">{index + 1}</div>
                            <div className="step-content">
                                <div className="step-icon">{step.icon}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.desc}</p>
                            </div>
                            {index < steps.length - 1 && <div className="step-connector"></div>}
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        .process {
          background-color: white;
          padding-bottom: 100px;
        }
        .process-timeline {
          display: flex;
          justify-content: space-between;
          margin-top: 60px;
          gap: 30px;
        }
        .process-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }
        .step-number {
          width: 40px;
          height: 40px;
          background: var(--bg-dark);
          color: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
          border: 2px solid var(--accent);
        }
        .step-icon {
          color: var(--accent);
          margin-bottom: 15px;
        }
        .step-title {
          font-size: 1.1rem;
          margin-bottom: 10px;
        }
        .step-desc {
          font-size: 0.9rem;
          color: #666;
        }
        .step-connector {
          position: absolute;
          top: 20px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--accent) 0%, rgba(193, 154, 107, 0.1) 100%);
          z-index: 1;
        }
        @media (max-width: 992px) {
          .process-timeline {
            flex-direction: column;
            gap: 50px;
          }
          .step-connector {
            display: none;
          }
        }
      `}</style>
        </section>
    );
};

export default Process;
