
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DrawDeckCardProps {
  pendingDrawCount: number;
  isCurrentPlayer: boolean;
  onClick: () => void;
}

const DrawDeckCard = ({
  pendingDrawCount,
  isCurrentPlayer,
  onClick,
}: DrawDeckCardProps) => {
  const shouldGlow = isCurrentPlayer && pendingDrawCount > 0;
  
  return (
    <div className="relative">
      {pendingDrawCount > 0 && (
        <div className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white">
          {pendingDrawCount}
        </div>
      )}
    
      <motion.div
        className={cn(
          "relative w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28",
          "rounded-xl overflow-hidden cursor-pointer transition-all duration-150",
          "border-2 backdrop-blur-sm border-white/30 dark:border-white/20",
          shouldGlow ? "animate-pulse" : ""
        )}
        style={{
          backgroundColor: "#240046",
          backgroundImage: "radial-gradient(circle, #5a189a 0%, #240046 100%)",
          boxShadow: shouldGlow ? "0 0 15px rgba(90, 24, 154, 0.8), 0 0 30px rgba(90, 24, 154, 0.5)" : "0 4px 8px rgba(0, 0, 0, 0.3)"
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: [0, 5, 0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl font-extrabold text-white drop-shadow-lg">UNO</div>
        </div>
        
        {/* Card decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-500 opacity-80"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-blue-500 opacity-80"></div>
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 opacity-80"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-yellow-500 opacity-80"></div>
        
        {/* Subtle patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0"></div>
        
        {/* Futuristic lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30"></div>
      </motion.div>
      
      {shouldGlow && (
        <motion.div 
          className="absolute inset-0 rounded-xl bg-purple-600/20 z-[-1]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </div>
  );
};

export default DrawDeckCard;
