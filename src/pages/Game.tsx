
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import UnoCard from "@/components/UnoCard";
import GameHints from "@/components/GameHints";
import { useLearningStore } from "@/stores/useLearningStore";
import LearningModeToggle from "@/components/LearningModeToggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Share2, Crown, CheckCircle2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  GameState,
  Player,
  UnoCard as UnoCardType,
  createDummyGameState,
  addDummyPlayer,
  togglePlayerReady,
  startDummyGame,
  playCard as playCardAction,
  drawCard as drawCardAction,
  flipDeck as flipDeckAction,
  isCardPlayable
} from "@/types/game";

const Game = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLearningMode } = useLearningStore();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      toast({
        title: "Error",
        description: "Game ID is required",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const playerName = location.state?.playerName;
    if (!playerName) {
      navigate('/');
      return;
    }

    // Create a dummy game state for testing without socket.io
    const dummyGameState = createDummyGameState(gameId, playerName, "classic");
    setGameState(dummyGameState);
    setPlayerId(dummyGameState.players[0].id);

    // Add some dummy players after a delay
    const timeout1 = setTimeout(() => {
      if (dummyGameState) {
        setGameState(prevState => prevState ? addDummyPlayer(prevState, "Player 2") : null);
      }
    }, 1500);

    const timeout2 = setTimeout(() => {
      if (dummyGameState) {
        setGameState(prevState => prevState ? addDummyPlayer(prevState, "Player 3") : null);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [gameId, navigate, toast]);

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Invite Link Copied",
      description: "Share this link with your friends to join the game!",
    });
  };

  const toggleReady = () => {
    if (!gameState || !playerId) return;
    setGameState(togglePlayerReady(gameState, playerId));
    
    // Make other players ready after some time
    setTimeout(() => {
      setGameState(prevState => {
        if (!prevState) return null;
        let updatedState = {...prevState};
        // Make all AI players ready
        prevState.players.forEach(player => {
          if (player.id !== playerId) {
            updatedState = togglePlayerReady(updatedState, player.id);
          }
        });
        return updatedState;
      });
    }, 2000);
  };

  const startGame = () => {
    if (!gameState) return;
    setGameState(startDummyGame(gameState));
  };

  const handlePlayCard = (cardId: string) => {
    if (!gameState || !playerId) return;
    const updatedState = playCardAction(gameState, playerId, cardId);
    setGameState(updatedState);
    
    // Let AI players make moves after a delay
    if (updatedState.status === "playing" && updatedState.currentPlayer !== playerId) {
      setTimeout(simulateAIMove, 1500);
    }
  };

  const handleDrawCard = () => {
    if (!gameState || !playerId) return;
    const updatedState = drawCardAction(gameState, playerId);
    setGameState(updatedState);
    
    // Let AI players make moves after a delay
    if (updatedState.currentPlayer !== playerId) {
      setTimeout(simulateAIMove, 1500);
    }
  };

  const handleFlipDeck = () => {
    if (!gameState || !playerId) return;
    setGameState(flipDeckAction(gameState));
  };

  const simulateAIMove = () => {
    setGameState(prevState => {
      if (!prevState) return null;
      
      const currentPlayer = prevState.players.find(p => p.id === prevState.currentPlayer);
      if (!currentPlayer || currentPlayer.id === playerId) return prevState;
      
      // Find playable cards
      const playableCards = currentPlayer.cards.filter(card => 
        isCardPlayable(card, prevState.currentCard)
      );
      
      // Play a random playable card or draw
      if (playableCards.length > 0) {
        const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
        const newState = playCardAction(prevState, currentPlayer.id, randomCard.id);
        
        // Schedule next AI move if it's still AI's turn
        if (newState.currentPlayer !== playerId && newState.status === "playing") {
          setTimeout(simulateAIMove, 1500);
        }
        
        return newState;
      } else {
        // Draw a card
        const newState = drawCardAction(prevState, currentPlayer.id);
        
        // Schedule next AI move if it's still AI's turn
        if (newState.currentPlayer !== playerId && newState.status === "playing") {
          setTimeout(simulateAIMove, 1500);
        }
        
        return newState;
      }
    });
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Game...</h2>
        </div>
      </div>
    );
  }

  const myPlayer = playerId ? gameState.players.find(p => p.id === playerId) : null;
  const isHost = myPlayer?.isHost;
  const isReady = myPlayer?.isReady;
  const allPlayersReady = gameState.players.every(p => p.isReady);
  const canStartGame = isHost && allPlayersReady && gameState.players.length >= 2;
  
  const myCards = myPlayer?.cards || [];
  const playableCards = myPlayer?.cards.filter(card => 
    isCardPlayable(card, gameState.currentCard) && gameState.currentPlayer === playerId
  ) || [];

  if (gameState.status === "waiting") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-red-500/10 via-blue-500/10 to-green-500/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Game Lobby</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Invite Players
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Players ({gameState.players.length}/4)
                </h3>
                <div className="divide-y dark:divide-gray-700">
                  {gameState.players.map((player) => (
                    <div
                      key={player.id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {player.isHost && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                        <span>{player.name}</span>
                      </div>
                      {player.isReady ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-sm text-gray-500">Not Ready</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={toggleReady}
                  variant={isReady ? "outline" : "default"}
                  className={cn(
                    "flex-1",
                    isReady && "bg-green-500 hover:bg-green-600"
                  )}
                >
                  {isReady ? "Ready!" : "Click when ready"}
                </Button>
                {isHost && (
                  <Button
                    onClick={startGame}
                    disabled={!canStartGame}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    Start Game
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Players</DialogTitle>
              <DialogDescription>
                Share this game code with your friends:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-2xl font-mono">
                {gameId}
              </div>
              <Button onClick={copyInviteLink} className="w-full">
                Copy Invite Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (gameState.status === "finished") {
    const winner = gameState.players.find(p => p.id === gameState.winner);
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-red-500/10 via-blue-500/10 to-green-500/10 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <p className="text-xl mb-6">
            {winner?.name || "Someone"} has won the game!
          </p>
          <Button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-600">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-500/10 via-blue-500/10 to-green-500/10">
      <LearningModeToggle />
      <GameHints playableCards={playableCards} isVisible={isLearningMode} />

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
            .filter((p) => p.id !== playerId)
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
              onClick={handleDrawCard}
              variant="outline"
              className="bg-white dark:bg-gray-700"
              disabled={gameState.currentPlayer !== playerId}
            >
              Draw Card
            </Button>
            
            {gameState.gameMode === "flip" && (
              <Button
                onClick={handleFlipDeck}
                variant="outline"
                className="bg-white dark:bg-gray-700"
                disabled={gameState.currentPlayer !== playerId}
              >
                Flip Deck
              </Button>
            )}
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto pb-4">
            {myCards.map((card) => (
              <UnoCard
                key={card.id}
                color={card.color}
                value={card.value}
                isPlayable={playableCards.some((c) => c.id === card.id) && gameState.currentPlayer === playerId}
                onClick={() => handlePlayCard(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
