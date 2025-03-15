
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Shuffle,
  CircleSlash, // For Skip symbol
  ArrowLeftRight, // For Reverse symbol
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
  // Base colors for cards that match official UNO colors
  const baseColors = {
    red: 'rgb(237, 28, 36)',
    blue: 'rgb(0, 114, 188)',
    green: 'rgb(0, 169, 79)',
    yellow: 'rgb(255, 233, 0)',
    black: 'rgb(35, 31, 32)'
  };
  
  // Shadow colors for glow effects
  const glowColors = {
    red: 'rgba(237, 28, 36, 0.7)',
    blue: 'rgba(0, 114, 188, 0.7)',
    green: 'rgba(0, 169, 79, 0.7)',
    yellow: 'rgba(255, 233, 0, 0.7)',
    black: 'rgba(255, 255, 255, 0.7)',
  };

  // Dynamic shadow with enhanced glow for playable cards
  const cardShadow = isPlayable
    ? `0 4px 6px rgba(0, 0, 0, 0.1), 0 0 10px ${glowColors[color]}, 0 0 20px ${glowColors[color]}`
    : `0 4px 6px rgba(0, 0, 0, 0.1), 0 0 5px ${glowColors[color]}`;

  // Color classes for card backgrounds
  const colorClasses = {
    red: `bg-[${baseColors.red}] border-red-400`,
    blue: `bg-[${baseColors.blue}] border-blue-400`,
    green: `bg-[${baseColors.green}] border-green-400`,
    yellow: `bg-[${baseColors.yellow}] border-yellow-300`,
    black: `bg-[${baseColors.black}] border-gray-700`,
  };

  // Determine the icon for special cards
  const GetCardIcon = () => {
    switch(String(value).toLowerCase()) {
      case "skip":
        return <CircleSlash className="text-white/90 w-6 h-6 md:w-8 md:h-8" />;
      case "reverse":
        return <ArrowLeftRight className="text-white/90 w-6 h-6 md:w-8 md:h-8" />;
      case "+2":
        return (
          <div className="relative">
            <Plus className="text-white/90 w-5 h-5 md:w-7 md:h-7" />
            <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-black/60 rounded-full w-5 h-5 flex items-center justify-center">2</span>
          </div>
        );
      case "wild":
        return <Shuffle className="text-white/90 w-6 h-6 md:w-8 md:h-8" />;
      case "+4":
        return (
          <div className="relative">
            <Plus className="text-white/90 w-5 h-5 md:w-7 md:h-7" />
            <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-black/60 rounded-full w-5 h-5 flex items-center justify-center">4</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Get card value text for numbers
  const getCardValueText = () => {
    if (typeof value === "number") {
      return value;
    } 
    return "";
  };

  return (
    <div className="group relative py-2 px-1 cursor-pointer overflow-visible">
      {/* Main card container with motion effects */}
      <motion.div
        whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
        whileTap={isPlayable ? { scale: 0.95 } : {}}
        className={cn(
          "relative w-14 h-22 sm:w-16 sm:h-24 md:w-20 md:h-30 rounded-xl overflow-hidden",
          isPlayable 
            ? "hover:shadow-xl hover:shadow-white/20 dark:hover:shadow-black/40 dark:ring-2 dark:ring-white/30" 
            : "opacity-90",
          "border-2 backdrop-blur-sm transition-all duration-300 border-white/20 dark:border-white/10",
          "flex items-center justify-center",
          className
        )}
        onClick={isPlayable ? onClick : undefined}
        style={{ 
          zIndex: isPlayable ? 10 : 1,
          backgroundColor: baseColors[color],
          boxShadow: cardShadow
        }}
      >
        {/* Card oval design - similar to real UNO cards */}
        <div className="absolute inset-[10%] bg-white/90 rounded-[100%] flex items-center justify-center transform -rotate-12">
          {/* Central card content - number or icon */}
          <div className="relative">
            {/* For number cards */}
            {typeof value === "number" && (
              <span 
                className="text-3xl sm:text-4xl font-extrabold transform -rotate-0" 
                style={{ color: baseColors[color] }}
              >
                {value}
              </span>
            )}
            
            {/* For special cards */}
            {typeof value !== "number" && (
              <div className="flex flex-col items-center">
                <div className="transform -rotate-0" style={{ color: baseColors[color] }}>
                  <GetCardIcon />
                </div>
                <span className="text-xs font-semibold mt-1" style={{ color: baseColors[color] }}>
                  {value}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Top-left corner number/symbol */}
        <div className="absolute top-1 left-1 text-white font-bold text-xs">
          {typeof value === "number" ? value : value === "+2" ? "+2" : value === "+4" ? "+4" : ""}
        </div>
        
        {/* Bottom-right corner number/symbol (upside down) */}
        <div className="absolute bottom-1 right-1 text-white font-bold text-xs transform rotate-180">
          {typeof value === "number" ? value : value === "+2" ? "+2" : value === "+4" ? "+4" : ""}
        </div>
      </motion.div>
      
      {/* Enhanced glow effect for playable cards */}
      {isPlayable && (
        <div className="absolute inset-0 bg-white/30 dark:bg-white/20 rounded-xl filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[-1] animate-pulse" />
      )}
    </div>
  );
};

export default UnoCard;
