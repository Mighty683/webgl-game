import WebSocket from "ws";
import { CastSpell, MovePlayer, PlayerCommand, RefreshState, SERVER_COMMAND, SetPlayerId } from "../common/websocket_messages";
import { Game } from "./game";

export class Server {
    game: Game
    server: WebSocket.Server
    interval?: NodeJS.Timeout
    constructor() {
        this.game = new Game();
        this.server = new WebSocket.Server({
            port: 8080,
            host: 'localhost'
        });
        this.server.on('connection', this.initPlayerSocket.bind(this));
        this.initGame();
    }
    initPlayerSocket(socket: WebSocket) {
        let player = this.game.placePlayer(0,0);
        let initCommand: SetPlayerId = {
            cmd: 'set_player_id',
            id: player.id
        }
        socket.send(JSON.stringify(initCommand));
        socket.on('message', (message) => {
            let cmd = JSON.parse(message.toString()) as PlayerCommand;
            switch(cmd.cmd) {
                case 'move_player':
                    this.game.movePlayer(player, (cmd as MovePlayer).direction);
                case 'cast_spell':
                    this.game.castSpell(player, (cmd as CastSpell).spell);
            };
        });
        socket.on('close', () => {
            this.game.removePlayer(player);
        });
    }
    initGame() {
        this.interval = setInterval(() => {
            this.game.gameTick();
            this.server.clients.forEach((client) => {
                let cmd: RefreshState = {
                    cmd: 'refresh_state',
                    elements: this.game.elements
                }
                client.send(JSON.stringify(cmd));
            });
        }, 500);
    }
}