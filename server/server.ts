import WebSocket from 'ws';
import {
  CastSpell,
  CloseGame,
  JoinGame,
  MovePlayer,
  PlayerCommand,
  RefreshState,
  SERVER_COMMAND,
  SetPlayerId,
} from '../common/websocket_messages';
import { Game } from './game/game';
import { Player } from './game/player';
import { PlayerSocket } from './playerSocket';

export class Server {
  games: Map<string, Game>;
  gamesPlayers: Map<string, Map<string, Player>>;
  connectedPlayers: Map<string, PlayerSocket>;
  server: WebSocket.Server;
  constructor() {
    this.games = new Map();
    this.gamesPlayers = new Map();
    this.connectedPlayers = new Map();
    this.server = new WebSocket.Server({
      port: 8080,
      host: 'localhost',
    });
    this.server.on('connection', this.initPlayerSocket.bind(this));
  }
  initPlayerSocket(socket: WebSocket) {
    let player = new PlayerSocket(socket);
    this.connectedPlayers.set(player.id, player);
    socket.on('message', (message) => {
      let cmd = JSON.parse(message.toString()) as PlayerCommand;
      switch (cmd.cmd) {
        case 'create_game':
          let createdGame = this.createGame();
          createdGame.startGameTicks(async () => {
            let gamePlayersMap = this.gamesPlayers.get(createdGame.id);
            if (gamePlayersMap) {
              Array.from(gamePlayersMap.keys()).forEach((playerId) => {
                let playerSocket = this.connectedPlayers.get(playerId);
                playerSocket &&
                  this.refreshPlayerState(createdGame, playerSocket);
              });
            }
          });
          this.joinPlayerToGame(createdGame, player);

          break;
        case 'join_game':
          let game = this.games.get((cmd as JoinGame).id);
          if (game) {
            this.joinPlayerToGame(game, player);
          } else {
            let closeGame: CloseGame = {
              cmd: 'close_game',
            };
            socket.send(JSON.stringify(closeGame));
          }
          break;
      }
    });
  }
  createGame() {
    let game = new Game();
    this.games.set(game.id, game);
    this.gamesPlayers.set(game.id, new Map());
    return game;
  }

  joinPlayerToGame(game: Game, playerSocket: PlayerSocket) {
    let gamePlayer = game.addPlayer();
    this.gamesPlayers.get(game.id)?.set(playerSocket.id, gamePlayer);
    let messageCallback = this.getPlayerSocketMessageCallback(game, gamePlayer);
    let closeCallback = this.getPlayerSocketCloseCallback(
      game,
      playerSocket,
      gamePlayer
    );
    playerSocket.socket.on('message', messageCallback);
    playerSocket.socket.on('close', closeCallback);

    let initCommand: SetPlayerId = {
      cmd: 'set_player_id',
      id: playerSocket.id,
    };
    playerSocket.socket.send(JSON.stringify(initCommand));
  }

  getPlayerSocketMessageCallback(game: Game, gamePlayer: Player) {
    return (message: WebSocket.Data) => {
      let cmd = JSON.parse(message.toString()) as PlayerCommand;
      switch (cmd.cmd) {
        case 'move_player':
          game.movePlayer(gamePlayer, cmd.direction);
          break;
        case 'cast_spell':
          game.castSpell(gamePlayer, cmd.spell);
          break;
      }
    };
  }

  getPlayerSocketCloseCallback(
    game: Game,
    player: PlayerSocket,
    gamePlayer: Player
  ) {
    return () => {
      game.removePlayer(gamePlayer);
      this.gamesPlayers.get(game.id)?.delete(player.id);
      this.connectedPlayers.delete(player.id);
    };
  }

  refreshPlayerState(game: Game, playerSocket: PlayerSocket) {
    let player = this.gamesPlayers.get(game.id)?.get(playerSocket.id);
    let cmd: RefreshState = {
      cmd: 'refresh_state',
      id: game.id,
      elements: game.getFieldsList(),
      players: Array.from(game.getPlayerList()).map(
        ({ x, y, sprite, color }) => ({
          x,
          y,
          sprite,
          color,
        })
      ),
      x: player?.x || 0,
      y: player?.y || 0,
      hp: player?.hp || 0,
      score: this.gamesPlayers.get(game.id)?.get(playerSocket.id)?.score || 0,
    };
    playerSocket.socket.send(JSON.stringify(cmd));
  }
}
