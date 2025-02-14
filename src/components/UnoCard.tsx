
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  return (
    <motion.div
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      className={cn(
        "relative w-24 h-36 rounded-xl shadow-lg cursor-pointer transition-all duration-300",
        colorClasses[color],
        isPlayable ? "hover:shadow-xl ring-2 ring-white/50" : "opacity-90",
        "border-4",
        className
      )}
      onClick={isPlayable ? onClick : undefined}
    >
      {/* Card Background Pattern */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-white/10 transform rotate-45">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_transparent_30%,_currentColor_70%)] opacity-10" />
        </div>
      </div>

      {/* Card Value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Top-left mini value */}
          <span className="absolute -top-14 -left-8 text-lg font-bold text-white/90">
            {value}
          </span>
          
          {/* Main value */}
          <span className="text-4xl font-bold text-white drop-shadow-lg transform -rotate-12">
            {value}
          </span>
          
          {/* Bottom-right mini value */}
          <span className="absolute -bottom-14 -right-8 text-lg font-bold text-white/90 rotate-180">
            {value}
          </span>
        </div>
      </div>

      {/* UNO Logo */}
      <div className="absolute bottom-2 right-2">
        <span className="text-xs font-bold text-white/60">UNO</span>
      </div>

      {/* Card Border Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-50" />
    </motion.div>
  );
};

export default UnoCard;
