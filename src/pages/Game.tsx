
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
import OpponentsList from "@/components/OpponentsList";
import GameLobby from "@/components/GameLobby";
import GameOver from "@/components/GameOver";
import { useGameLogic } from "@/hooks/useGameLogic";
import { ColorPicker } from "@/components/ColorPicker";

const Game = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLearningMode } = useLearningStore();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const {
    // Add these two properties
    showColorPicker,
    handleColorSelect,
    // Keep the rest of existing destructured properties
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
  } = useGameLogic(gameId, navigate, location);

  useEffect(() => {
    if (!gameId) {
      navigate('/');
      return;
    }

    const playerName = location.state?.playerName;
    if (!playerName) {
      navigate('/');
    }
  }, [gameId, navigate, location.state]);

  // Render game lobby while waiting for players
  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-green-500/10 dark:from-green-900/20 dark:via-yellow-900/10 dark:to-green-900/20">
        <div className="text-center glass-morphism p-8 rounded-xl dark:bg-black/30">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500 border-4 border-green-500 border-t-transparent rounded-full" />
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
    gameState.isCardPlayable ? 
    gameState.isCardPlayable(card, gameState.currentCard) && gameState.currentPlayer === playerId && pendingDrawCount === 0 :
    false
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
      {/* Add ColorPicker at the same level as other top-level components */}
      {showColorPicker && (
        <ColorPicker
          open={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          onSelect={handleColorSelect}
        />
      )}

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 dark:bg-black/30 cursor-pointer"
      >
        {soundEnabled ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
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
          unoPressed={isUnoPressed}
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
          gameState={gameState}
          playerId={playerId}
        />
      </div>
    </div>
  );
};

export default Game;


