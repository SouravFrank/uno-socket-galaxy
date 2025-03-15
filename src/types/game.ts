import { v4 as uuidv4 } from 'uuid';

export type GameMode = "classic" | "flip" | "doubles" | "speed" | "nomercy";

export interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  rules: string[];
}

export const gameModes: GameModeInfo[] = [
  {
    id: "classic",
    name: "Classic UNO",
    description: "The original UNO game with standard rules.",
    difficulty: "Easy",
    rules: [
      "Match cards by color or number",
      "Special cards: Skip, Reverse, Draw Two, Wild, Wild Draw Four"
    ]
  },
  {
    id: "flip",
    name: "UNO Flip",
    description: "Play with two-sided cards - flip between light and dark sides!",
    difficulty: "Medium",
    rules: [
      "Standard UNO rules plus the Flip card",
      "Flip card changes gameplay to the other side of all cards",
      "Dark side has more powerful cards with bigger penalties"
    ]
  },
  {
    id: "doubles",
    name: "UNO Doubles",
    description: "Play two cards at once if they match!",
    difficulty: "Medium",
    rules: [
      "Standard UNO rules plus ability to play two matching cards at once",
      "Matching means same number or same special card type",
      "Playing doubles skips the next player"
    ]
  },
  {
    id: "speed",
    name: "UNO Speed",
    description: "Fast-paced UNO with a timer for each turn!",
    difficulty: "Hard",
    rules: [
      "Standard UNO rules with a 5-second timer for each turn",
      "If time runs out, draw a card and lose your turn",
      "No card stacking or challenges"
    ]
  },
  {
    id: "nomercy",
    name: "UNO No Mercy",
    description: "Ultimate UNO challenge with special penalties!",
    difficulty: "Hard",
    rules: [
      "All penalty cards can be stacked",
      "If you can't play, keep drawing until you can",
      "Forget to say UNO? Draw FOUR cards!"
    ]
  }
].sort((a, b) => {
  const difficultyOrder = { "Easy": 0, "Medium": 1, "Hard": 2 };
  return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
});

export type CardColor = "red" | "blue" | "green" | "yellow" | "black";
export type CardValue = string | number;

export interface UnoCard {
  id: string;
  color: CardColor;
  value: CardValue;
}

export interface Player {
  id: string;
  name: string;
  cards: UnoCard[];
  isHost?: boolean;
  isReady?: boolean;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayer: string;
  currentCard: UnoCard;
  direction: 1 | -1;
  status: "waiting" | "playing" | "finished";
  gameMode: string;
  isFlipped?: boolean;
  winner?: string;
}

export function createDummyGameState(gameId: string, hostName: string, gameMode: string): GameState {
  const hostId = "host-" + Math.random().toString(36).substring(2, 9);
  const initialCard = generateRandomCard();
  
  return {
    id: gameId,
    players: [
      {
        id: hostId,
        name: hostName,
        cards: generateInitialCards(),
        isHost: true,
        isReady: false
      }
    ],
    currentPlayer: hostId,
    currentCard: initialCard,
    direction: 1,
    status: "waiting",
    gameMode: gameMode
  };
}

export function addDummyPlayer(gameState: GameState, playerName: string): GameState {
  const playerId = "player-" + Math.random().toString(36).substring(2, 9);
  
  return {
    ...gameState,
    players: [
      ...gameState.players,
      {
        id: playerId,
        name: playerName,
        cards: generateInitialCards(),
        isHost: false,
        isReady: false
      }
    ]
  };
}

export function togglePlayerReady(gameState: GameState, playerId: string): GameState {
  return {
    ...gameState,
    players: gameState.players.map(player => 
      player.id === playerId 
        ? { ...player, isReady: !player.isReady }
        : player
    )
  };
}

export function startDummyGame(gameState: GameState): GameState {
  if (gameState.players.length >= 2 && gameState.players.every(p => p.isReady)) {
    return {
      ...gameState,
      status: "playing"
    };
  }
  return gameState;
}

