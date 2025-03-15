
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import UnoCard from "./UnoCard";
import { UnoCard as UnoCardType } from "@/types/game";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface PlayerHandAreaProps {
  cards: UnoCardType[];
  playableCards: UnoCardType[];
  isCurrentPlayer: boolean;
  onPlayCard: (cardId: string) => void;
  onUnoButtonClick: () => void;
  canSayUno: boolean;
  isLearningMode: boolean;
}

const PlayerHandArea = ({
  cards,
  playableCards,
  isCurrentPlayer,
  onPlayCard,
  onUnoButtonClick,
  canSayUno,
  isLearningMode
}: PlayerHandAreaProps) => {
  const isMobile = useIsMobile();
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Calculate container width for proper card spacing
  useEffect(() => {
    const updateContainerWidth = () => {
      setContainerWidth(window.innerWidth > 768 ? window.innerWidth * 0.7 : window.innerWidth - 40);
    };
    
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);
  
  // Calculate card spacing based on number of cards and container width
  const cardWidth = isMobile ? 50 : 70;
  const maxOverlap = isMobile ? 35 : 40;
  const minOverlap = 10;
  
  // Calculate overlap (smaller overlap for fewer cards, larger for many cards)
  const calculateOverlap = () => {
    if (cards.length <= 5) return minOverlap;
    
    const requiredSpace = cards.length * cardWidth;
    const availableSpace = containerWidth;
    
    if (requiredSpace <= availableSpace) return minOverlap;
    
    const overlap = (requiredSpace - availableSpace) / (cards.length - 1);
    return Math.min(Math.max(overlap, minOverlap), maxOverlap);
  };
  
  const cardOverlap = calculateOverlap();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
      <div className="container mx-auto relative flex justify-center items-end">
        {/* UNO button - positioned to the right of cards */}
        <motion.div 
          className="absolute right-2 bottom-24 sm:bottom-28 md:bottom-32"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={onUnoButtonClick}
            disabled={!canSayUno}
            className={cn(
              "rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center font-bold text-sm sm:text-lg",
              canSayUno 
                ? "bg-red-600 hover:bg-red-700 shadow-lg border-2 border-white/30 text-white" 
                : "bg-gray-600/70 cursor-not-allowed dark:bg-gray-700/70 border-white/10 text-white/70"
            )}
          >
            UNO
          </Button>
        </motion.div>
        
        {/* Cards container with horizontal scroll if needed */}
        <div 
          className={cn(
            "flex justify-center pb-4 hide-scrollbar",
            isMobile ? "max-w-full overflow-x-auto" : ""
          )}
        >
          {cards.map((card, index) => {
            const isPlayable = isCurrentPlayer && 
                              playableCards.some(p => p.id === card.id) && 
                              isCurrentPlayer;
            
            // Only show special styling in learning mode
            const isHighlighted = isLearningMode && isPlayable;
            
            return (
              <div 
                key={card.id} 
                className={cn(
                  "transform transition-all duration-300",
                  isHighlighted ? "hover:z-20 card-suggestion" : "hover:z-10"
                )}
                style={{ 
                  marginLeft: index === 0 ? 0 : `-${cardOverlap}px`,
                  zIndex: index,
                  transform: `translateY(${isHighlighted ? '-5px' : '0'})`
                }}
              >
                <UnoCard
                  color={card.color}
                  value={card.value}
                  isPlayable={isPlayable}
                  onClick={() => onPlayCard(card.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerHandArea;
