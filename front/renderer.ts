import { Arena, ARENA_HEIGHT, ARENA_WIDTH } from "../common/arena";
import { ArenaField } from "../common/arena_elements";

export class Renderer {
    canvas: HTMLCanvasElement
    c: CanvasRenderingContext2D
    height: number
    width: number
    get fieldSize() { return Math.ceil(this.width / ARENA_WIDTH); }
    constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.c = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.fillBackground('#000000')
    }
    fillBackground(color: string) {
        this.c.beginPath();
        this.c.rect(0, 0, this.width, this.height);
        this.c.fillStyle = color;
        this.c.fill();
        this.c.closePath();
    }

    consoleArena(arena: Arena) {
        console.log(arena?.rows.map(row => {
            return row.map(el => {
                return el.elements.find(el => el.type === 'player') ? 'X' : ' '
            }).join('');
        }).join('\n'));
    }
    renderArena(arena: Arena) {
        arena.rows.forEach((row, rowIndex) => {
            row.forEach((field, fieldIndex) => {
                this.renderField(rowIndex, fieldIndex, field);
            })
        });
    }
    getFieldBackground(field: ArenaField): string {
        switch(field.type) {
            case 'air':
                return '#0E7B19';
            case 'solid':
            default:
                return '#363946'
        }
    }
    getFieldRect(x: number, y: number): [number, number, number, number] {
        let y1 = y * this.fieldSize;
        let x1 = x * this.fieldSize;
        return [y1, x1, this.fieldSize, this.fieldSize];
    }
    renderField(x: number, y: number, field: ArenaField) {
        this.c.beginPath();
        this.c.fillStyle = this.getFieldBackground(field);
        this.c.fillRect(...this.getFieldRect(x, y));
        this.c.closePath();
        if (field.elements?.length > 0) {
            field.elements.forEach((element) => {
                if (element.sprite) {
                    // TODO: Drawing sprites
                }
                if (element.color) {
                    this.c.beginPath();
                    this.c.fillStyle = element.color;
                    this.c.fillRect(...this.getFieldRect(x, y));
                    this.c.closePath();
                }
            })
        }
    }
}