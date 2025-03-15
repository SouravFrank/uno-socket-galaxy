
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Shuffle,
  Ban, // For Skip symbol
  RefreshCw, // For Reverse symbol
} from "lucide-react";

export interface UnoCardProps {
  color?: "red" | "blue" | "green" | "yellow" | "black";
  value: string | number;
  isPlayable?: boolean;
  onClick?: () => void;
  className?: string;
}

const UnoCard = ({
  color = "red",
  value,
  isPlayable = false,
  onClick,
  className,
}: UnoCardProps) => {
  // Official UNO colors
  const baseColors = {
    red: '#ED1C24',
    blue: '#0072BC',
    green: '#00A94F',
    yellow: '#FFED00',
    black: '#000000'
  };
  
  // Shadow colors for glow effects
  const glowColors = {
    red: 'rgba(237, 28, 36, 0.8)',
    blue: 'rgba(0, 114, 188, 0.8)',
    green: 'rgba(0, 169, 79, 0.8)',
    yellow: 'rgba(255, 237, 0, 0.8)',
    black: 'rgba(255, 255, 255, 0.7)',
  };

  // Dynamic shadow with enhanced glow for playable cards
  const cardShadow = isPlayable
    ? `0 0 15px ${glowColors[color]}, 0 0 30px ${glowColors[color]}`
    : `0 4px 8px rgba(0, 0, 0, 0.2)`;

  // Get symbol for special cards
  const getSymbol = () => {
    switch (String(value)) {
      case "skip":
        return <Ban className="w-12 h-12 text-white stroke-[1.5] drop-shadow-md" />;
      case "reverse":
        return <RefreshCw className="w-12 h-12 text-white stroke-[1.5] drop-shadow-md" />;
      case "+2":
        return (
          <div className="relative flex items-center justify-center">
            <div className="text-3xl font-bold text-white drop-shadow-md">+2</div>
          </div>
        );
      case "+4":
        return (
          <div className="relative flex items-center justify-center">
            <div className="text-3xl font-bold text-white drop-shadow-md">+4</div>
          </div>
        );
      case "wild":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-14 h-14 rounded-full overflow-hidden relative">
              <div className="absolute w-1/2 h-1/2 bg-red-600 top-0 left-0"></div>
              <div className="absolute w-1/2 h-1/2 bg-blue-600 top-0 right-0"></div>
              <div className="absolute w-1/2 h-1/2 bg-yellow-500 bottom-0 left-0"></div>
              <div className="absolute w-1/2 h-1/2 bg-green-600 bottom-0 right-0"></div>
            </div>
          </div>
        );
      default:
        if (typeof value === "number") {
          return <div className="text-5xl font-bold text-white drop-shadow-md">{value}</div>;
        }
        return null;
    }
  };

  // Determine text color
  const textColor = color === "yellow" ? "#000000" : "#FFFFFF";

  return (
    <motion.div
      className={cn(
        "relative rounded-xl overflow-hidden cursor-pointer transition-all duration-150",
        "w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28",
        isPlayable && "hover:scale-110 z-10",
        className
      )}
      style={{ 
        backgroundColor: baseColors[color],
        boxShadow: cardShadow,
      }}
      whileHover={isPlayable ? { y: -10 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      onClick={onClick}
    >
      {/* Card oval design */}
      <div className="absolute inset-[15%] bg-white/90 rounded-[100%] transform -rotate-12 flex items-center justify-center">
        {/* Card content */}
        <div className="transform rotate-12 w-full h-full flex items-center justify-center">
          {getSymbol()}
        </div>
      </div>
      
      {/* Top left corner - card value */}
      <div 
        className="absolute top-1 left-1 text-sm font-bold" 
        style={{ color: textColor }}
      >
        {typeof value === "number" ? value : 
         value === "+2" ? "+2" : 
         value === "+4" ? "+4" : 
         value === "wild" ? "W" : 
         value === "skip" ? "S" : 
         value === "reverse" ? "R" : ""}
      </div>
      
      {/* Bottom right corner - card value (mirrored) */}
      <div 
        className="absolute bottom-1 right-1 text-sm font-bold transform rotate-180" 
        style={{ color: textColor }}
      >
        {typeof value === "number" ? value : 
         value === "+2" ? "+2" : 
         value === "+4" ? "+4" : 
         value === "wild" ? "W" : 
         value === "skip" ? "S" : 
         value === "reverse" ? "R" : ""}
      </div>
      
      {/* Enhanced playable indicator */}
      {isPlayable && (
        <div className="absolute inset-0 rounded-xl animate-pulse mix-blend-overlay opacity-50 bg-white" />
      )}
    </motion.div>
  );
};

export default UnoCard;
