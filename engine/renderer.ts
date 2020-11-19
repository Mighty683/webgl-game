export class Renderer {
    canvas: HTMLCanvasElement
    canvasContext: WebGL2RenderingContext
    height: number
    width: number
    constructor(canvas: HTMLCanvasElement, height: number, width: number) {
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvasContext = canvas.getContext('webgl2')
        this.canvasContext.viewport(0, 0, height, width);
    }
    renderBackground() {
        this.canvasContext.clearColor(0, 0, 0, 1);
        this.canvasContext.clear(this.canvasContext.COLOR_BUFFER_BIT);
    }
}