export function playCard(gameState: GameState, playerId: string, cardId: string): GameState {
  if (gameState.currentPlayer !== playerId) {
    return gameState;
  }
  
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return gameState;
  
  const cardIndex = player.cards.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return gameState;
  
  const card = player.cards[cardIndex];
  
  if (!isCardPlayable(card, gameState.currentCard)) {
    return gameState;
  }
  
  const updatedPlayer = {
    ...player,
    cards: [...player.cards.slice(0, cardIndex), ...player.cards.slice(cardIndex + 1)]
  };
  
  if (updatedPlayer.cards.length === 0) {
    return {
      ...gameState,
      players: gameState.players.map(p => p.id === playerId ? updatedPlayer : p),
      currentCard: card,
      status: "finished",
      winner: playerId
    };
  }
  
  let nextPlayerIndex = getNextPlayerIndex(
    gameState.players.findIndex(p => p.id === playerId),
    gameState.players.length,
    gameState.direction
  );
  
  let newDirection = gameState.direction;
  
  if (card.value === "skip") {
    nextPlayerIndex = getNextPlayerIndex(
      nextPlayerIndex,
      gameState.players.length,
      gameState.direction
    );
  } else if (card.value === "reverse") {
    newDirection = gameState.direction === 1 ? -1 : 1;
    nextPlayerIndex = getNextPlayerIndex(
      gameState.players.findIndex(p => p.id === playerId),
      gameState.players.length,
      newDirection
    );
  } else if (card.value === "+2") {
    const nextPlayer = gameState.players[nextPlayerIndex];
    const updatedNextPlayer = {
      ...nextPlayer,
      cards: [...nextPlayer.cards, generateRandomCard(), generateRandomCard()]
    };
    
    return {
      ...gameState,
      players: gameState.players.map(p => 
        p.id === playerId ? updatedPlayer : 
        p.id === nextPlayer.id ? updatedNextPlayer : p
      ),
      currentCard: card,
      currentPlayer: gameState.players[getNextPlayerIndex(nextPlayerIndex, gameState.players.length, newDirection)].id,
      direction: newDirection
    };
  }
  
  return {
    ...gameState,
    players: gameState.players.map(p => p.id === playerId ? updatedPlayer : p),
    currentCard: card,
    currentPlayer: gameState.players[nextPlayerIndex].id,
    direction: newDirection
  };
}

export function drawCard(gameState: GameState, playerId: string): GameState {
  if (gameState.currentPlayer !== playerId) {
    return gameState;
  }
  
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return gameState;
  
  const newCard = generateRandomCard();
  const updatedPlayer = {
    ...player,
    cards: [...player.cards, newCard]
  };
  
  if (isCardPlayable(newCard, gameState.currentCard)) {
    return {
      ...gameState,
      players: gameState.players.map(p => p.id === playerId ? updatedPlayer : p)
    };
  } else {
    const nextPlayerIndex = getNextPlayerIndex(
      gameState.players.findIndex(p => p.id === playerId),
      gameState.players.length,
      gameState.direction
    );
    
    return {
      ...gameState,
      players: gameState.players.map(p => p.id === playerId ? updatedPlayer : p),
      currentPlayer: gameState.players[nextPlayerIndex].id
    };
  }
}

export function flipDeck(gameState: GameState): GameState {
  if (gameState.gameMode !== "flip") return gameState;
  
  return {
    ...gameState,
    isFlipped: !gameState.isFlipped,
  };
}

export function generateRandomCard(): UnoCard {
  const colors: CardColor[] = ["red", "blue", "green", "yellow"];
  const values: CardValue[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "+2", "skip", "reverse"];
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    color: colors[Math.floor(Math.random() * colors.length)],
    value: values[Math.floor(Math.random() * values.length)]
  };
}

export function generateInitialCards(): UnoCard[] {
  const cards: UnoCard[] = [];
  for (let i = 0; i < 7; i++) {
    cards.push(generateRandomCard());
  }
  return cards;
}

export function isCardPlayable(card: UnoCard, currentCard: UnoCard): boolean {
  return card.color === currentCard.color || 
         card.value === currentCard.value || 
         card.color === 'black';
}

export function getNextPlayerIndex(currentIndex: number, totalPlayers: number, direction: 1 | -1): number {
  return (currentIndex + direction + totalPlayers) % totalPlayers;
}
