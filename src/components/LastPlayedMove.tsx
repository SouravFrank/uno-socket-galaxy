
import { motion } from "framer-motion";
import { ArrowLeftRight, HandMetal } from "lucide-react";
import { UnoCard as UnoCardType } from "@/types/game";

interface LastPlayedMoveProps {
  lastPlayedCard: { playerId: string; card: UnoCardType } | null;
  playerName: string;
  drawCount?: number;
}

const LastPlayedMove = ({ lastPlayedCard, playerName, drawCount }: LastPlayedMoveProps) => {
  if (!lastPlayedCard && !drawCount) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 max-w-xs glass-morphism z-40 p-3 rounded-lg dark:bg-black/30 dark:border-white/10"
    >
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <ArrowLeftRight className="w-4 h-4 text-green-400" />
        Last Move:
      </h3>
      
      {lastPlayedCard && (
        <div className="text-sm bg-white/10 backdrop-blur-sm rounded-md p-2 border border-white/10 mb-2">
          <div className="flex items-center gap-2">
            <div 
              className={`w-3 h-3 rounded-full ${
                lastPlayedCard.card.color === "red" ? "bg-red-500" :
                lastPlayedCard.card.color === "blue" ? "bg-blue-500" :
                lastPlayedCard.card.color === "green" ? "bg-green-500" :
                lastPlayedCard.card.color === "yellow" ? "bg-yellow-400" :
                "bg-gray-800"
              }`}
            />
            <span>
              {lastPlayedCard.playerId === "dummy" ? "You" : playerName} played {lastPlayedCard.card.color} {lastPlayedCard.card.value}
            </span>
          </div>
        </div>
      )}
      
      {drawCount && drawCount > 0 && (
        <div className="text-sm bg-red-500/20 backdrop-blur-sm rounded-md p-2 border border-red-500/20">
          <div className="flex items-center gap-2">
            <HandMetal className="w-4 h-4 text-red-400" />
            <span>You need to draw {drawCount} cards</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LastPlayedMove;
