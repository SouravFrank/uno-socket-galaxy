
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { GameMode } from "@/types/game";
import GameModeCard from "./GameModeCard";
import { Loader2 } from "lucide-react";

interface GameModeSelectorProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  onNext: () => void;
  onBack: () => void;
  gameModes: GameMode[];
  isLoading: boolean;
}

const GameModeSelector = ({
  selectedMode,
  setSelectedMode,
  onNext,
  onBack,
  gameModes,
  isLoading,
}: GameModeSelectorProps) => {
  return (
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
        disabled={isLoading}
      >
        {gameModes.map((mode) => (
          <GameModeCard key={mode.id} mode={mode} />
        ))}
      </RadioGroup>
      <div className="flex gap-3 pt-4">
        <Button onClick={onBack} variant="outline" className="w-1/2" disabled={isLoading}>
          Back
        </Button>
        <Button
          onClick={onNext}
          className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default GameModeSelector;
