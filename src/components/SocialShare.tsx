import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare = ({ url, title }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-blue-700",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:text-whatsapp",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar link");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground font-body mr-2">Compartilhar:</span>
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          size="icon"
          className={`text-muted-foreground transition-colors ${link.color}`}
          asChild
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${link.name}`}
          >
            <link.icon className="w-5 h-5" />
          </a>
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={copyToClipboard}
        aria-label="Copiar link"
      >
        <Link2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default SocialShare;
