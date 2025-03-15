
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import LastPlayedMove from "@/components/LastPlayedMove";
import { useLearningStore } from "@/stores/useLearningStore";
import LearningModeToggle from "@/components/LearningModeToggle";
import GameHints from "@/components/GameHints";
import GameHeader from "@/components/GameHeader";
import GameControls from "@/components/GameControls";
import PlayerHandArea from "@/components/PlayerHandArea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Share2,
  Crown,
  CheckCircle2,
  Users,
  RefreshCw,
  Volume2,
  VolumeX,
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

// Helper function to create a move history item
const createMoveHistoryItem = (playerId: string, playerName: string, card: UnoCardType) => {
  return {
    playerId,
    playerName,
    card,
    timestamp: Date.now()
  };
};

const Game = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLearningMode } = useLearningStore();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isUnoPressed, setIsUnoPressed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [moveHistory, setMoveHistory] = useState<Array<{
    playerId: string;
    playerName: string;
    card: UnoCardType;
    timestamp: number;
  }>>([]);
  const [pendingDrawCount, setPendingDrawCount] = useState<number>(0);
  const [directionChanged, setDirectionChanged] = useState(false);

  useEffect(() => {
    if (!gameId) {
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
  }, [gameId, navigate, location.state]);

  // Check if there's a +2 or +4 card played
  useEffect(() => {
    if (gameState?.currentCard?.value === "+2") {
      setPendingDrawCount(2);
    } else if (gameState?.currentCard?.value === "+4") {
      setPendingDrawCount(4);
    }
  }, [gameState?.currentCard]);
  
  // Detect direction changes
  useEffect(() => {
    if (gameState?.lastAction === "reverse") {
      setDirectionChanged(true);
      const timeout = setTimeout(() => {
        setDirectionChanged(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [gameState?.lastAction, gameState?.direction]);

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(inviteLink);
  };

  const toggleReady = () => {
    if (!gameState || !playerId) return;
    setGameState(togglePlayerReady(gameState, playerId));

    // Make other players ready after some time
    setTimeout(() => {
      setGameState(prevState => {
        if (!prevState) return null;
        let updatedState = { ...prevState };
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
      return;
    }

    const player = gameState.players.find(p => p.id === playerId);
    const card = player?.cards.find(c => c.id === cardId);

    if (card) {
      // Check if player should have pressed UNO button
      const shouldPressUno = player && player.cards.length === 2;

      const updatedState = playCardAction(gameState, playerId, cardId);
      setGameState(updatedState);

      // Add to move history
      if (card) {
        const newMove = createMoveHistoryItem(
          playerId,
          player.name,
          card
        );
        
        setMoveHistory(prev => [...prev, newMove]);
        
        // Check for direction change
        if (card.value === "reverse") {
          setDirectionChanged(true);
          setTimeout(() => setDirectionChanged(false), 3000);
        }
      }

      if (shouldPressUno && !isUnoPressed) {
        // Player forgot to press UNO - would add penalty in real implementation
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
      let updatedState = { ...gameState };
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

        // Add to move history
        const newMove = createMoveHistoryItem(
          currentPlayer.id,
          currentPlayer.name,
          randomCard
        );
        
        setMoveHistory(prev => [...prev, newMove]);
        
        // Check for direction change
        if (randomCard.value === "reverse") {
          setDirectionChanged(true);
          setTimeout(() => setDirectionChanged(false), 3000);
        }

        // Check if AI should say UNO
        if (currentPlayer.cards.length === 2) {
          // 50% chance AI forgets to say UNO
          const saysUno = Math.random() > 0.5;
          if (saysUno) {
            // AI says UNO
          } else {
            // AI forgot to say UNO - would implement penalty in real game
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

        // Schedule next AI move if it's still AI's turn
        if (newState.currentPlayer !== playerId && newState.status === "playing") {
          setTimeout(simulateAIMove, 1500);
        }

        return newState;
      }
    });
  };

  // Render game lobby while waiting for players
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

  // Render waiting/lobby screen
  if (gameState.status === "waiting") {
    return <GameLobby 
      gameState={gameState} 
      playerId={playerId} 
      isHost={isHost} 
      isReady={isReady}
      canStartGame={canStartGame} 
      showInviteDialog={showInviteDialog}
      setShowInviteDialog={setShowInviteDialog}
      toggleReady={toggleReady}
      startGame={startGame}
      copyInviteLink={copyInviteLink}
      gameId={gameId}
    />;
  }

  // Render game over screen
  if (gameState.status === "finished") {
    return <GameOver gameState={gameState} navigate={navigate} />;
  }

  // Render active game
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 dark:from-green-900/20 dark:via-yellow-900/10 dark:to-green-900/20 pb-24 sm:pb-32">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 dark:bg-black/30 cursor-pointer"
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      <LearningModeToggle />
      <GameHints 
        playableCards={playableCards} 
        isVisible={isLearningMode} 
      />
      <LastPlayedMove
        moveHistory={moveHistory}
        drawCount={pendingDrawCount > 0 && gameState.currentPlayer === playerId ? pendingDrawCount : undefined}
        direction={gameState.direction}
        directionChanged={directionChanged}
      />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Game Header */}
        <GameHeader
          gameMode={gameState.gameMode}
          isFlipped={gameState.isFlipped}
          currentPlayer={gameState.currentPlayer}
          currentPlayerName={gameState.players.find(p => p.id === gameState.currentPlayer)?.name || ""}
          isCurrentPlayerMe={gameState.currentPlayer === playerId}
          direction={gameState.direction}
          directionChanged={directionChanged}
        />

        {/* Opponents */}
        <OpponentsList 
          players={gameState.players.filter(p => p.id !== playerId)}
          currentPlayerId={gameState.currentPlayer}
          moveHistory={moveHistory}
        />

        {/* Game Controls - central card and draw deck */}
        <GameControls
          currentCard={gameState.currentCard}
          isFlipMode={gameState.gameMode === "flip"}
          onDrawCard={handleDrawCard}
          onFlipDeck={handleFlipDeck}
          isCurrentPlayer={gameState.currentPlayer === playerId}
          pendingDrawCount={pendingDrawCount}
        />

        {/* Player hand */}
        <PlayerHandArea
          cards={myCards}
          playableCards={playableCards}
          isCurrentPlayer={gameState.currentPlayer === playerId}
          onPlayCard={handlePlayCard}
          onUnoButtonClick={handleUnoButton}
          canSayUno={canSayUno}
          isLearningMode={isLearningMode}
        />
      </div>
    </div>
  );
};

// Separate component for the waiting/lobby screen
const GameLobby = ({ 
  gameState, 
  playerId, 
  isHost, 
  isReady, 
  canStartGame,
  showInviteDialog,
  setShowInviteDialog,
  toggleReady,
  startGame,
  copyInviteLink,
  gameId
}) => {
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
                className={`flex-1 grass-button ${
                  isReady && "bg-green-500/70 hover:bg-green-600/70"
                }`}
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
};

// Separate component for the game over screen
const GameOver = ({ gameState, navigate }) => {
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
};

// Separate component for opponents list
const OpponentsList = ({ players, currentPlayerId, moveHistory }) => {
  return (
    <div className={`grid gap-3 mb-6 ${
      players.length <= 1 ? "grid-cols-1" :
      players.length <= 2 ? "grid-cols-2" : "grid-cols-3"
    }`}>
      {players.map((player) => {
        // Find the last move by this player
        const lastMove = moveHistory
          .filter(move => move.playerId === player.id)
          .sort((a, b) => b.timestamp - a.timestamp)[0];
          
        const isUno = player.cards.length === 1;
        
        return (
          <div
            key={player.id}
            className={`
              text-center p-3 rounded-lg glass-morphism relative dark:bg-black/30
              ${player.id === currentPlayerId && "player-active"}
              ${isUno ? "uno-called" : ""}
            `}
          >
            <h3 className="font-medium mb-1 flex items-center justify-center gap-1">
              {player.id === currentPlayerId && (
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              )}
              {player.name}
            </h3>
            <p className="text-xs text-gray-300 dark:text-gray-400 mb-2">{player.cards.length} cards</p>

            {/* Last played card indicator */}
            {lastMove && (
              <div className="flex justify-center items-center mt-1">
                <div className="text-xs px-2 py-1 rounded bg-white/10 dark:bg-white/5 flex items-center gap-1">
                  Last played: {lastMove.card.color} {lastMove.card.value}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Game;
