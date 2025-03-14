
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface GameOptionsProps {
  gameCode: string;
  setGameCode: (code: string) => void;
  onCreateGame: () => void;
  onJoinGame: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const GameOptions = ({
  gameCode,
  setGameCode,
  onCreateGame,
  onJoinGame,
  onBack,
  isLoading,
}: GameOptionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold mb-4">Choose an Option</h3>
      <div className="space-y-4">
        <Button
          onClick={onCreateGame}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating game...
            </>
          ) : (
            "Create New Game"
          )}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
              or
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter game code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value.toUpperCase())}
            className="w-full"
            maxLength={6}
            disabled={isLoading}
          />
          <Button
            onClick={onJoinGame}
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={!gameCode.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining game...
              </>
            ) : (
              "Join Game"
            )}
          </Button>
        </div>
      </div>
      <Button onClick={onBack} variant="outline" className="w-full" disabled={isLoading}>
        Back
      </Button>
    </motion.div>
  );
};
