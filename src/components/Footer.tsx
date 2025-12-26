import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-hero py-8">
      <div className="container-custom px-4 md:px-8">
        <div className="flex flex-col items-center gap-4">
          <Logo size="sm" className="text-primary-foreground" />
          <p className="text-primary-foreground/60 font-body text-sm text-center">
            © {new Date().getFullYear()} Keliane Machado Advocacia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
