export interface GameRoom {
  id: string;
  players: {
    id: string;
    name: string;
    cards: Array<{
      id: string;
      color: "red" | "blue" | "green" | "yellow" | "black";
      value: string | number;
    }>;
    isHost: boolean;
    isReady: boolean;
  }[];
  currentCard: {
    color: "red" | "blue" | "green" | "yellow" | "black";
    value: string | number;
  };
  currentPlayer: string;
  gameMode: string;
  direction: 1 | -1;
  isFlipped?: boolean;
  status: "waiting" | "starting" | "playing" | "finished";
  minPlayers: number;
  maxPlayers: number;
}

export interface ServerToClientEvents {
  game_created: (data: { gameId: string; gameState: GameRoom }) => void;
  game_updated: (data: { gameState: GameRoom }) => void;
  player_joined: (data: { gameState: GameRoom }) => void;
  player_left: (data: { gameState: GameRoom }) => void;
  card_drawn: (data: { card: GameRoom['players'][0]['cards'][0] }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  create_game: (data: { playerName: string; gameMode: string }) => void;
  join_game: (data: { gameId: string; playerName: string }) => void;
  play_card: (data: { gameId: string; cardId: string }) => void;
  draw_card: (data: { gameId: string }) => void;
  flip_deck: (data: { gameId: string }) => void;
}
