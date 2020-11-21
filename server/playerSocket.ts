import WebSocket from "ws";
import { Player } from "../common/arena_elements";

export class PlayerSocket {
    player?: Player
    socket: WebSocket
    constructor (socket: WebSocket) {
        this.socket = socket;
    }
    setPlayer(player: Player) {
        this.player = player;
    }
}
