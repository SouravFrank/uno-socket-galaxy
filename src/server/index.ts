import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { GameRoom, ServerToClientEvents, ClientToServerEvents } from './types';
import { generateInitialCards, generateRandomCard, isCardPlayable, getNextPlayerIndex } from './game-utils';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
}

const games = new Map<string, GameRoom>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_game', ({ playerName, gameMode }) => {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const isFlipMode = gameMode === 'flip';
    
    const gameRoom: GameRoom = {
      id: gameId,
      players: [{
        id: socket.id,
        name: playerName,
        cards: generateInitialCards(isFlipMode),
        isHost: true,
        isReady: false,
      }],
      currentCard: generateRandomCard(isFlipMode),
      currentPlayer: socket.id,
      gameMode,
      direction: 1,
      isFlipped: isFlipMode ? false : undefined,
      status: "waiting",
      minPlayers: 2,
      maxPlayers: 4,
    };

    games.set(gameId, gameRoom);
    socket.join(gameId);
    
    socket.emit('game_created', { gameId, gameState: gameRoom });
  });

  socket.on('join_game', ({ gameId, playerName }) => {
    const game = games.get(gameId);
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (game.status !== "waiting") {
      socket.emit('error', { message: 'Game has already started' });
      return;
    }

    if (game.players.length >= game.maxPlayers) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    if (game.players.some(p => p.name === playerName)) {
      socket.emit('error', { message: 'Player name already taken' });
      return;
    }

    game.players.push({
      id: socket.id,
      name: playerName,
      cards: generateInitialCards(game.isFlipped),
      isHost: false,
      isReady: false,
    });

    socket.join(gameId);
    io.to(gameId).emit('player_joined', { gameState: game });
  });

  socket.on('toggle_ready', ({ gameId }) => {
    const game = games.get(gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === socket.id);
    if (!player) return;

    player.isReady = !player.isReady;
    io.to(gameId).emit('game_updated', { gameState: game });
  });

  socket.on('start_game', ({ gameId }) => {
    const game = games.get(gameId);
    if (!game) return;

    const player = game.players.find(p => p.id === socket.id);
    if (!player || !player.isHost) {
      socket.emit('error', { message: 'Only the host can start the game' });
      return;
    }

    if (game.players.length < game.minPlayers) {
      socket.emit('error', { message: `Need at least ${game.minPlayers} players to start` });
      return;
    }

    if (!game.players.every(p => p.isReady)) {
      socket.emit('error', { message: 'All players must be ready to start' });
      return;
    }

    game.status = "playing";
    io.to(gameId).emit('game_started', { gameState: game });
  });

  socket.on('play_card', ({ gameId, cardId }) => {
    const game = games.get(gameId);
    if (!game) return;

    const playerIndex = game.players.findIndex(p => p.id === socket.id);
    if (playerIndex === -1 || game.currentPlayer !== socket.id) return;

    const player = game.players[playerIndex];
    const cardIndex = player.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = player.cards[cardIndex];
    if (!isCardPlayable(card, game.currentCard)) return;

    // Handle special cards
    if (card.value === 'reverse' || card.value === 'reverse all') {
      game.direction *= -1;
    }

    // Remove card from player's hand
    player.cards.splice(cardIndex, 1);
    game.currentCard = card;

    // Move to next player
    const nextPlayerIndex = getNextPlayerIndex(playerIndex, game.players.length, game.direction);
    game.currentPlayer = game.players[nextPlayerIndex].id;

    // Handle +2, +4, +5 cards
    if (typeof card.value === 'string' && card.value.startsWith('+')) {
      const cardsToDraw = parseInt(card.value.substring(1));
      const nextPlayer = game.players[nextPlayerIndex];
      for (let i = 0; i < cardsToDraw; i++) {
        nextPlayer.cards.push(generateRandomCard(game.isFlipped));
      }
    }

    io.to(gameId).emit('game_updated', { gameState: game });
  });

  socket.on('draw_card', ({ gameId }) => {
    const game = games.get(gameId);
    if (!game || game.currentPlayer !== socket.id) return;

    const playerIndex = game.players.findIndex(p => p.id === socket.id);
    if (playerIndex === -1) return;

    const newCard = generateRandomCard(game.isFlipped);
    game.players[playerIndex].cards.push(newCard);

    socket.emit('card_drawn', { card: newCard });
    io.to(gameId).emit('game_updated', { gameState: game });
  });

  socket.on('flip_deck', ({ gameId }) => {
    const game = games.get(gameId);
    if (!game || game.gameMode !== 'flip') return;

    game.isFlipped = !game.isFlipped;
    game.currentCard = generateRandomCard(game.isFlipped);

    // Give each player new cards for the flipped side
    game.players.forEach(player => {
      player.cards = generateInitialCards(game.isFlipped);
    });

    io.to(gameId).emit('game_updated', { gameState: game });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    games.forEach((game, gameId) => {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);
        if (game.players.length === 0) {
          games.delete(gameId);
        } else {
          if (game.currentPlayer === socket.id) {
            const nextPlayerIndex = getNextPlayerIndex(playerIndex, game.players.length, game.direction);
            game.currentPlayer = game.players[nextPlayerIndex].id;
          }
          io.to(gameId).emit('player_left', { gameState: game });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
