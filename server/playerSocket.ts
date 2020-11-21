import WebSocket from "ws";
import { Player } from "./player";

export class PlayerSocket {
    gamePlayer?: Player
    socket: WebSocket
    id: string
    score: number
    constructor (socket: WebSocket) {
        this.socket = socket;
        this.score = 0;
        this.id = Date.now().toString(36)
    }
    addKill() {
        this.score++;
    }
    setGamePlayer(player: Player) {
        this.gamePlayer = player;
    }
}
