import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-12",
    md: "h-20",
    lg: "h-32",
  };

  return (
    <motion.div 
      className={`flex items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        viewBox="0 0 200 100"
        className={`${sizeClasses[size]} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* K letter */}
        <text
          x="25"
          y="70"
          className="fill-current"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "60px",
            fontWeight: 400,
          }}
        >
          K
        </text>

        {/* Column/Pillar in the middle */}
        <g className="fill-current">
          {/* Top capital */}
          <rect x="88" y="20" width="24" height="4" rx="1" />
          <rect x="90" y="24" width="20" height="3" />
          
          {/* Column shaft with flutes */}
          <rect x="92" y="27" width="16" height="45" />
          <rect x="94" y="27" width="2" height="45" className="fill-current opacity-30" />
          <rect x="98" y="27" width="2" height="45" className="fill-current opacity-30" />
          <rect x="102" y="27" width="2" height="45" className="fill-current opacity-30" />
          
          {/* Base */}
          <rect x="90" y="72" width="20" height="3" />
          <rect x="88" y="75" width="24" height="4" rx="1" />
        </g>

        {/* M letter */}
        <text
          x="115"
          y="70"
          className="fill-current"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "60px",
            fontWeight: 400,
          }}
        >
          M
        </text>
      </svg>
    </motion.div>
  );
};

export default Logo;
