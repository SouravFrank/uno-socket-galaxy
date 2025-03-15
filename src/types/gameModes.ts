
import { GameMode } from "./game";

export interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  difficulty: string;
  rules: string[];
}

// Game modes data
export const gameModes: GameModeInfo[] = [
  {
    id: "classic",
    name: "Classic UNO",
    description: "The traditional UNO game with standard rules. Match cards by color or number.",
    difficulty: "Easy",
    rules: [
      "Match cards by color, number or symbol",
      "Draw cards when you can't match",
      "Special cards: Skip, Reverse, Draw Two, Wild, Wild Draw Four"
    ]
  },
  {
    id: "flip",
    name: "UNO Flip",
    description: "Play both sides! Flip between light and dark sides with different cards and rules.",
    difficulty: "Medium",
    rules: [
      "All Classic UNO rules apply",
      "Flip cards switch between light and dark sides",
      "Dark side has more powerful cards",
      "Draw Five and Skip Everyone cards on dark side"
    ]
  },
  {
    id: "doubles",
    name: "UNO Doubles",
    description: "Team up with another player and coordinate your moves to win together.",
    difficulty: "Medium",
    rules: [
      "Play in teams of two",
      "Team members sit across from each other",
      "Can't communicate about cards",
      "Both players in a team must play their last card to win"
    ]
  },
  {
    id: "speed",
    name: "UNO Speed",
    description: "Fast-paced version where everyone plays simultaneously. Quick reflexes required!",
    difficulty: "Hard",
    rules: [
      "No turns - everyone plays at the same time",
      "Race to play valid cards as quickly as possible",
      "First player to use all their cards wins",
      "Draw card if you can't play"
    ]
  },
  {
    id: "nomercy",
    name: "UNO No Mercy",
    description: "Aggressive gameplay with stacking penalties. Not for the faint of heart!",
    difficulty: "Hard",
    rules: [
      "Draw 2 and Draw 4 cards can be stacked",
      "Draw 2 on Draw 2 makes next player draw 4",
      "No challenging Wild Draw 4 cards",
      "Skip cards can be played on Skip cards"
    ]
  }
];
