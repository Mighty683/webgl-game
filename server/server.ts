import WebSocket from "ws";
import { CastSpell, MovePlayer, PlayerCommand, SERVER_COMMAND } from "../common/websocket_messages";
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
                let cmd = JSON.parse(message.toString()) as PlayerCommand;
                switch(cmd.cmd) {
                    case 'init_game':
                        this.initGame();
                    case 'move_player':
                        this.game.movePlayer(player, (cmd as MovePlayer).direction);
                    case 'cast_spell':
                        this.game.castSpell(player, (cmd as CastSpell).spell);
                };
            });
            socket.on('close', () => {
                this.game.removePlayer(player);
            })
        });
    }

    initGame() {
        this.interval = setInterval(() => {
            this.broadcast({
                cmd: 'refresh_state',
                arena: this.game.gameTick()
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