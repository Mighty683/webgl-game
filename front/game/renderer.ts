import { CenterCoordinates } from '../../common/types';
import { PlayerRefreshData } from '../../common/websocket_messages';
import { ArenaElement } from '../../server/game/arenaElement';

export type GameState = {
  hp: number;
  id: string;
  playerId: string;
  score: number;
};
export class Renderer {
  canvas: HTMLCanvasElement;
  c: CanvasRenderingContext2D;
  height: number;
  width: number;
  constructor(canvas: HTMLCanvasElement, height: number, width: number) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.c = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.fillBackground();
  }
  fillBackground(state?: GameState) {
    this.c.beginPath();
    this.c.rect(0, 0, this.width, this.height);
    this.c.fillStyle = '#000000';
    this.c.fill();
    if (state) {
      this.c.fillStyle = '#FFFFFF';
      this.c.fillText(`GAME ID: ${state.id}`, 10, 20);
      this.c.fillText(`PLAYER ID: ${state.playerId}`, 10, 40);
      this.c.fillText(`HP: ${state.hp}`, 10, 60);
      this.c.fillText(`SCORE: ${state.score}`, 10, 80);
    }
    this.c.closePath();
  }
  getFieldRect(
    center: CenterCoordinates,
    x: number,
    y: number
  ): [number, number, number, number] {
    let fieldSize = this.width / 30;
    let centerX = this.width / 2;
    let centerY = this.height / 2;
    let x1 = centerX + (x - center.x) * fieldSize;
    let y1 = centerY - (y - center.y) * fieldSize;
    return [x1, y1, fieldSize, fieldSize];
  }
  renderArena(
    center: CenterCoordinates,
    elements: Array<ArenaElement>,
    players: Array<PlayerRefreshData>,
    state?: GameState
  ) {
    this.fillBackground(state);
    elements.forEach((el) => {
      if (el.color) {
        this.c.beginPath();
        this.c.fillStyle = el.color;
        this.c.fillRect(...this.getFieldRect(center, el.x, el.y));
        this.c.closePath();
      }
    });
    players.forEach((player) => {
      if (player.color) {
        this.c.beginPath();
        this.c.fillStyle = player.color;
        this.c.fillRect(...this.getFieldRect(center, player.x, player.y));
        this.c.closePath();
      }
    });
  }
}
