
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const Index = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  const createGame = () => {
    if (!playerName.trim()) return;
    // TODO: Implement game creation
  };

  const joinGame = () => {
    if (!gameCode.trim() || !playerName.trim()) return;
    // TODO: Implement game joining
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
            <div className="space-y-6">
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
