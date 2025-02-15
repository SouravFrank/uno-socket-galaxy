
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { GameMode } from "@/types/game";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface GameModeCardProps {
  mode: GameMode;
}

const GameModeCard = ({ mode }: GameModeCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors">
      <RadioGroupItem value={mode.id} id={mode.id} className="mt-1" />
      <div className="flex-1">
        <Label htmlFor={mode.id} className="grid gap-1.5 leading-none cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="font-medium">{mode.name}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                mode.difficulty === "Easy"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : mode.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {mode.difficulty}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {mode.description}
          </span>
        </Label>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
          <CollapsibleTrigger className="flex items-center text-sm text-blue-500 hover:text-blue-600">
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            <span className="ml-1">{isOpen ? 'Hide rules' : 'Show rules'}</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
              {mode.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default GameModeCard;
