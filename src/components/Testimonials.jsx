import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const reviews = [
        {
            name: "Karla Dias Ellis Olanda",
            text: "Advogado excelente e muito atencioso! Muito competente no que se propõe a fazer!!!!!!",
            stars: 5,
            avatar: "K"
        },
        {
            name: "Gilvan Valença",
            text: "Muito bom, atencioso e faz um ótimo trabalho judicial. Super recomendo.",
            stars: 5,
            avatar: "G"
        },
        {
            name: "RAMOS Intermediação Imobiliária",
            text: "Advogado de Excelência, Honesto que Respeita os seus Clientes.",
            stars: 5,
            avatar: "R"
        }
    ];

    return (
        <section id="depoimentos" className="testimonials">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">O que nossos <span className="text-accent">Clientes</span> dizem</h2>
                    <p className="section-subtitle">A satisfação de quem já confiou no nosso trabalho é o nosso maior patrimônio.</p>
                </div>

                <div className="testimonials-grid">
                    {reviews.map((review, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="stars">
                                {[...Array(review.stars)].map((_, i) => (
                                    <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />
                                ))}
                            </div>
                            <p className="testimonial-text">"{review.text}"</p>
                            <div className="testimonial-user">
                                <div className="user-avatar">{review.avatar}</div>
                                <div className="user-info">
                                    <h4 className="user-name">{review.name}</h4>
                                    <p className="user-status">Cliente Verificado</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        .testimonials {
          background-color: #f9f9f9;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        .testimonial-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }
        .stars {
          display: flex;
          gap: 5px;
          margin-bottom: 20px;
        }
        .testimonial-text {
          font-style: italic;
          color: #444;
          margin-bottom: 25px;
          line-height: 1.8;
          flex-grow: 1;
        }
        .testimonial-user {
          display: flex;
          align-items: center;
          gap: 15px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .user-avatar {
          width: 45px;
          height: 45px;
          background: var(--bg-dark);
          color: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }
        .user-name {
          font-size: 1rem;
          margin-bottom: 2px;
        }
        .user-status {
          font-size: 0.75rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
      `}</style>
        </section>
    );
};

export default Testimonials;
