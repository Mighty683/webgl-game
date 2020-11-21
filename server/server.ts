import WebSocket from "ws";
import { CastSpell, CloseGame, JoinGame, MovePlayer, PlayerCommand, RefreshState, SERVER_COMMAND, SetPlayerId } from "../common/websocket_messages";
import { Game } from "./game";
import { PlayerSocket } from "./playerSocket";

export class Server {
    games: Array<Game>
    players: Array<PlayerSocket>
    server: WebSocket.Server
    constructor() {
        this.games = new Array();
        this.players = new Array();
        this.server = new WebSocket.Server({
            port: 8080,
            host: 'localhost'
        });
        this.server.on('connection', this.initPlayerSocket.bind(this));
    }
    initPlayerSocket(socket: WebSocket) {
        let player = new PlayerSocket(socket);
        this.players.push();
        socket.on('message', (message) => {
            let cmd = JSON.parse(message.toString()) as PlayerCommand;
            switch(cmd.cmd) {
                case 'create_game':
                    this.createGame(player).initGame();
                    break;
                case 'join_game':
                    let game = this.games.find(g => g.id === (cmd as JoinGame).id)
                    if (game) {
                        this.joinPlayerToGame(game, player);
                        game.initGame();
                    } else {
                        let closeGame: CloseGame = {
                            cmd: 'close_game'
                        }
                        socket.send(JSON.stringify(closeGame));
                    }
                    break;
            }
        })
    }
    createGame(player: PlayerSocket) {
        let game =new Game();
        this.games.push(game);
        this.joinPlayerToGame(game, player);
        return game;
    }
    joinPlayerToGame(game: Game, player: PlayerSocket) {
        let gamePlayer = game.placePlayer(0,0, player);
        player.setPlayer(gamePlayer);
        let initCommand: SetPlayerId = {
            cmd: 'set_player_id',
            id: gamePlayer.id
        }
        player.socket.send(JSON.stringify(initCommand));
        player.socket.on('message', (message) => {
            let cmd = JSON.parse(message.toString()) as PlayerCommand;
            switch(cmd.cmd) {
                case 'move_player':
                    game.movePlayer(gamePlayer, (cmd as MovePlayer).direction);
                    break;
                case 'cast_spell':
                    game.castSpell(gamePlayer, (cmd as CastSpell).spell);
                    break;
            };
        });
        player.socket.on('close', () => {
            game.removePlayer(player);
            this.players.splice(this.players.indexOf(player), 1);
        });
    }
}