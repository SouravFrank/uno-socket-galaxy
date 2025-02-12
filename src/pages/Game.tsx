import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import UnoCard from "@/components/UnoCard";
import GameHints from "@/components/GameHints";
import { useLearningStore } from "@/stores/useLearningStore";
import LearningModeToggle from "@/components/LearningModeToggle";
import { Button } from "@/components/ui/button";

interface GameState {
  currentPlayer: string;
  players: { id: string; name: string; cards: number }[];
  currentCard: { color: "red" | "blue" | "green" | "yellow" | "black"; value: string | number };
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
}

const Game = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const { isLearningMode } = useLearningStore();
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: "player1",
    players: [
      { id: "player1", name: "You", cards: 7 },
      { id: "player2", name: "Player 2", cards: 7 },
      { id: "player3", name: "Player 3", cards: 7 },
    ],
    currentCard: { color: "red", value: "7" },
    myCards: [
      { id: "1", color: "red", value: "6" },
      { id: "2", color: "blue", value: "9" },
      { id: "3", color: "green", value: "4" },
    ],
    playableCards: [{ id: "1", color: "red", value: "6" }],
  });

  const playCard = (cardId: string) => {
    const card = gameState.myCards.find((c) => c.id === cardId);
    if (!card) return;

    // TODO: Implement card playing logic with Socket.IO
    console.log("Playing card:", card);
  };

  const drawCard = () => {
    // TODO: Implement card drawing logic with Socket.IO
    console.log("Drawing card");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-500/10 via-blue-500/10 to-green-500/10">
      {/* Learning Mode Toggle */}
      <LearningModeToggle />

      {/* Game Hints */}
      <GameHints playableCards={gameState.playableCards} isVisible={isLearningMode} />

      {/* Game Board */}
      <div className="container mx-auto px-4 py-8">
        {/* Other Players */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {gameState.players
            .filter((p) => p.id !== "player1")
            .map((player) => (
              <div
                key={player.id}
                className="text-center p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <h3 className="font-medium mb-2">{player.name}</h3>
                <p className="text-sm text-gray-500">{player.cards} cards</p>
              </div>
            ))}
        </div>

        {/* Current Card */}
        <div className="flex justify-center mb-8">
          <UnoCard
            color={gameState.currentCard.color}
            value={gameState.currentCard.value}
          />
        </div>

        {/* Player's Hand */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <div className="flex justify-center gap-2 mb-4">
            <Button
              onClick={drawCard}
              variant="outline"
              className="bg-white dark:bg-gray-700"
            >
              Draw Card
            </Button>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto pb-4">
            {gameState.myCards.map((card) => (
              <UnoCard
                key={card.id}
                color={card.color}
                value={card.value}
                isPlayable={gameState.playableCards.some((c) => c.id === card.id)}
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
