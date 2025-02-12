
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import PlayerInfo from "@/components/home/PlayerInfo";
import GameModeSelector from "@/components/home/GameModeSelector";
import GameOptions from "@/components/home/GameOptions";
import { gameModes } from "@/types/game";

const Index = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedMode, setSelectedMode] = useState<string>("classic");
  const [step, setStep] = useState<"info" | "mode" | "final">("info");

  const createGame = () => {
    if (!playerName.trim() || !selectedMode) return;
    // TODO: Implement game creation with selected mode
    console.log("Creating game with mode:", selectedMode);
  };

  const joinGame = () => {
    if (!gameCode.trim() || !playerName.trim()) return;
    // TODO: Implement game joining
    console.log("Joining game:", gameCode);
  };

  const nextStep = () => {
    if (step === "info" && playerName.trim()) {
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
              />
            )}

            {step === "mode" && (
              <GameModeSelector
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                onNext={nextStep}
                onBack={prevStep}
                gameModes={gameModes}
              />
            )}

            {step === "final" && (
              <GameOptions
                gameCode={gameCode}
                setGameCode={setGameCode}
                onCreateGame={createGame}
                onJoinGame={joinGame}
                onBack={prevStep}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
