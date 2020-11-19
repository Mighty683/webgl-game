import { Arena } from "./arena";
import { Renderer } from "./renderer";
const HEIGHT = 600;
const WIDTH = 1200;

export class Engine {
    renderer: Renderer
    arena: Arena
    constructor (rootEl: HTMLElement) {
        let canvasElement = document.createElement('canvas');
        rootEl.appendChild(canvasElement);
        this.arena = new Arena();
        this.renderer = new Renderer(canvasElement, HEIGHT, WIDTH);
        this.renderer.renderArena(this.arena);
    }
}
