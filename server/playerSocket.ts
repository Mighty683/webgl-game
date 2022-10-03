import WebSocket from 'ws';
import { Player } from './game/player';

export class PlayerSocket {
  socket: WebSocket;
  id: string;
  constructor(socket: WebSocket) {
    this.socket = socket;
    this.id = Date.now().toString(36);
  }
}
