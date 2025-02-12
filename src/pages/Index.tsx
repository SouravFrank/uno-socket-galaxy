
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type GameMode = {
  id: string;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

const gameModes: GameMode[] = [
  {
    id: "classic",
    name: "UNO Classic",
    description: "The original UNO game you know and love",
    difficulty: "Easy",
  },
  {
    id: "reverse",
    name: "UNO Reverse",
    description: "Start with 7 cards, play in reverse order",
    difficulty: "Medium",
  },
  {
    id: "nomercy",
    name: "UNO No Mercy",
    description: "Stack +2 and +4 cards without mercy!",
    difficulty: "Hard",
  },
  {
    id: "speed",
    name: "UNO Speed",
    description: "Fast-paced game with 15-second turns",
    difficulty: "Hard",
  },
  {
    id: "doubles",
    name: "UNO Doubles",
    description: "Play two cards of the same number at once",
    difficulty: "Medium",
  },
];

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
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!playerName.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Next
                </Button>
              </motion.div>
            )}

            {step === "mode" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold mb-4">Select Game Mode</h3>
                <RadioGroup
                  value={selectedMode}
                  onValueChange={setSelectedMode}
                  className="space-y-4"
                >
                  {gameModes.map((mode) => (
                    <div
                      key={mode.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <RadioGroupItem value={mode.id} id={mode.id} />
                      <Label
                        htmlFor={mode.id}
                        className="grid gap-1.5 leading-none"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{mode.name}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              mode.difficulty === "Easy"
                                ? "bg-green-100 text-green-700"
                                : mode.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {mode.difficulty}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {mode.description}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="w-1/2"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "final" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <Button
                    onClick={createGame}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300"
                  >
                    Create New Game
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                        or
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter game code"
                      value={gameCode}
                      onChange={(e) => setGameCode(e.target.value)}
                      className="w-full"
                    />
                    <Button
                      onClick={joinGame}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
                    >
                      Join Game
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="w-full"
                >
                  Back
                </Button>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
