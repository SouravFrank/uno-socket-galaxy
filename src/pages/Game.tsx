
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import UnoCard from "@/components/UnoCard";
import GameHints from "@/components/GameHints";
import ThemeToggle from "@/components/ThemeToggle";
import LastPlayedMove from "@/components/LastPlayedMove";
import { useLearningStore } from "@/stores/useLearningStore";
import LearningModeToggle from "@/components/LearningModeToggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Share2, 
  Crown, 
  CheckCircle2, 
  Users, 
  RefreshCw,
  HandMetal,
  Volume2,
  VolumeX,
  ChevronsRight
} from "lucide-react";
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
  const isMobile = useIsMobile();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isUnoPressed, setIsUnoPressed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastPlayedCard, setLastPlayedCard] = useState<{playerId: string, card: UnoCardType} | null>(null);
  const [pendingDrawCount, setPendingDrawCount] = useState<number>(0);

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

  // Check if there's a +2 or +4 card played
  useEffect(() => {
    if (gameState?.currentCard?.value === "+2") {
      setPendingDrawCount(2);
    } else if (gameState?.currentCard?.value === "+4") {
      setPendingDrawCount(4);
    }
  }, [gameState?.currentCard]);

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
    
    // If there's a pending draw count, player must draw first
    if (pendingDrawCount > 0 && gameState.currentPlayer === playerId) {
      toast({
        title: "Draw Cards First",
        description: `You need to draw ${pendingDrawCount} cards first`,
        variant: "destructive",
      });
      return;
    }
    
    const player = gameState.players.find(p => p.id === playerId);
    const card = player?.cards.find(c => c.id === cardId);
    
    if (card) {
      // Check if player should have pressed UNO button
      const shouldPressUno = player && player.cards.length === 2;
      
      const updatedState = playCardAction(gameState, playerId, cardId);
      setGameState(updatedState);
      
      if (card) {
        setLastPlayedCard({
          playerId: "dummy", // Use "dummy" to identify user's move
          card: card
        });
      }
      
      if (shouldPressUno && !isUnoPressed) {
        // Player forgot to press UNO
        setTimeout(() => {
          toast({
            title: "Forgot to say UNO!",
            description: "You'll have to draw two cards as penalty.",
            variant: "destructive",
          });
          // Add penalty in real implementation
        }, 1000);
      }
      
      setIsUnoPressed(false);
      
      // Let AI players make moves after a delay
      if (updatedState.status === "playing" && updatedState.currentPlayer !== playerId) {
        setTimeout(simulateAIMove, 1500);
      }
    }
  };

  const handleDrawCard = () => {
    if (!gameState || !playerId) return;
    
    // Handle pending draw count
    if (pendingDrawCount > 0) {
      // Draw multiple cards equal to the pending count
      let updatedState = {...gameState};
      for (let i = 0; i < pendingDrawCount; i++) {
        updatedState = drawCardAction(updatedState, playerId);
      }
      setGameState(updatedState);
      setPendingDrawCount(0);
      
      // Move to next player
      setTimeout(simulateAIMove, 1500);
    } else {
      // Normal draw
      const updatedState = drawCardAction(gameState, playerId);
      setGameState(updatedState);
      
      // Let AI players make moves after a delay
      if (updatedState.currentPlayer !== playerId) {
        setTimeout(simulateAIMove, 1500);
      }
    }
  };

  const handleUnoButton = () => {
    setIsUnoPressed(true);
    toast({
      title: "UNO!",
      description: "You said UNO!",
    });
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
        
        // Set the last played card
        setLastPlayedCard({
          playerId: currentPlayer.id,
          card: randomCard
        });
        
        // Check if AI should say UNO
        if (currentPlayer.cards.length === 2) {
          // 50% chance AI forgets to say UNO
          const saysUno = Math.random() > 0.5;
          if (saysUno) {
            toast({
              title: `${currentPlayer.name} says UNO!`,
            });
          } else {
            toast({
              title: `${currentPlayer.name} forgot to say UNO!`,
              description: "They'll draw two cards as penalty.",
              variant: "destructive",
            });
            // Implement penalty in real implementation
          }
        }
        
        // Schedule next AI move if it's still AI's turn
        if (newState.currentPlayer !== playerId && newState.status === "playing") {
          setTimeout(simulateAIMove, 1500);
        }
        
        return newState;
      } else {
        // Draw a card
        const newState = drawCardAction(prevState, currentPlayer.id);
        
        toast({
          title: `${currentPlayer.name} draws a card`,
        });
        
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 dark:from-green-900/20 dark:via-yellow-900/10 dark:to-green-900/20">
        <div className="text-center glass-morphism p-8 rounded-xl dark:bg-black/30">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
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
    isCardPlayable(card, gameState.currentCard) && gameState.currentPlayer === playerId && pendingDrawCount === 0
  ) || [];

  const canSayUno = myPlayer && myPlayer.cards.length === 2 && gameState.currentPlayer === playerId;

  if (gameState.status === "waiting") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 dark:from-green-900/20 dark:via-yellow-900/10 dark:to-green-900/20">
        <ThemeToggle />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="grass-morphism p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Game Lobby</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowInviteDialog(true)}
                  className="flex items-center gap-2 grass-button"
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
                        <span className="text-sm text-gray-500 dark:text-gray-400">Not Ready</span>
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
                    "flex-1 grass-button",
                    isReady && "bg-green-500/70 hover:bg-green-600/70"
                  )}
                >
                  {isReady ? "Ready!" : "Click when ready"}
                </Button>
                {isHost && (
                  <Button
                    onClick={startGame}
                    disabled={!canStartGame}
                    className="flex-1 grass-button"
                  >
                    Start Game
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="glass-morphism dark:bg-gray-900/80">
            <DialogHeader>
              <DialogTitle>Invite Players</DialogTitle>
              <DialogDescription>
                Share this game code with your friends:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg text-center text-2xl font-mono border border-white/20 dark:bg-black/30">
                {gameId}
              </div>
              <Button onClick={copyInviteLink} className="w-full grass-button">
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
      <div className="min-h-screen w-full bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 dark:from-green-900/20 dark:via-yellow-900/10 dark:to-green-900/20 flex items-center justify-center">
        <ThemeToggle />
        <div className="grass-morphism p-8 shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-xl mb-6">
            {winner?.name || "Someone"} has won the game!
          </p>
          <Button onClick={() => navigate('/')} className="grass-button">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 dark:from-green-900/20 dark:via-yellow-900/10 dark:to-green-900/20 pb-24 sm:pb-32">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Sound toggle */}
      <button 
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 dark:bg-black/30"
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
      
      <LearningModeToggle />
      <GameHints playableCards={playableCards} isVisible={isLearningMode} />
      <LastPlayedMove 
        lastPlayedCard={lastPlayedCard} 
        playerName={lastPlayedCard?.playerId === playerId ? "You" : gameState.players.find(p => p.id === lastPlayedCard?.playerId)?.name || ""}
        drawCount={pendingDrawCount > 0 && gameState.currentPlayer === playerId ? pendingDrawCount : undefined}
      />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Game mode and deck side indicator */}
        <div className="text-center mb-4 flex justify-center gap-2">
          <span className="px-3 py-1 rounded-full glass-morphism text-sm sm:text-base font-medium dark:bg-black/30">
            {gameState.gameMode === "classic" ? "Classic UNO" : 
             gameState.gameMode === "flip" ? "UNO Flip" : 
             gameState.gameMode === "doubles" ? "UNO Doubles" :
             gameState.gameMode === "speed" ? "UNO Speed" :
             gameState.gameMode === "nomercy" ? "UNO No Mercy" : "UNO"}
          </span>
          {gameState.isFlipped !== undefined && (
            <span className="px-3 py-1 rounded-full glass-morphism text-xs sm:text-sm dark:bg-black/30">
              {gameState.isFlipped ? 'Dark Side' : 'Light Side'}
            </span>
          )}
        </div>

        {/* Current Turn Indicator */}
        <div className="text-center mb-4">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism dark:bg-black/30",
            gameState.currentPlayer === playerId && "neon-border"
          )}>
            <ChevronsRight className={cn(
              "w-4 h-4",
              gameState.currentPlayer === playerId ? "text-green-400" : "text-gray-400"
            )} />
            <span className="text-sm font-medium">
              {gameState.currentPlayer === playerId 
                ? "Your Turn" 
                : `${gameState.players.find(p => p.id === gameState.currentPlayer)?.name}'s Turn`}
            </span>
          </div>
        </div>

        {/* Opponents */}
        <div className={cn(
          "grid gap-3 mb-6",
          gameState.players.length <= 2 ? "grid-cols-1" : 
          gameState.players.length <= 3 ? "grid-cols-2" : "grid-cols-3"
        )}>
          {gameState.players
            .filter((p) => p.id !== playerId)
            .map((player) => (
              <div
                key={player.id}
                className={cn(
                  "text-center p-3 rounded-lg glass-morphism relative dark:bg-black/30",
                  player.id === gameState.currentPlayer && "player-active"
                )}
              >
                <h3 className="font-medium mb-1 flex items-center justify-center gap-1">
                  {player.id === gameState.currentPlayer && (
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  )}
                  {player.name}
                </h3>
                <p className="text-xs text-gray-300 dark:text-gray-400 mb-2">{player.cards.length} cards</p>
                
                {/* Last played card indicator */}
                {lastPlayedCard && lastPlayedCard.playerId === player.id && (
                  <div className="flex justify-center items-center mt-1">
                    <div className="text-xs px-2 py-1 rounded bg-white/10 dark:bg-white/5 flex items-center gap-1">
                      Last played: {lastPlayedCard.card.color} {lastPlayedCard.card.value}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Game area - central card and controls */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {/* Draw pile */}
          <div className="relative" onClick={pendingDrawCount > 0 && gameState.currentPlayer === playerId ? handleDrawCard : undefined}>
            <div className={cn(
              "uno-card-back w-16 h-24 sm:w-20 sm:h-30 md:w-24 md:h-36 rounded-xl shadow-lg cursor-pointer border-2 border-gray-100/30 transform rotate-3",
              pendingDrawCount > 0 && gameState.currentPlayer === playerId ? "animate-pulse" : ""
            )}></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white font-bold text-xs">
                {pendingDrawCount > 0 && gameState.currentPlayer === playerId 
                  ? `DRAW ${pendingDrawCount}` 
                  : "DRAW"}
              </span>
            </div>
          </div>
          
          {/* Current card */}
          <UnoCard
            color={gameState.currentCard.color}
            value={gameState.currentCard.value}
            className="last-played"
          />
          
          {/* UNO button */}
          <Button
            onClick={handleUnoButton}
            disabled={!canSayUno}
            className={cn(
              "rounded-full h-16 w-16 flex items-center justify-center font-bold text-lg",
              canSayUno 
                ? "bg-red-500 hover:bg-red-600 shadow-lg" 
                : "bg-gray-500/50 cursor-not-allowed dark:bg-gray-700/50"
            )}
          >
            UNO
          </Button>
        </div>

        {/* Player hand */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto">
            <div className="flex justify-center gap-2 mb-3">
              {gameState.gameMode === "flip" && (
                <Button
                  onClick={handleFlipDeck}
                  variant="outline"
                  className="glass-morphism text-white border-white/20 dark:bg-black/30"
                  disabled={gameState.currentPlayer !== playerId}
                >
                  <RefreshCw className="w-4 h-4 mr-1" /> Flip Deck
                </Button>
              )}
            </div>
            <div className={cn(
              "flex justify-center overflow-x-auto pb-4 gap-[-10px] sm:gap-[-15px] hide-scrollbar",
              isMobile ? "mobile-card-container" : ""
            )}>
              {myCards.map((card, index) => (
                <div 
                  key={card.id} 
                  className={cn(
                    "transform transition-transform duration-300 hover:z-10",
                    isMobile ? "mobile-card-size" : "",
                    playableCards.some((c) => c.id === card.id) ? "hover:scale-110" : ""
                  )}
                  style={{ 
                    marginLeft: index > 0 ? "-2rem" : "0",
                    zIndex: index
                  }}
                >
                  <UnoCard
                    key={card.id}
                    color={card.color}
                    value={card.value}
                    isPlayable={playableCards.some((c) => c.id === card.id) && gameState.currentPlayer === playerId}
                    onClick={() => handlePlayCard(card.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
