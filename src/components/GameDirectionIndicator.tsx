
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface GameDirectionIndicatorProps {
  direction: "clockwise" | "counter-clockwise";
  directionChanged: boolean;
}

const GameDirectionIndicator = ({ direction, directionChanged }: GameDirectionIndicatorProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 1,
        scale: directionChanged ? [1, 1.1, 1] : 1,
      }}
      transition={{ 
        duration: 0.5,
        repeat: directionChanged ? 3 : 0,
        repeatType: "reverse"
      }}
      className="px-3 py-1 rounded-full glass-morphism text-xs inline-flex items-center gap-2"
    >
      <RotateCcw 
        className={`w-3 h-3 ${direction === "clockwise" ? "rotate-180" : ""} ${
          directionChanged ? "text-purple-400" : "text-gray-400"
        }`} 
      />
      <span>
        {direction === "clockwise" ? "Clockwise" : "Counter-Clockwise"}
      </span>
    </motion.div>
  );
};

export default GameDirectionIndicator;
export { GameDirectionIndicator };
