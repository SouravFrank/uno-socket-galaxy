
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
    red: "bg-gradient-to-br from-red-500 to-red-600",
    blue: "bg-gradient-to-br from-blue-500 to-blue-600",
    green: "bg-gradient-to-br from-green-500 to-green-600",
    yellow: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    black: "bg-gradient-to-br from-gray-800 to-black",
  };

  return (
    <motion.div
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      className={cn(
        "relative w-24 h-36 rounded-xl shadow-lg cursor-pointer transition-all duration-300",
        colorClasses[color],
        isPlayable ? "hover:shadow-xl" : "opacity-80",
        className
      )}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className="absolute inset-2 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <span className="text-3xl font-bold text-white drop-shadow-md">
          {value}
        </span>
      </div>
      <div className="absolute inset-0 rounded-xl border border-white/20" />
    </motion.div>
  );
};

export default UnoCard;
