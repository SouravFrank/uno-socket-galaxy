
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  RotateCcw, 
  SkipForward, 
  Plus, 
  Shuffle,
  Ban
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
  const colorClasses = {
    red: "bg-gradient-to-br from-red-600 to-red-700 border-red-400 shadow-red-500/30",
    blue: "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400 shadow-blue-500/30",
    green: "bg-gradient-to-br from-green-600 to-green-700 border-green-400 shadow-green-500/30",
    yellow: "bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-300 shadow-yellow-400/30",
    black: "bg-gradient-to-br from-gray-800 to-black border-gray-700 shadow-gray-700/30",
  };

  // Function to determine the icon based on card value
  const getCardIcon = () => {
    switch(value) {
      case "Skip":
        return <Ban className="text-white/90 w-6 h-6 md:w-8 md:h-8" />;
      case "Reverse":
        return <RotateCcw className="text-white/90 w-6 h-6 md:w-8 md:h-8" />;
      case "+2":
        return (
          <div className="relative">
            <Plus className="text-white/90 w-5 h-5 md:w-7 md:h-7" />
            <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-black/40 rounded-full w-4 h-4 flex items-center justify-center">2</span>
          </div>
        );
      case "Wild":
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

  // Function to get card value text
  const getCardValueText = () => {
    if (typeof value === "number" || value === "+2" || value === "+4") {
      return value;
    }
    return "";
  };

  return (
    <div className="group relative py-2 px-1">
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
          boxShadow: isPlayable ? "0 0 15px rgba(255, 255, 255, 0.5)" : "0 4px 6px rgba(0, 0, 0, 0.1)" 
        }}
      >
        {/* Card Pattern */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent">
            {color !== "black" && (
              <div className="absolute inset-0">
                <div className="absolute top-[10%] left-[10%] right-[10%] bottom-[10%] rounded-full border-[8px] border-white/20 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-5xl text-white/30 transform -rotate-30">
                      UNO
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Top-left mini value */}
            <span className="absolute -top-[20px] -left-[16px] text-xs font-bold text-white/90 drop-shadow-md">
              {getCardValueText()}
            </span>
            
            {/* Main value or icon */}
            <div className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg transform -rotate-12">
              {getCardIcon() || getCardValueText()}
            </div>
            
            {/* Bottom-right mini value */}
            <span className="absolute -bottom-[20px] -right-[16px] text-xs font-bold text-white/90 drop-shadow-md rotate-180">
              {getCardValueText()}
            </span>
          </div>
        </div>

        {/* Special card description */}
        {typeof value !== "number" && (
          <div className="absolute bottom-1 left-0 right-0 text-center">
            <span className="text-[6px] font-medium text-white/80">{value}</span>
          </div>
        )}

        {/* UNO Logo */}
        <div className="absolute top-1 left-0 w-full">
          <span className="text-[8px] font-bold text-white/80 tracking-widest">UNO</span>
        </div>
      </motion.div>
      
      {/* Glow effect for playable cards */}
      {isPlayable && (
        <div className="absolute inset-0 bg-white/30 dark:bg-white/20 rounded-xl filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[-1] animate-pulse" />
      )}
    </div>
  );
};

export default UnoCard;
