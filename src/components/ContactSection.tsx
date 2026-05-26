import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { FileText, Users, Star } from "lucide-react";

const ContactSection = () => {
  const whatsappLink = "https://wa.me/5521969104121?text=Olá%20Keliane,%20vim%20através%20do%20site%20e%20gostaria%20de%20marcar%20uma%20consulta!";

  const stats = [
    {
      icon: FileText,
      value: "+ de 500",
      label: "ações em andamento",
    },
    {
      icon: Users,
      value: "+3.0 mil",
      label: "clientes atendidos",
    },
    {
      icon: Star,
      value: "Atendimento",
      label: "Eficiente",
    },
  ];

  return (
    <section id="blog" className="bg-background section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Fale com a gente
          </h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Nossa equipe é formada por profissionais dedicados e experientes, prontos para entender sua história e lutar pelos seus direitos.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-secondary rounded-lg p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="font-heading text-2xl text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-body text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button variant="cta" size="xl" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Entra em Contato
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
