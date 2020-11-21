import { Arena } from "../common/arena";
import { INIT_GAME, SERVER_COMMAND } from "../common/websocket_messages";
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