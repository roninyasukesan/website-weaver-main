import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Logo from "./Logo";

const HeroSection = () => {
  const whatsappLink = "https://wa.me/5521969104121?text=Olá%20Keliane,%20vim%20através%20do%20site%20e%20gostaria%20de%20marcar%20uma%20consulta!";

  return (
    <section id="home" className="relative min-h-screen bg-hero flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-hero via-hero to-hero-secondary opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 container-custom px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-8"
        >
          <Logo size="lg" className="text-primary-foreground" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Button 
              variant="hero" 
              size="lg"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Entre em Contato
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-hero-secondary to-transparent" />
    </section>
  );
};

export default HeroSection;
