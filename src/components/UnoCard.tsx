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
  // Glow colors for futuristic neon effects
  const glowColors = {
    red: 'rgba(239, 68, 68, 0.7)',
    blue: 'rgba(59, 130, 246, 0.7)',
    green: 'rgba(34, 197, 94, 0.7)',
    yellow: 'rgba(234, 179, 8, 0.7)',
    black: 'rgba(255, 255, 255, 0.7)',
  };

  // Dynamic shadow with enhanced glow for playable cards
  const cardShadow = isPlayable
    ? `0 4px 6px rgba(0, 0, 0, 0.1), 0 0 10px ${glowColors[color]}, 0 0 20px ${glowColors[color]}, 0 0 30px ${glowColors[color]}`
    : `0 4px 6px rgba(0, 0, 0, 0.1), 0 0 5px ${glowColors[color]}`;

  // Gradient color classes for card backgrounds
  const colorClasses = {
    red: "bg-gradient-to-br from-red-600 to-red-700 border-red-400",
    blue: "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400",
    green: "bg-gradient-to-br from-green-600 to-green-700 border-green-400",
    yellow: "bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-300",
    black: "bg-gradient-to-br from-gray-800 to-black border-gray-700",
  };

  // Determine the icon for Trump cards with unique symbols
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
            <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-black/40 rounded-full w-4 h-4 flex items-center justify-center">2</span>
          </div>
        );
      case "wild":
        return <Shuffle className="text-white/90 w-6 h-6 md:w-8 md:h-8" />;
      case "+4":
        return (
          <div className="relative">
            <Plus className="text-white/90 w-5 h-5 md:w-7 md:h-7" />
            <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-black/40 rounded-full w-4 h-4 flex items-center justify-center">4</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Get card value text for numbers and draw cards
  const getCardValueText = () => {
    if (typeof value === "number" || value === "+2" || value === "+4") {
      return value;
    }
    return "";
  };
  if (typeof value === 'number') {
    console.log("Value", value, typeof value, getCardValueText() === 0, "TEST", );
  }

  return (
    <div className="group relative py-2 px-1">
      {/* Main card container with motion effects */}
      <motion.div
        whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
        whileTap={isPlayable ? { scale: 0.95 } : {}}
        className={cn(
          "relative w-14 h-22 sm:w-16 sm:h-24 md:w-20 md:h-30 rounded-xl",
          colorClasses[color],
          isPlayable 
            ? "hover:shadow-xl hover:shadow-white/20 dark:hover:shadow-black/40 dark:ring-2 dark:ring-white/30" 
            : "opacity-90",
          "border-2 backdrop-blur-sm transition-all duration-300 border-white/20 dark:border-white/10",
          className
        )}
        onClick={isPlayable ? onClick : undefined}
        style={{ 
          zIndex: isPlayable ? 10 : 1, 
          boxShadow: cardShadow
        }}
      >
        {/* Futuristic card pattern without text branding */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent">
            {color !== "black" && (
              <div className="absolute inset-0">
                <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[10%] rounded-full border-[8px] border-white/20 flex items-center justify-center">
                  {/* Subtle tech pattern overlay */}
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
                </div>
              </div>
            )}
            {color === "black" && (
              <div className="absolute inset-0 opacity-50 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:4px_4px]" />
            )}
          </div>
        </div>

        {/* Card value or icon display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Top-left mini value */}
            <span className="absolute -top-[20px] -left-[16px] text-xs font-bold text-white/90 drop-shadow-md" style={{ textShadow: `0 0 3px ${glowColors[color]}` }}>
              {getCardValueText()}
            </span>
            
            {/* Main value or icon with neon glow */}
            {!getCardValueText() && getCardValueText()!== 0 ? (
              <div className="transform -rotate-12" style={{ filter: `drop-shadow(0 0 5px ${glowColors[color]})` }}>
                <GetCardIcon />
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg transform -rotate-12" style={{ textShadow: `0 0 5px ${glowColors[color]}, 0 0 10px ${glowColors[color]}` }}>
                {getCardValueText()}
              </span>
            )}
            
            {/* Bottom-right mini value */}
            <span className="absolute -bottom-[20px] -right-[16px] text-xs font-bold text-white/90 drop-shadow-md rotate-180" style={{ textShadow: `0 0 3px ${glowColors[color]}` }}>
              {getCardValueText()}
            </span>
          </div>
        </div>

        {/* Special card description */}
        {typeof value !== "number" && value !== '+2' && value !== '+4' && (
          <div className="absolute bottom-1 left-0 right-0 text-center">
            <span className="text-[16px] font-medium text-white/80" style={{ textShadow: '0 0 2px white' }}>
              {value}
            </span>
          </div>
        )}
      </motion.div>
      
      {/* Enhanced glow effect for playable cards */}
      {isPlayable && (
        <div className="absolute inset-0 bg-white/30 dark:bg-white/20 rounded-xl filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[-1] animate-pulse" />
      )}
    </div>
  );
};

export default UnoCard;