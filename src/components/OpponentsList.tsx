
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OpponentsListProps {
  players: Array<{
    id: string;
    name: string;
    cards: Array<any>;
  }>;
  currentPlayerId: string;
  moveHistory: Array<{
    playerId: string;
    playerName: string;
    card: any;
    timestamp: number;
  }>;
  unoPressed?: boolean;
}

const OpponentsList = ({ players, currentPlayerId, moveHistory, unoPressed }: OpponentsListProps) => {
  return (
    <div className={cn(
      "grid gap-3 mb-6",
      players.length <= 1 ? "grid-cols-1" :
      players.length <= 2 ? "grid-cols-2" : "grid-cols-3"
    )}>
      {players.map((player) => {
        // Find the last move by this player
        const lastMove = moveHistory
          .filter(move => move.playerId === player.id)
          .sort((a, b) => b.timestamp - a.timestamp)[0];
          
        const isUno = player.cards.length === 1;
        const isCurrentTurn = player.id === currentPlayerId;
        
        return (
          <motion.div
            key={player.id}
            className={cn(
              "text-center p-3 rounded-lg glass-morphism relative dark:bg-black/30",
              isCurrentTurn && "outline outline-2 outline-green-500",
              isUno ? "uno-called" : ""
            )}
            animate={isCurrentTurn ? {
              boxShadow: ["0 0 0 rgba(34, 197, 94, 0.2)", "0 0 15px rgba(34, 197, 94, 0.6)", "0 0 0 rgba(34, 197, 94, 0.2)"]
            } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <h3 className="font-medium mb-1 flex items-center justify-center gap-1">
              {isCurrentTurn && (
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              )}
              {player.name}
            </h3>
            <p className="text-xs text-gray-300 dark:text-gray-400 mb-2">
              {player.cards.length} cards
            </p>

            {/* Last played card indicator */}
            {lastMove && (
              <div className="flex justify-center items-center mt-1">
                <div className="text-xs px-2 py-1 rounded bg-white/10 dark:bg-white/5 flex items-center gap-1">
                  Last played: {lastMove.card.color} {lastMove.card.value}
                </div>
              </div>
            )}
            
            {/* UNO indicator */}
            <AnimatePresence>
              {isUno && (
                <motion.div
                  className="absolute -top-4 -right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  UNO!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OpponentsList;
