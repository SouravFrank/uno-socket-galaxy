
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import UnoCard from "@/components/UnoCard";
import GameHints from "@/components/GameHints";
import { useLearningStore } from "@/stores/useLearningStore";
import LearningModeToggle from "@/components/LearningModeToggle";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface GameState {
  currentPlayer: string;
  players: {
    id: string;
    name: string;
    cards: Array<{
      id: string;
      color: "red" | "blue" | "green" | "yellow" | "black";
      value: string | number;
    }>;
  }[];
  currentCard: {
    color: "red" | "blue" | "green" | "yellow" | "black";
    value: string | number;
  };
  myCards: Array<{
    id: string;
    color: "red" | "blue" | "green" | "yellow" | "black";
    value: string | number;
  }>;
  playableCards: Array<{
    id: string;
    color: "red" | "blue" | "green" | "yellow" | "black";
    value: string | number;
  }>;
  isFlipped?: boolean;
}

const Game = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const { toast } = useToast();
  const { isLearningMode } = useLearningStore();
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: "",
    players: [],
    currentCard: { color: "red", value: "0" },
    myCards: [],
    playableCards: [],
  });

  useEffect(() => {
    if (!socket || !gameId) return;

    const playerName = location.state?.playerName;
    if (!playerName) {
      navigate('/');
      return;
    }

    socket.emit('join_game', { gameId, playerName });

    socket.on('game_updated', ({ gameState: newGameState }) => {
      setGameState(prev => ({
        ...prev,
        currentPlayer: newGameState.currentPlayer,
        players: newGameState.players,
        currentCard: newGameState.currentCard,
        myCards: newGameState.players.find(p => p.id === socket.id)?.cards || [],
        playableCards: (newGameState.players.find(p => p.id === socket.id)?.cards || [])
          .filter(card => isCardPlayable(card, newGameState.currentCard)),
        isFlipped: newGameState.isFlipped,
      }));
    });

    socket.on('player_joined', ({ gameState: newGameState }) => {
      toast({
        title: 'Player Joined',
        description: `${newGameState.players[newGameState.players.length - 1].name} joined the game`,
      });
    });

    socket.on('player_left', ({ gameState: newGameState }) => {
      toast({
        title: 'Player Left',
        description: 'A player has left the game',
        variant: 'destructive',
      });
    });

    socket.on('card_drawn', ({ card }) => {
      setGameState(prev => ({
        ...prev,
        myCards: [...prev.myCards, card],
        playableCards: isCardPlayable(card, prev.currentCard) 
          ? [...prev.playableCards, card]
          : prev.playableCards,
      }));
    });

    return () => {
      socket.off('game_updated');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('card_drawn');
    };
  }, [socket, gameId]);

  const playCard = (cardId: string) => {
    if (!socket || !gameId) return;
    socket.emit('play_card', { gameId, cardId });
  };

  const drawCard = () => {
    if (!socket || !gameId) return;
    socket.emit('draw_card', { gameId });
  };

  const flipDeck = () => {
    if (!socket || !gameId) return;
    socket.emit('flip_deck', { gameId });
  };

  const isCardPlayable = (card: any, currentCard: any) => {
    return card.color === currentCard.color || 
           card.value === currentCard.value || 
           card.color === 'black';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-500/10 via-blue-500/10 to-green-500/10">
      <LearningModeToggle />
      <GameHints playableCards={gameState.playableCards} isVisible={isLearningMode} />

      <div className="container mx-auto px-4 py-8">
        {gameState.isFlipped !== undefined && (
          <div className="text-center mb-4">
            <span className="px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              {gameState.isFlipped ? 'Dark Side' : 'Light Side'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          {gameState.players
            .filter((p) => p.id !== socket.id)
            .map((player) => (
              <div
                key={player.id}
                className={cn(
                  "text-center p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                  player.id === gameState.currentPlayer && "ring-2 ring-blue-500"
                )}
              >
                <h3 className="font-medium mb-2">{player.name}</h3>
                <p className="text-sm text-gray-500">{player.cards.length} cards</p>
              </div>
            ))}
        </div>

        <div className="flex justify-center mb-8">
          <UnoCard
            color={gameState.currentCard.color}
            value={gameState.currentCard.value}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex justify-center gap-2 mb-4">
            <Button
              onClick={drawCard}
              variant="outline"
              className="bg-white dark:bg-gray-700"
              disabled={gameState.currentPlayer !== socket.id}
            >
              Draw Card
            </Button>
            
            {gameState.isFlipped !== undefined && (
              <Button
                onClick={flipDeck}
                variant="outline"
                className="bg-white dark:bg-gray-700"
                disabled={gameState.currentPlayer !== socket.id}
              >
                Flip Deck
              </Button>
            )}
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto pb-4">
            {gameState.myCards.map((card) => (
              <UnoCard
                key={card.id}
                color={card.color}
                value={card.value}
                isPlayable={gameState.playableCards.some((c) => c.id === card.id) && gameState.currentPlayer === socket.id}
                onClick={() => playCard(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
