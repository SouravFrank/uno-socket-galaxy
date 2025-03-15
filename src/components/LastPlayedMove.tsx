
import { motion } from "framer-motion";
import { ArrowLeftRight, HandMetal, RotateCcw } from "lucide-react";
import { UnoCard as UnoCardType } from "@/types/game";

interface MoveHistoryItem {
  playerId: string;
  playerName: string;
  card: UnoCardType;
  timestamp: number;
}

interface LastPlayedMoveProps {
  moveHistory: MoveHistoryItem[];
  drawCount?: number;
  direction: "clockwise" | "counter-clockwise";
  directionChanged?: boolean;
}

const LastPlayedMove = ({ moveHistory, drawCount, direction, directionChanged }: LastPlayedMoveProps) => {
  const recentMoves = moveHistory.slice(-3).reverse();
  
  if (recentMoves.length === 0 && !drawCount) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 max-w-xs z-40 p-3 rounded-lg glass-morphism dark:bg-black/40 dark:border-white/10"
    >
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <ArrowLeftRight className="w-4 h-4 text-green-400" />
        Game History:
      </h3>
      
      {/* Direction indicator */}
      <div className={`text-xs mb-2 p-2 rounded-md flex items-center gap-2 ${
        directionChanged ? "bg-purple-500/20 border border-purple-500/30" : "bg-white/10 border border-white/10"
      }`}>
        <RotateCcw 
          className={`w-4 h-4 text-purple-400 ${direction === "clockwise" ? "rotate-180" : ""}`} 
        />
        <span>
          Direction: {direction === "clockwise" ? "Clockwise" : "Counter-Clockwise"}
          {directionChanged && " (Changed)"}
        </span>
      </div>
      
      {/* Recent moves list */}
      <div className="space-y-1.5 mb-2">
        {recentMoves.map((move, index) => (
          <div 
            key={`${move.playerId}-${move.timestamp}`} 
            className={`text-xs bg-white/10 backdrop-blur-sm rounded-md p-2 border ${
              index === 0 ? "border-green-500/30 bg-green-500/10" : "border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  move.card.color === "red" ? "bg-red-500" :
                  move.card.color === "blue" ? "bg-blue-500" :
                  move.card.color === "green" ? "bg-green-500" :
                  move.card.color === "yellow" ? "bg-yellow-400" :
                  "bg-gray-800"
                }`}
              />
              <span className="line-clamp-1">
                {move.playerName} played {move.card.color} {move.card.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Draw count notification */}
      {drawCount && drawCount > 0 && (
        <div className="text-xs bg-red-500/20 backdrop-blur-sm rounded-md p-2 border border-red-500/30">
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
