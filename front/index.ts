import { Engine } from "./engine";

let gameCanvas = document.getElementById('game');
new Engine(gameCanvas as HTMLElement);