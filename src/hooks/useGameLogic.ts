
import { useState, useEffect } from "react";
import { useNavigate, Location } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
import useSocket from "./useSocket";

// Helper function to create a move history item
interface MoveHistoryItem {
  playerId: string;
  playerName: string;
  card: UnoCardType;
  timestamp: number;
}

const createMoveHistoryItem = (playerId: string, playerName: string, card: UnoCardType): MoveHistoryItem => {
  return {
    playerId,
    playerName,
    card,
    timestamp: Date.now()
  };
};

export const useGameLogic = (gameId: string | undefined, navigate: ReturnType<typeof useNavigate>, location: Location) => {
  const socket = useSocket();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isUnoPressed, setIsUnoPressed] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryItem[]>([]);
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

  return {
    gameState,
    playerId,
    pendingDrawCount,
    moveHistory,
    directionChanged,
    isUnoPressed,
    setIsUnoPressed,
    showInviteDialog, 
    setShowInviteDialog,
    handlePlayCard,
    handleDrawCard,
    handleUnoButton,
    handleFlipDeck,
    copyInviteLink,
    toggleReady,
    startGame
  };
};
