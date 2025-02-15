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
import { Share2, Crown, CheckCircle2, Users } from "lucide-react";
import { GameRoom } from "@/server/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GameState extends Omit<GameRoom, 'players'> {
  players: GameRoom['players'];
  myCards: GameRoom['players'][0]['cards'];
  playableCards: GameRoom['players'][0]['cards'];
}

const Game = () => {
  const { gameId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const { toast } = useToast();
  const { isLearningMode } = useLearningStore();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    id: "",
    currentPlayer: "",
    players: [],
    currentCard: { color: "red", value: "0" },
    myCards: [],
    playableCards: [],
    status: "waiting",
    gameMode: "classic",
    direction: 1,
    minPlayers: 2,
    maxPlayers: 4,
  });

  useEffect(() => {
    if (!socket || !gameId) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the game. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const playerName = location.state?.playerName;
    if (!playerName) {
      navigate('/');
      return;
    }

    // Join or create game based on whether we're the first player
    if (gameState.players.length === 0) {
      socket.emit('create_game', { playerName, gameMode: "classic" });
    } else {
      socket.emit('join_game', { gameId, playerName });
    }

    const handleGameUpdate = ({ gameState: newGameState }) => {
      setGameState(prev => ({
        ...newGameState,
        myCards: newGameState.players.find(p => p.id === socket.id)?.cards || [],
        playableCards: (newGameState.players.find(p => p.id === socket.id)?.cards || [])
          .filter(card => isCardPlayable(card, newGameState.currentCard)),
      }));
    };

    socket.on('game_created', ({ gameState: newGameState }) => {
      handleGameUpdate({ gameState: newGameState });
    });

    socket.on('game_updated', handleGameUpdate);
    socket.on('player_joined', handleGameUpdate);
    socket.on('game_started', handleGameUpdate);

    socket.on('player_joined', ({ gameState: newGameState }) => {
      toast({
        title: 'Player Joined',
        description: `${newGameState.players[newGameState.players.length - 1].name} joined the game`,
      });
    });

    return () => {
      socket.off('game_created');
      socket.off('game_updated');
      socket.off('player_joined');
      socket.off('game_started');
    };
  }, [socket, gameId]);

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/game/${gameId}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Invite Link Copied",
      description: "Share this link with your friends to join the game!",
    });
  };

  const toggleReady = () => {
    if (!socket || !gameId) return;
    socket.emit('toggle_ready', { gameId });
  };

  const startGame = () => {
    if (!socket || !gameId) return;
    socket.emit('start_game', { gameId });
  };

  const getCurrentPlayer = () => {
    return gameState.players.find(p => p.id === socket?.id);
  };

  const isHost = getCurrentPlayer()?.isHost;
  const isReady = getCurrentPlayer()?.isReady;
  const allPlayersReady = gameState.players.every(p => p.isReady);
  const canStartGame = isHost && allPlayersReady && gameState.players.length >= 2;

  const isCardPlayable = (card: GameRoom['players'][0]['cards'][0], currentCard: GameRoom['currentCard']) => {
    return card.color === currentCard.color || 
           card.value === currentCard.value || 
           card.color === 'black';
  };

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

  // const isCardPlayable = (card: any, currentCard: any) => {
  //   return card.color === currentCard.color || 
  //          card.value === currentCard.value || 
  //          card.color === 'black';
  // };

  if (!socket) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Unable to connect to the game server.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

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
            .filter((p) => p.id !== socket?.id)
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
              disabled={gameState.currentPlayer !== socket?.id}
            >
              Draw Card
            </Button>
            
            {gameState.isFlipped !== undefined && (
              <Button
                onClick={flipDeck}
                variant="outline"
                className="bg-white dark:bg-gray-700"
                disabled={gameState.currentPlayer !== socket?.id}
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
                isPlayable={gameState.playableCards.some((c) => c.id === card.id) && gameState.currentPlayer === socket?.id}
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
