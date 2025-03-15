import { v4 as uuidv4 } from 'uuid';

export type GameMode = "classic" | "flip" | "doubles" | "speed" | "nomercy";

export interface UnoCard {
  id: string;
  color: "red" | "blue" | "green" | "yellow" | "black";
  value: number | "skip" | "reverse" | "+2" | "wild" | "+4";
}

export interface Player {
  id: string;
  name: string;
  cards: UnoCard[];
  isReady: boolean;
  isHost: boolean;
}

export interface GameState {
  id: string;
  gameMode: GameMode;
  players: Player[];
  currentPlayer: string;
  direction: "clockwise" | "counter-clockwise";
  status: "waiting" | "playing" | "finished";
  winner: string | null;
  currentCard: UnoCard;
  deck: UnoCard[];
  discardPile: UnoCard[];
  isFlipped?: boolean;
  lastAction?: "play" | "draw" | "skip" | "reverse";
}

// Create a dummy game state for development/testing
export function createDummyGameState(gameId: string, playerName: string, gameMode: GameMode): GameState {
  // Create a deck of cards
  const deck: UnoCard[] = [];
  const colors: ("red" | "blue" | "green" | "yellow")[] = ["red", "blue", "green", "yellow"];

  // Add number cards (0-9, with one 0 and two 1-9 for each color)
  colors.forEach(color => {
    // Add one 0 for each color
    deck.push({ id: uuidv4(), color, value: 0 });

    // Add two of each number 1-9 for each color
    for (let value = 1; value <= 9; value++) {
      deck.push({ id: uuidv4(), color, value });
      deck.push({ id: uuidv4(), color, value });
    }

    // Add special cards (two of each per color)
    for (let i = 0; i < 2; i++) {
      deck.push({ id: uuidv4(), color, value: "skip" });
      deck.push({ id: uuidv4(), color, value: "reverse" });
      deck.push({ id: uuidv4(), color, value: "+2" });
    }
  });

  // Add wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    deck.push({ id: uuidv4(), color: "black", value: "wild" });
    deck.push({ id: uuidv4(), color: "black", value: "+4" });
  }

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Get starting card (should not be a wild card)
  let startingCardIndex = 0;
  while (deck[startingCardIndex].color === "black") {
    startingCardIndex++;
  }
  const startingCard = deck[startingCardIndex];
  deck.splice(startingCardIndex, 1);

  // Create the player
  const playerId = uuidv4();
  const playerCards: UnoCard[] = [];
  
  // Deal 7 cards to the player
  for (let i = 0; i < 7; i++) {
    playerCards.push(deck.pop()!);
  }

  const player: Player = {
    id: playerId,
    name: playerName,
    cards: playerCards,
    isReady: false,
    isHost: true
  };

  return {
    id: gameId,
    gameMode,
    players: [player],
    currentPlayer: playerId,
    direction: "clockwise",
    status: "waiting",
    winner: null,
    currentCard: startingCard,
    deck,
    discardPile: [startingCard],
    isFlipped: false
  };
}

// Add a dummy player
export function addDummyPlayer(gameState: GameState, name: string): GameState {
  const newPlayerId = uuidv4();
  const playerCards: UnoCard[] = [];
  
  // Deal 7 cards to the player
  for (let i = 0; i < 7; i++) {
    if (gameState.deck.length > 0) {
      playerCards.push(gameState.deck.pop()!);
    }
  }

  const newPlayer: Player = {
    id: newPlayerId,
    name,
    cards: playerCards,
    isReady: false,
    isHost: false
  };

  return {
    ...gameState,
    players: [...gameState.players, newPlayer]
  };
}

// Toggle player ready state
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

// Start the game
export function startDummyGame(gameState: GameState): GameState {
  const firstPlayerId = gameState.players[0].id;
  
  return {
    ...gameState,
    status: "playing",
    currentPlayer: firstPlayerId
  };
}

// Check if a card is playable on the current card
export function isCardPlayable(card: UnoCard, currentCard: UnoCard): boolean {
  // Wild cards can always be played
  if (card.color === "black") return true;
  
  // Cards with the same color can be played
  if (card.color === currentCard.color) return true;
  
  // Cards with the same value can be played
  if (card.value === currentCard.value) return true;
  
  return false;
}

