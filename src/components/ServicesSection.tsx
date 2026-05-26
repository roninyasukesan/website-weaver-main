import { motion } from "framer-motion";

const ServicesSection = () => {
  const services = [
    {
      id: "previdenciario",
      title: "Direito Previdenciário",
      description:
        "Atuamos na proteção dos direitos dos segurados do INSS e servidores públicos, oferecendo suporte jurídico especializado na obtenção e revisão de benefícios previdenciários, com foco em resultados seguros e no reconhecimento dos direitos dos nossos clientes.",
      items: [
        "Aposentadorias (por idade, tempo de contribuição, especial e por invalidez)",
        "Revisão de benefícios com erro no cálculo ou tempo de contribuição",
        "Auxílio-doença, aposentadoria por incapacidade e BPC/LOAS",
        "Planejamento previdenciário e orientação preventiva",
      ],
    },
    {
      id: "direito-aereo",
      title: "Direito Aéreo",
      description:
        "Oferecemos assistência jurídica especializada em conflitos e demandas envolvendo companhias aéreas, com foco na reparação de prejuízos sofridos por passageiros e profissionais do setor, garantindo agilidade e assertividade na resolução dos casos.",
      items: [
        "Indenizações por atraso, cancelamento de voo e overbooking",
        "Extravio, perda ou danos em bagagens",
        "Reembolso de passagens e cobranças indevidas",
        "Defesa de direitos de aeronautas e demais profissionais da aviação",
      ],
    },
  ];

  return (
    <section className="bg-background section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Saiba o que podemos fazer por você
          </h2>
        </motion.div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                <h3 className="font-heading text-2xl md:text-3xl text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-body font-semibold text-foreground">Nossa Atuação</h4>
                  <ul className="space-y-2">
                    {service.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-muted-foreground font-body"
                      >
                        <span className="text-accent mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="bg-secondary rounded-lg p-8 h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <svg
                      className="w-24 h-24 mx-auto mb-4 opacity-50"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                    >
                      {service.id === "previdenciario" ? (
                        // Scale of Justice icon
                        <>
                          <rect x="48" y="15" width="4" height="70" />
                          <rect x="30" y="80" width="40" height="5" rx="2" />
                          <rect x="25" y="20" width="50" height="4" />
                          <circle cx="25" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
                          <circle cx="75" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
                          <line x1="25" y1="24" x2="25" y2="23" stroke="currentColor" strokeWidth="2" />
                          <line x1="75" y1="24" x2="75" y2="33" stroke="currentColor" strokeWidth="2" />
                        </>
                      ) : (
                        // Airplane icon
                        <>
                          <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" />
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
