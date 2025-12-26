import { motion } from "framer-motion";
import { Button } from "./ui/button";

const AboutSection = () => {
  const whatsappLink = "https://wa.me/5521969104121?text=Olá%20Keliane,%20vim%20através%20do%20site%20e%20gostaria%20de%20marcar%20uma%20consulta!";

  return (
    <section className="bg-hero-secondary section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-primary-foreground"
          >
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight">
              Keliane Machado – Advocacia Previdenciária com foco em resultados e cuidado com o cliente
            </h2>
            
            <div className="space-y-4 text-primary-foreground/80 font-body text-base leading-relaxed">
              <p>
                A advogada <strong className="text-primary-foreground">Keliane Machado</strong> é especializada em{" "}
                <strong className="text-primary-foreground">Direito Previdenciário</strong> e atua com excelência na defesa dos direitos de segurados do INSS e servidores públicos. Seu trabalho é pautado na responsabilidade, na escuta atenta e na busca por soluções jurídicas eficientes para garantir o acesso a{" "}
                <span className="text-primary-foreground">aposentadorias, pensões, benefícios por incapacidade, BPC/LOAS e revisões previdenciárias</span>.
              </p>
              
              <p>
                Com atendimento humanizado e profundo conhecimento técnico, Keliane acompanha de perto cada etapa do processo, orientando seus clientes com clareza e compromisso. Seu objetivo é assegurar que cada pessoa receba o benefício que tem direito, de forma justa e dentro dos prazos legais.
              </p>
              
              <p className="font-medium text-primary-foreground">
                Se você precisa de apoio para conquistar seu benefício previdenciário ou revisar valores recebidos, conte com a experiência da Dra. Keliane Machado.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8"
            >
              <Button variant="hero" size="lg" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Contato
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden shadow-medium">
              <img
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=600,h=750,fit=crop/mv0WzXj6PgHlLWKn/whatsapp-image-2025-04-22-at-15.34.12-mxB4N1nZyQsPQxkX.jpeg"
                alt="Dra. Keliane Machado - Advogada Previdenciária"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
