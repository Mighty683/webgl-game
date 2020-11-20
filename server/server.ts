import WebSocket from "ws";
import { GameServer } from "./game";

export class Server {
    game: GameServer
    server: WebSocket.Server
    constructor() {
        this.game = new GameServer();
        this.server = new WebSocket.Server({
            port: 8080
        });
        this.server.on('connection', (socket) => {
            if (!this.game.players.size) {
                this.game.placePlayer(0,7);
            }
            socket.on('message', (message) => {
                console.log(message);
            });
        });
    }
}