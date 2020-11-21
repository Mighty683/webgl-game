import { Arena } from "../common/arena";
import { Direction } from "../common/types";
import { INIT_GAME, MOVE_PLAYER, SERVER_COMMAND } from "../common/websocket_messages";
import { Renderer } from "./renderer";
const HEIGHT = 600;
const WIDTH = 1200;
const WS_HOST = 'localhost:8080';

export class Engine {
    renderer: Renderer
    arena?: Arena
    ws: WebSocket
    constructor (rootEl: HTMLElement) {
        let canvasElement = document.createElement('canvas');
        rootEl.appendChild(canvasElement);
        this.renderer = new Renderer(canvasElement, HEIGHT, WIDTH);
        this.ws = new WebSocket(`ws://${WS_HOST}`);
        this.ws.addEventListener('open', () => {
            this.initGame();
            this.ws.addEventListener('message', (msg) => {
                let cmd = JSON.parse(msg.data) as SERVER_COMMAND;
                switch (cmd.cmd) {
                    case 'refresh_state':
                        this.refreshArena(cmd.arena);
                }
            });
        });
        document.addEventListener('keydown', this.keyboardListener.bind(this));
    }

    keyboardListener (event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowDown':
                return this.movePlayer('down');
            case 'ArrowUp':
                return this.movePlayer('up');
            case 'ArrowLeft':
                return this.movePlayer('left');
            case 'ArrowRight':
                return this.movePlayer('right');
        }
    }

    movePlayer(direction: Direction) {
        let cmd: MOVE_PLAYER = {
            cmd: 'move_player',
            direction,
        }
        this.ws.send(JSON.stringify(cmd));
    }

    refreshArena(arena: Arena) {
        this.renderer.renderArena(arena);
    }

    initGame() {
        let cmd: INIT_GAME = {
            cmd: 'init_game'
        };
        this.ws.send(JSON.stringify(cmd))
    }
}