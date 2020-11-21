import { ArenaElement, Player } from "../common/arena_elements";
import { CenterCoordinates } from "../common/types";

export class Renderer {
    canvas: HTMLCanvasElement
    c: CanvasRenderingContext2D
    height: number
    width: number
    constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.c = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.fillBackground()
    }
    fillBackground() {
        this.c.beginPath();
        this.c.rect(0, 0, this.width, this.height);
        this.c.fillStyle = '#000000';
        this.c.fill();
        this.c.closePath();
    }
    getFieldRect(center: CenterCoordinates,x: number, y: number): [number, number, number, number] {
        let fieldSize = this.width / 30;
        let centerX = this.width / 2;
        let centerY = this.height / 2;
        let x1 = centerX + ((x - center.x) * fieldSize);
        let y1 = centerY - ((y - center.y) * fieldSize);
        return [x1, y1, fieldSize, fieldSize];
    }
    renderArena(center: CenterCoordinates, elements: Array<ArenaElement>) {
        this.fillBackground();
        elements.forEach(el => {
            if (el.color) {
                this.c.beginPath();
                this.c.fillStyle = el.color;
                this.c.fillRect(...this.getFieldRect(center, el.x, el.y));
                this.c.closePath();
            }
        });
    }
}