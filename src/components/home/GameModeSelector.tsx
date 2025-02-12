
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { GameMode } from "@/types/game";
import GameModeCard from "./GameModeCard";

interface GameModeSelectorProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
  onNext: () => void;
  onBack: () => void;
  gameModes: GameMode[];
}

const GameModeSelector = ({
  selectedMode,
  setSelectedMode,
  onNext,
  onBack,
  gameModes,
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
      >
        {gameModes.map((mode) => (
          <GameModeCard key={mode.id} mode={mode} />
        ))}
      </RadioGroup>
      <div className="flex gap-3 pt-4">
        <Button onClick={onBack} variant="outline" className="w-1/2">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="w-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default GameModeSelector;
