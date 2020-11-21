import WebSocket from "ws";
import { MOVE_PLAYER, PLAYER_COMMAND, SERVER_COMMAND } from "../common/websocket_messages";
import { GameServer } from "./game";

export class Server {
    game: GameServer
    server: WebSocket.Server
    interval?: NodeJS.Timeout
    constructor() {
        this.game = new GameServer();
        this.server = new WebSocket.Server({
            port: 8080,
            host: 'localhost'
        });
        this.server.on('connection', (socket) => {
            let player = this.game.placePlayer(0,7);
            socket.on('message', (message) => {
                let cmd = JSON.parse(message.toString()) as PLAYER_COMMAND;
                switch(cmd.cmd) {
                    case 'init_game':
                        this.initGame();
                    case 'move_player':
                        this.game.movePlayer(player, (cmd as MOVE_PLAYER).direction);
                };
            });
        });
    }

    initGame() {
        this.interval = setInterval(() => {
            this.broadcast({
                cmd: 'refresh_state',
                arena: this.game.generateFullArena()
            });
            this.game.unlockPlayers();
        }, 500);
    }

    broadcast(message: SERVER_COMMAND) {
        this.server.clients.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    }
}