import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const whatsappLink = "https://wa.me/5521969104121?text=Olá%20Keliane,%20vim%20através%20do%20site%20e%20gostaria%20de%20marcar%20uma%20consulta!";

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-whatsapp hover:bg-whatsapp-hover transition-colors duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-accent-foreground" fill="currentColor" />
      
      {/* Pulse animation ring */}
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-30" />
    </motion.a>
  );
};

export default WhatsAppButton;
