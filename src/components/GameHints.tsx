
import { motion, AnimatePresence } from "framer-motion";
import { UnoCard } from "@/types/game";
import { LightbulbIcon } from "lucide-react";

interface GameHintsProps {
  playableCards: UnoCard[];
  isVisible: boolean;
}

const GameHints = ({ playableCards, isVisible }: GameHintsProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed left-4 top-20 max-w-xs glass-morphism z-50 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <LightbulbIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-semibold">Available Moves:</h3>
          </div>
          <div className="space-y-1">
            {playableCards.length > 0 ? (
              playableCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    boxShadow: ["0px 0px 0px rgba(255, 255, 255, 0)", "0px 0px 8px rgba(255, 255, 255, 0.5)", "0px 0px 0px rgba(255, 255, 255, 0)"],
                  }}
                  transition={{
                    boxShadow: {
                      repeat: Infinity,
                      duration: 2,
                    }
                  }}
                  className="text-sm bg-white/10 backdrop-blur-sm rounded-md p-2 border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        card.color === "red" ? "bg-red-500" :
                        card.color === "blue" ? "bg-blue-500" :
                        card.color === "green" ? "bg-green-500" :
                        card.color === "yellow" ? "bg-yellow-400" :
                        "bg-gray-800"
                      }`}
                    />
                    <span>Play {card.color} {card.value}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm bg-white/10 backdrop-blur-sm rounded-md p-2 border border-white/10"
              >
                No playable cards - draw a card!
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameHints;
