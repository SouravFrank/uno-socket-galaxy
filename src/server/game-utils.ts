
import { GameRoom } from './types';

export function generateInitialCards(isFlipped: boolean = false) {
  const cards = [];
  for (let i = 0; i < 7; i++) {
    cards.push(generateRandomCard(isFlipped));
  }
  return cards;
}

export function generateRandomCard(isFlipped: boolean = false) {
  const colors: ("red" | "blue" | "green" | "yellow")[] = ["red", "blue", "green", "yellow"];
  const regularValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "+2", "skip", "reverse"];
  const flipValues = [1, 2, 3, 4, 5, "+5", "skip all", "reverse all"];
  
  const values = isFlipped ? flipValues : regularValues;
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    color: colors[Math.floor(Math.random() * colors.length)],
    value: values[Math.floor(Math.random() * values.length)],
  };
}

export function isCardPlayable(card: GameRoom['currentCard'], currentCard: GameRoom['currentCard']) {
  return card.color === currentCard.color || 
         card.value === currentCard.value || 
         card.color === 'black';
}

export function getNextPlayerIndex(currentIndex: number, totalPlayers: number, direction: 1 | -1): number {
  return (currentIndex + direction + totalPlayers) % totalPlayers;
}
