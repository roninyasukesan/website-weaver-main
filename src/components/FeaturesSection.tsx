import { motion } from "framer-motion";
import { MapPin, Scale, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Precisa falar com um advogado",
      subtitle: "Atuamos em todo o Brasil com atendimento on-line também",
    },
    {
      icon: Scale,
      title: "Somos especialistas em Direito",
      subtitle: "",
    },
    {
      icon: Zap,
      title: "Atendimento Rápido",
      subtitle: "",
    },
  ];

  return (
    <section className="bg-hero section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-hero-secondary rounded-full flex items-center justify-center">
                <feature.icon className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xl text-primary-foreground mb-2">
                {feature.title}
              </h3>
              {feature.subtitle && (
                <p className="text-primary-foreground/70 font-body text-sm">
                  {feature.subtitle}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