// Play a card
export function playCard(gameState: GameState, playerId: string, cardId: string): GameState {
  const playerIndex = gameState.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1 || gameState.currentPlayer !== playerId) {
    return gameState;
  }

  const player = gameState.players[playerIndex];
  const cardIndex = player.cards.findIndex(c => c.id === cardId);
  if (cardIndex === -1) {
    return gameState;
  }

  const card = player.cards[cardIndex];
  if (!isCardPlayable(card, gameState.currentCard)) {
    return gameState;
  }

  // Remove the card from the player's hand
  const updatedPlayer = {
    ...player,
    cards: [...player.cards.slice(0, cardIndex), ...player.cards.slice(cardIndex + 1)]
  };

  // Check if the player has won
  if (updatedPlayer.cards.length === 0) {
    return {
      ...gameState,
      status: "finished",
      winner: playerId,
      currentCard: card,
      discardPile: [...gameState.discardPile, card],
      players: [
        ...gameState.players.slice(0, playerIndex),
        updatedPlayer,
        ...gameState.players.slice(playerIndex + 1)
      ]
    };
  }

  // Update game state based on the card played
  let nextPlayerIndex = playerIndex;
  let newDirection = gameState.direction;
  let lastAction: "play" | "skip" | "reverse" = "play";

  switch (card.value) {
    case "skip":
      lastAction = "skip";
      // Skip the next player
      if (gameState.direction === "clockwise") {
        nextPlayerIndex = (playerIndex + 1) % gameState.players.length;
      } else {
        nextPlayerIndex = (playerIndex - 1 + gameState.players.length) % gameState.players.length;
      }
      break;
    case "reverse":
      lastAction = "reverse";
      // Reverse the direction
      newDirection = gameState.direction === "clockwise" ? "counter-clockwise" : "clockwise";
      break;
    default:
      // Move to the next player
      if (gameState.direction === "clockwise") {
        nextPlayerIndex = (playerIndex + 1) % gameState.players.length;
      } else {
        nextPlayerIndex = (playerIndex - 1 + gameState.players.length) % gameState.players.length;
      }
  }

  // Get the next player
  let nextPlayer = gameState.players[nextPlayerIndex].id;

  return {
    ...gameState,
    currentPlayer: nextPlayer,
    direction: newDirection,
    currentCard: card,
    discardPile: [...gameState.discardPile, card],
    players: [
      ...gameState.players.slice(0, playerIndex),
      updatedPlayer,
      ...gameState.players.slice(playerIndex + 1)
    ],
    lastAction
  };
}

// Draw a card
export function drawCard(gameState: GameState, playerId: string): GameState {
  const playerIndex = gameState.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1 || gameState.currentPlayer !== playerId) {
    return gameState;
  }

  // Check if deck is empty
  if (gameState.deck.length === 0) {
    // Reshuffle discard pile into deck except for the top card
    const newDeck = [...gameState.discardPile.slice(0, -1)];
    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    
    // Shuffle the new deck
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    gameState = {
      ...gameState,
      deck: newDeck,
      discardPile: [topCard]
    };
  }

  // Draw a card from the deck
  const drawnCard = gameState.deck[gameState.deck.length - 1];
  const updatedDeck = gameState.deck.slice(0, -1);

  // Add the card to the player's hand
  const player = gameState.players[playerIndex];
  const updatedPlayer = {
    ...player,
    cards: [...player.cards, drawnCard]
  };

  // Check if the drawn card can be played
  const canPlayDrawnCard = isCardPlayable(drawnCard, gameState.currentCard);
  
  // If the card can't be played, move to the next player
  let nextPlayer = playerId;
  if (!canPlayDrawnCard) {
    // Move to the next player
    if (gameState.direction === "clockwise") {
      const nextPlayerIndex = (playerIndex + 1) % gameState.players.length;
      nextPlayer = gameState.players[nextPlayerIndex].id;
    } else {
      const nextPlayerIndex = (playerIndex - 1 + gameState.players.length) % gameState.players.length;
      nextPlayer = gameState.players[nextPlayerIndex].id;
    }
  }

  return {
    ...gameState,
    currentPlayer: nextPlayer,
    deck: updatedDeck,
    players: [
      ...gameState.players.slice(0, playerIndex),
      updatedPlayer,
      ...gameState.players.slice(playerIndex + 1)
    ],
    lastAction: "draw"
  };
}

// Flip the deck (for UNO Flip mode)
export function flipDeck(gameState: GameState): GameState {
  return {
    ...gameState,
    isFlipped: !gameState.isFlipped
  };
}
