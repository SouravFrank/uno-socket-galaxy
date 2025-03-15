
import { GameDirectionIndicator } from "@/components/GameDirectionIndicator";
import { ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameHeaderProps {
  gameMode: string;
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
  currentPlayer,
  currentPlayerName,
  isCurrentPlayerMe,
  direction,
  directionChanged
}: GameHeaderProps) => {
  const gameModeTitle = 
    gameMode === "classic" ? "Classic UNO" : 
    gameMode === "flip" ? "UNO Flip" : 
    gameMode === "doubles" ? "UNO Doubles" :
    gameMode === "speed" ? "UNO Speed" :
    gameMode === "nomercy" ? "UNO No Mercy" : "UNO";

  return (
    <div className="space-y-4 text-center mb-4">
      {/* Game title and side */}
      <div className="flex justify-center gap-2">
        <span className="px-3 py-1 rounded-full glass-morphism text-sm sm:text-base font-medium dark:bg-black/30">
          {gameModeTitle}
        </span>
        {isFlipped !== undefined && (
          <span className="px-3 py-1 rounded-full glass-morphism text-xs sm:text-sm dark:bg-black/30">
            {isFlipped ? 'Dark Side' : 'Light Side'}
          </span>
        )}
      </div>
      
      {/* Direction indicator */}
      <div className="flex justify-center">
        <GameDirectionIndicator 
          direction={direction} 
          directionChanged={directionChanged} 
        />
      </div>

      {/* Current Turn Indicator */}
      <div className="flex justify-center">
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism dark:bg-black/30",
          isCurrentPlayerMe && "neon-border"
        )}>
          <ChevronsRight className={cn(
            "w-4 h-4",
            isCurrentPlayerMe ? "text-green-400" : "text-gray-400"
          )} />
          <span className="text-sm font-medium truncate max-w-[150px]">
            {isCurrentPlayerMe 
              ? "Your Turn" 
              : `${currentPlayerName}'s Turn`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
