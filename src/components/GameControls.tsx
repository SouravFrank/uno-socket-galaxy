
import { UnoCard as UnoCardType } from "@/types/game";
import UnoCard from "./UnoCard";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameControlsProps {
  currentCard: UnoCardType;
  isFlipMode: boolean;
  onDrawCard: () => void;
  onFlipDeck?: () => void;
  isCurrentPlayer: boolean;
  pendingDrawCount: number;
}

const GameControls = ({
  currentCard,
  isFlipMode,
  onDrawCard,
  onFlipDeck,
  isCurrentPlayer,
  pendingDrawCount
}: GameControlsProps) => {
  return (
    <div className="flex justify-center items-center gap-5 mb-6">
      {/* Draw pile */}
      <div 
        className="relative cursor-pointer" 
        onClick={isCurrentPlayer ? onDrawCard : undefined}
      >
        <div className={cn(
          "uno-card-back w-16 h-24 sm:w-20 sm:h-30 md:w-24 md:h-36 rounded-xl shadow-lg border-2 border-gray-100/30 transform rotate-3",
          pendingDrawCount > 0 && isCurrentPlayer ? "animate-pulse shadow-red-500/30 border-red-400/40" : "",
          !isCurrentPlayer && "opacity-70"
        )}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">
              {pendingDrawCount > 0 && isCurrentPlayer 
                ? `DRAW ${pendingDrawCount}` 
                : "DRAW"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Current card */}
      <UnoCard
        color={currentCard.color}
        value={currentCard.value}
        className="last-played"
      />
      
      {/* Flip deck button for UNO Flip mode */}
      {isFlipMode && (
        <Button
          onClick={onFlipDeck}
          variant="outline"
          className="glass-morphism text-white border-white/20 dark:bg-black/30 absolute bottom-32 left-4"
          disabled={!isCurrentPlayer}
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Flip Deck
        </Button>
      )}
    </div>
  );
};

export default GameControls;
