import WebSocket from 'ws';
import { Player } from './game/player';

export class PlayerSocket {
  gamePlayer?: Player;
  socket: WebSocket;
  id: string;
  constructor(socket: WebSocket) {
    this.socket = socket;
    this.id = Date.now().toString(36);
  }
  setGamePlayer(player: Player) {
    this.gamePlayer = player;
  }
}
