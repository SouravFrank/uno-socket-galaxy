
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import PlayerInfo from "@/components/home/PlayerInfo";
import GameModeSelector from "@/components/home/GameModeSelector";
import GameOptions from "@/components/home/GameOptions";
import { gameModes } from "@/types/game";
import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/components/ui/use-toast";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 20;

const Index = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedMode, setSelectedMode] = useState<string>("classic");
  const [step, setStep] = useState<"info" | "mode" | "final">("info");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const socket = useSocket();
  const { toast } = useToast();

  const validatePlayerName = (name: string) => {
    if (name.length < MIN_NAME_LENGTH) {
      toast({
        title: "Invalid Name",
        description: `Name must be at least ${MIN_NAME_LENGTH} characters long`,
        variant: "destructive",
      });
      return false;
    }
    if (name.length > MAX_NAME_LENGTH) {
      toast({
        title: "Invalid Name",
        description: `Name must be less than ${MAX_NAME_LENGTH} characters`,
        variant: "destructive",
      });
      return false;
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      toast({
        title: "Invalid Name",
        description: "Name can only contain letters, numbers, and spaces",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const createGame = async () => {
    if (!socket || !validatePlayerName(playerName)) return;
    
    setIsLoading(true);
    socket.emit('create_game', { playerName, gameMode: selectedMode });
    
    socket.on('game_created', ({ gameId, gameState }) => {
      setIsLoading(false);
      if (gameState.players.length > 0) {
        toast({
          title: "Game Created",
          description: `Share the code ${gameId} with your friends to join!`,
        });
        navigate(`/game/${gameId}`, { state: { playerName } });
      }
    });

    socket.on('error', ({ message }) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    });
  };

  const joinGame = async () => {
    if (!socket || !validatePlayerName(playerName)) return;
    
    if (!gameCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a game code",
        variant: "destructive",
      });
      return;
    }

    if (!/^[A-Z0-9]{6}$/.test(gameCode.toUpperCase())) {
      toast({
        title: "Invalid Game Code",
        description: "Game code must be 6 characters long and contain only letters and numbers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    socket.emit('join_game', { gameId: gameCode.toUpperCase(), playerName });

    socket.on('error', ({ message }) => {
      setIsLoading(false);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    });

    socket.on('player_joined', ({ gameState }) => {
      setIsLoading(false);
      if (gameState.players.length > MAX_PLAYERS) {
        toast({
          title: "Game Full",
          description: `Maximum ${MAX_PLAYERS} players allowed`,
          variant: "destructive",
        });
        return;
      }
      navigate(`/game/${gameCode.toUpperCase()}`, { state: { playerName } });
    });
  };

  const nextStep = () => {
    if (step === "info") {
      if (!validatePlayerName(playerName)) return;
      setStep("mode");
    } else if (step === "mode" && selectedMode) {
      setStep("final");
    }
  };

  const prevStep = () => {
    if (step === "mode") {
      setStep("info");
    } else if (step === "final") {
      setStep("mode");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-500/10 via-blue-500/10 to-green-500/10">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
            UNO Online
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Play the classic card game with friends online
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl">
            {step === "info" && (
              <PlayerInfo
                playerName={playerName}
                setPlayerName={setPlayerName}
                onNext={nextStep}
                isLoading={isLoading}
              />
            )}

            {step === "mode" && (
              <GameModeSelector
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                onNext={nextStep}
                onBack={prevStep}
                gameModes={gameModes}
                isLoading={isLoading}
              />
            )}

            {step === "final" && (
              <GameOptions
                gameCode={gameCode}
                setGameCode={setGameCode}
                onCreateGame={createGame}
                onJoinGame={joinGame}
                onBack={prevStep}
                isLoading={isLoading}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
