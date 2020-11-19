import { Arena } from "./arena";
import { Player } from "./arena_elements";
import { Renderer } from "./renderer";
const HEIGHT = 600;
const WIDTH = 1200;
const PLAYER: Player = {
    color: '#D33F49',
}

export class Engine {
    renderer: Renderer
    arena: Arena
    playerX: number
    playerY: number
    constructor (rootEl: HTMLElement) {
        let canvasElement = document.createElement('canvas');
        rootEl.appendChild(canvasElement);
        this.arena = new Arena();
        this.renderer = new Renderer(canvasElement, HEIGHT, WIDTH);
        this.playerX = 0;
        this.playerY = 7;
        this.placePlayer(this.playerY, this.playerX);
        this.renderer.renderArena(this.arena);
        document.addEventListener('keydown', this.keyboardListener.bind(this))
    }
    placePlayer (y: number, x: number) {
        this.playerY = y;
        this.playerX = x;
        this.arena.rows[y][x].elements.add(PLAYER)
    }
    removePlayer(y, x) {
        let field = this.arena.rows[y][x];
        field.elements.delete(PLAYER);
    }
    keyboardListener(event: KeyboardEvent) {
        if (event.key === 'ArrowUp') {
           return this.movePlayer('up');
        }
        if (event.key === 'ArrowDown') {
            return this.movePlayer('down');
        }
        if (event.key === 'ArrowLeft') {
            return this.movePlayer('left');
        }
        if (event.key === 'ArrowRight') {
            return this.movePlayer('right');
        }
    }
    movePlayer(direction: 'up' | 'left' | 'down'| 'right') {
        switch(direction) {
            case 'up':
                if (this.arena.rows[this.playerY - 1][this.playerX]?.type === 'air') {
                    this.removePlayer(this.playerY, this.playerX);
                    this.placePlayer(this.playerY - 1, this.playerX);
                }
                break;
            case 'down':
                if (this.arena.rows[this.playerY + 1][this.playerX]?.type === 'air') {
                    this.removePlayer(this.playerY, this.playerX);
                    this.placePlayer(this.playerY + 1, this.playerX);
                }
                break;
            case 'right':
                if (this.arena.rows[this.playerY][this.playerX + 1]?.type === 'air') {
                    this.removePlayer(this.playerY, this.playerX);
                    this.placePlayer(this.playerY, this.playerX + 1);
                }
                break;
            case 'left':
                if (this.arena.rows[this.playerY][this.playerX - 1]?.type === 'air') {
                    this.removePlayer(this.playerY, this.playerX);
                    this.placePlayer(this.playerY, this.playerX - 1);
                }
                break;
        }
        this.renderer.renderArena(this.arena);
    }
}
