
export type GameMode = {
  id: string;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  rules: string[];
};

export const gameModes: GameMode[] = [
  {
    id: "classic",
    name: "UNO Classic",
    description: "The original UNO game with standard rules and gameplay mechanics.",
    difficulty: "Easy",
    rules: [
      "Match cards by color or number",
      "Use action cards to skip, reverse, or make others draw",
      "Say 'UNO' when you have one card left",
      "First player to get rid of all cards wins"
    ]
  },
  {
    id: "doubles",
    name: "UNO Doubles",
    description: "Play two matching cards at once to create powerful combinations and strategic plays.",
    difficulty: "Medium",
    rules: [
      "Play two cards of the same number in one turn",
      "Doubles stack with action cards",
      "More complex strategies required",
      "Faster-paced gameplay"
    ]
  },
  {
    id: "speed",
    name: "UNO Speed",
    description: "Fast-paced variant where players have limited time to make their moves.",
    difficulty: "Hard",
    rules: [
      "15-second turn timer",
      "Auto-draw if time runs out",
      "Quick thinking required",
      "Perfect for experienced players"
    ]
  },
  {
    id: "flip",
    name: "UNO Flip",
    description: "Play with two-sided cards, switching between light and dark sides for added complexity.",
    difficulty: "Hard",
    rules: [
      "Cards have two sides with different values",
      "Flip cards change game dynamics",
      "Unique action cards on dark side",
      "Strategic deck flipping mechanics"
    ]
  },
  {
    id: "nomercy",
    name: "UNO No Mercy",
    description: "Intense variant where action cards can be stacked, leading to dramatic turns.",
    difficulty: "Hard",
    rules: [
      "Stack Draw 2 and Draw 4 cards",
      "No limits on action card chains",
      "Highly competitive gameplay",
      "Dramatic comebacks possible"
    ]
  }
].sort((a, b) => {
  const difficultyOrder = { "Easy": 0, "Medium": 1, "Hard": 2 };
  return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
});
