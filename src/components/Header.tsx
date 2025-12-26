import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import Logo from "./Logo";
import { Button } from "./ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Direito Aéreo", href: "/#direito-aereo" },
    { name: "Blog", href: "/blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("/#")) return location.pathname === "/" && location.hash === href.slice(1);
    return location.pathname.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#")) {
      const elementId = href.slice(2);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-hero/95 backdrop-blur-sm">
      <div className="container-custom flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/">
          <Logo size="sm" className="text-primary-foreground" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href.startsWith("/#") ? (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 font-body text-sm tracking-wide relative group ${
                  isActive(link.href) ? "text-primary-foreground" : ""
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-foreground transition-transform duration-300 origin-left ${
                  isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className={`text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 font-body text-sm tracking-wide relative group ${
                  isActive(link.href) ? "text-primary-foreground" : ""
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-foreground transition-transform duration-300 origin-left ${
                  isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            )
          ))}
          <Link to="/auth">
            <Button variant="secondary" className="gap-2">
              <User className="h-4 w-4" />
              Entrar
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-primary-foreground p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-hero border-t border-primary-foreground/10"
          >
            <div className="container-custom py-4 px-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                link.href.startsWith("/#") ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 font-body text-base py-2"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 font-body text-base py-2"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2"
              >
                <Button variant="secondary" className="w-full gap-2">
                  <User className="h-4 w-4" />
                  Área do Cliente
                </Button>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
