
import { motion, AnimatePresence } from "framer-motion";

export interface PlayableCard {
  id: string;
  color: "red" | "blue" | "green" | "yellow" | "black";
  value: string | number;
}

interface GameHintsProps {
  playableCards: PlayableCard[];
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
          className="fixed left-4 top-20 max-w-xs bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow-lg backdrop-blur-sm"
        >
          <h3 className="text-sm font-semibold mb-2">Available Moves:</h3>
          <div className="space-y-1">
            {playableCards.length > 0 ? (
              playableCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  • Play {card.color} {card.value}
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No playable cards - draw a card!
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameHints;
