
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DrawDeckCardProps {
  pendingDrawCount: number;
  isCurrentPlayer: boolean;
  onClick: () => void;
}

const DrawDeckCard = ({ pendingDrawCount, isCurrentPlayer, onClick }: DrawDeckCardProps) => {
  const shouldGlow = pendingDrawCount > 0 && isCurrentPlayer;
  
  return (
    <div
      className="group relative py-2 px-1 cursor-pointer"
      onClick={isCurrentPlayer ? onClick : undefined}
    >
      <motion.div
        whileHover={isCurrentPlayer ? { y: -10, scale: 1.05 } : {}}
        whileTap={isCurrentPlayer ? { scale: 0.95 } : {}}
        className={cn(
          "relative w-14 h-22 sm:w-16 sm:h-24 md:w-20 md:h-30 rounded-xl",
          "border-2 backdrop-blur-sm transition-all duration-300 border-white/20 dark:border-white/10",
          !isCurrentPlayer && "opacity-70",
          pendingDrawCount > 0 && isCurrentPlayer ? "animate-pulse" : ""
        )}
      >
        {/* Fancy background with futuristic pattern */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-900">
            {/* Futuristic grid pattern */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,theme(colors.white/10)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.white/10)_1px,transparent_1px)] bg-[size:14px_14px]"></div>
            
            {/* Glowing circles */}
            <div className="absolute top-0 right-0 w-10 h-10 rounded-full bg-fuchsia-500/20 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 rounded-full bg-violet-500/30 blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-400/60 blur-md"></div>
          </div>
        </div>
        
        {/* UNO logo */}
        <div className="absolute inset-x-0 top-2 flex justify-center">
          <span className="text-white font-extrabold tracking-wider text-xs sm:text-sm" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' }}>
            UNO
          </span>
        </div>
        
        {/* Draw text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-white font-semibold text-[10px] sm:text-xs block" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.8)' }}>
              {pendingDrawCount > 0 && isCurrentPlayer 
                ? `DRAW ${pendingDrawCount}` 
                : "DRAW"}
            </span>
          </div>
        </div>

        {/* Small pattern at the bottom */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center">
          <div className="w-8 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full opacity-70"></div>
        </div>
      </motion.div>
      
      {/* Enhanced glow effect for when player must draw */}
      {shouldGlow && (
        <div className="absolute inset-0 bg-fuchsia-600/30 dark:bg-fuchsia-600/40 rounded-xl filter blur-md opacity-70 animate-pulse z-[-1]" />
      )}
    </div>
  );
};

export default DrawDeckCard;
