
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  RotateCcw, 
  SkipForward, 
  Plus, 
  ArrowLeftRight, 
  Shuffle 
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
    red: "bg-gradient-to-br from-red-500 to-red-600 border-red-400",
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400",
    green: "bg-gradient-to-br from-green-500 to-green-600 border-green-400",
    yellow: "bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-300",
    black: "bg-gradient-to-br from-gray-800 to-black border-gray-700",
  };

  // Function to determine the icon based on card value
  const getCardIcon = () => {
    switch(value) {
      case "Skip":
        return <SkipForward className="text-white/90 w-8 h-8" />;
      case "Reverse":
        return <RotateCcw className="text-white/90 w-8 h-8" />;
      case "+2":
        return <Plus className="text-white/90 w-8 h-8" />;
      case "Wild":
        return <Shuffle className="text-white/90 w-8 h-8" />;
      case "+4":
        return <Plus className="text-white/90 w-8 h-8" />;
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
    <div className="group relative p-2">
      <motion.div
        whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
        whileTap={isPlayable ? { scale: 0.95 } : {}}
        className={cn(
          "relative w-16 h-24 sm:w-20 sm:h-30 md:w-24 md:h-36 rounded-xl shadow-lg cursor-pointer transition-all duration-300",
          colorClasses[color],
          isPlayable 
            ? "hover:shadow-xl hover:shadow-white/20 dark:hover:shadow-black/40 ring-2 ring-white/50" 
            : "opacity-90",
          "border-2 backdrop-blur-sm",
          className
        )}
        onClick={isPlayable ? onClick : undefined}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-white/10">
            <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
          </div>
        </div>

        {/* Card Pattern */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-white/5">
            {color !== "black" && (
              <div className="absolute inset-0 opacity-20">
                <div className="absolute w-40 h-40 -top-10 -left-10 rounded-full bg-white/10" />
                <div className="absolute w-40 h-40 -bottom-10 -right-10 rounded-full bg-white/10" />
              </div>
            )}
          </div>
        </div>

        {/* Card Value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Top-left mini value */}
            <span className="absolute -top-10 -left-8 text-xs font-bold text-white/90">
              {getCardValueText()}
            </span>
            
            {/* Main value or icon */}
            <div className="text-3xl font-bold text-white drop-shadow-lg transform -rotate-12">
              {getCardIcon() || getCardValueText()}
            </div>
            
            {/* Bottom-right mini value */}
            <span className="absolute -bottom-10 -right-8 text-xs font-bold text-white/90 rotate-180">
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
        <div className="absolute top-1 right-1">
          <span className="text-[6px] font-bold text-white/60">UNO</span>
        </div>
      </motion.div>
      
      {/* Glow effect for playable cards */}
      {isPlayable && (
        <div className="absolute inset-0 bg-white/20 rounded-xl filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[-1]" />
      )}
    </div>
  );
};

export default UnoCard;
