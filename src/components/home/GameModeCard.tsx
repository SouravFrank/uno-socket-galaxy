
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { GameMode } from "@/types/game";

interface GameModeCardProps {
  mode: GameMode;
}

const GameModeCard = ({ mode }: GameModeCardProps) => {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
      <RadioGroupItem value={mode.id} id={mode.id} />
      <Label htmlFor={mode.id} className="grid gap-1.5 leading-none">
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
  );
};

export default GameModeCard;
