import { Renderer } from "./renderer";
const HEIGHT = 300;
const WIDTH = 600;
export class Engine {
    renderer: Renderer
    constructor (rootEl: HTMLElement) {
        let canvasElement = document.createElement('canvas');
        rootEl.appendChild(canvasElement);

        this.renderer = new Renderer(canvasElement, HEIGHT, WIDTH);
        this.renderer.renderBackground();
    }
}