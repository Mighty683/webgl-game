import { ArenaElement } from "../common/arena_elements";
import { Direction } from "../common/types";
import { CastSpell, MovePlayer, RefreshState, SERVER_COMMAND } from "../common/websocket_messages";
import { Renderer } from "./renderer";
const HEIGHT = 600;
const WIDTH = 1200;
const WS_HOST = 'localhost:8080';

export class Engine {
    renderer: Renderer
    ws: WebSocket
    playerId?: string
    constructor (rootEl: HTMLElement) {
        let canvasElement = document.createElement('canvas');
        rootEl.appendChild(canvasElement);
        this.renderer = new Renderer(canvasElement, HEIGHT, WIDTH);
        this.ws = new WebSocket(`ws://${WS_HOST}`);
        this.ws.addEventListener('open', () => {
            this.ws.addEventListener('message', (msg) => {
                let cmd = JSON.parse(msg.data) as SERVER_COMMAND;
                switch (cmd.cmd) {
                    case 'set_player_id':
                        this.setPlayerId(cmd.id);
                    break;
                    case 'refresh_state':
                        this.refreshArena((cmd as RefreshState).elements);
                    break;
                }
            });
        });
    }

    setPlayerId(id: string) {
        this.playerId = id;
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
            case 'a':
                return this.castSpell('fire_wave');
            case 's':
                return this.castSpell('ice_wave');
            case 'd':
                return this.castSpell('fire_field');
            case 'f':
                return this.castSpell('ice_field');
        }
    }

    castSpell(spell: string) {
        let cmd: CastSpell = {
            cmd: 'cast_spell',
            spell,
        }
        this.ws.send(JSON.stringify(cmd));
    }

    movePlayer(direction: Direction) {
        let cmd: MovePlayer = {
            cmd: 'move_player',
            direction,
        }
        this.ws.send(JSON.stringify(cmd));
    }

    refreshArena(elements: Array<ArenaElement>) {
        if (this.playerId) {
            let player = elements.find(el => el.id === this.playerId)
            if (player) {
                this.renderer.renderArena({ x: player.x, y: player.y }, elements);
            }
        }
    }
}