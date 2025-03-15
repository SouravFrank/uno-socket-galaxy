
import { UnoCard as UnoCardType } from "@/types/game";
import UnoCard from "./UnoCard";
import DrawDeckCard from "./DrawDeckCard";
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
      {/* Draw card */}
      <DrawDeckCard
        pendingDrawCount={pendingDrawCount}
        isCurrentPlayer={isCurrentPlayer}
        onClick={onDrawCard}
      />
      
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
