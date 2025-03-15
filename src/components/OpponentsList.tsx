
import { cn } from "@/lib/utils";
import { Player } from "@/types/game";
import { UnoCard as UnoCardType } from "@/types/game";

interface OpponentsListProps {
  players: Player[];
  currentPlayerId: string;
  playerId: string;
  lastPlayedCards: Record<string, UnoCardType | null>;
}

const OpponentsList = ({ players, currentPlayerId, playerId, lastPlayedCards }: OpponentsListProps) => {
  const opponents = players.filter(p => p.id !== playerId);
  
  return (
    <div className={cn(
      "grid gap-3 mb-6",
      opponents.length <= 1 ? "grid-cols-1" : 
      opponents.length <= 2 ? "grid-cols-2" : "grid-cols-1 md:grid-cols-3"
    )}>
      {opponents.map((player) => (
        <div
          key={player.id}
          className={cn(
            "text-center p-3 rounded-lg glass-morphism relative dark:bg-black/30",
            player.id === currentPlayerId && "player-active"
          )}
        >
          <h3 className="font-medium mb-1 flex items-center justify-center gap-1 truncate">
            {player.id === currentPlayerId && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            )}
            {player.name}
          </h3>
          <p className="text-xs text-gray-300 dark:text-gray-400 mb-2">
            {player.cards.length} card{player.cards.length !== 1 ? 's' : ''}
          </p>
          
          {/* Last played card indicator */}
          {lastPlayedCards[player.id] && (
            <div className="flex justify-center items-center mt-1">
              <div className="text-xs px-2 py-1 rounded bg-white/10 dark:bg-white/5 flex items-center gap-1">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    lastPlayedCards[player.id]?.color === "red" ? "bg-red-500" :
                    lastPlayedCards[player.id]?.color === "blue" ? "bg-blue-500" :
                    lastPlayedCards[player.id]?.color === "green" ? "bg-green-500" :
                    lastPlayedCards[player.id]?.color === "yellow" ? "bg-yellow-400" :
                    "bg-gray-800"
                  }`}
                />
                <span>Last: {lastPlayedCards[player.id]?.color} {lastPlayedCards[player.id]?.value}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OpponentsList;
