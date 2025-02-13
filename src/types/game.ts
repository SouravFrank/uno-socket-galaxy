
export type GameMode = {
  id: string;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export const gameModes: GameMode[] = [
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
  {
    id: "flip",
    name: "UNO Flip",
    description: "Play with both light and dark sides of special UNO Flip cards",
    difficulty: "Hard",
  },
];
