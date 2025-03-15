
import { GameMode } from "@/types/game";
import { cn } from "@/lib/utils";
import GameDirectionIndicator from "@/components/GameDirectionIndicator";

interface GameHeaderProps {
  gameMode: GameMode;
  isFlipped?: boolean;
  currentPlayer: string;
  currentPlayerName: string;
  isCurrentPlayerMe: boolean;
  direction: "clockwise" | "counter-clockwise";
  directionChanged: boolean;
}

const GameHeader = ({
  gameMode,
  isFlipped,
  currentPlayerName,
  isCurrentPlayerMe,
  direction,
  directionChanged
}: GameHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 mb-8 items-center">
      {/* Game mode */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          UNO {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
          {isFlipped && <span className="ml-2 text-purple-500 font-bold">FLIP</span>}
        </h1>
      </div>
      
      {/* Turn indicator */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <GameDirectionIndicator 
          direction={direction} 
          changed={directionChanged} 
        />
        
        <div className={cn(
          "px-4 py-2 rounded-full text-center",
          isCurrentPlayerMe
            ? "bg-green-600/90 text-white font-medium animate-pulse"
            : "bg-gray-700/50 text-white/90"
        )}>
          {isCurrentPlayerMe ? "Your turn!" : `${currentPlayerName}'s turn`}
        </div>
        
        <GameDirectionIndicator 
          direction={direction} 
          changed={directionChanged} 
        />
      </div>
    </div>
  );
};

export default GameHeader;
