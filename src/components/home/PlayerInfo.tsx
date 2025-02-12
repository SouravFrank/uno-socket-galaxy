
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlayerInfoProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onNext: () => void;
}

const PlayerInfo = ({ playerName, setPlayerName, onNext }: PlayerInfoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium mb-2">Your Name</label>
        <Input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full"
        />
      </div>
      <Button
        onClick={onNext}
        disabled={!playerName.trim()}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
      >
        Next
      </Button>
    </motion.div>
  );
};

export default PlayerInfo;
