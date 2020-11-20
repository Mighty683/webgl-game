import WebSocket from "ws";
import { Arena } from "../common/arena";
import { Renderer } from "./renderer";
const HEIGHT = 600;
const WIDTH = 1200;


export class Engine {
    renderer: Renderer
    arena?: Arena
    ws: WebSocket
    constructor (rootEl: HTMLElement) {
        let canvasElement = document.createElement('canvas');
        rootEl.appendChild(canvasElement);
        this.renderer = new Renderer(canvasElement, HEIGHT, WIDTH);
        this.ws = new WebSocket(`ws://${document.location.host}/ws`)
        this.ws.send('hello world');
        this.ws.on('message', (message) => {
            let data = JSON.parse(message);
        })
    }
}