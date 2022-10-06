import { Direction } from '../../common/types';
import { ArenaElement, Tickable } from './types';

export class Player implements Tickable, ArenaElement {
  static isPlayer(unknown: unknown): unknown is Player {
    return (unknown as any).type === 'player';
  }
  public static defaultHp = 100;

  x: number;
  y: number;
  hp: number;
  moved: boolean;
  direction: Direction;
  type = 'player';
  active: boolean;
  sprite?: string | undefined;
  color?: string | undefined;
  canMoveHere = false;
  score: number;

  constructor(x: number, y: number) {
    this.color = '#F5CBA7';
    this.x = x;
    this.y = y;
    this.hp = Player.defaultHp;
    this.direction = 'right';
    this.moved = false;
    this.active = true;
    this.score = 0;
  }
  move(x: number, y: number) {
    if (x != this.x) {
      this.direction = x > this.x ? 'right' : 'left';
    }
    if (y != this.y) {
      this.direction = y > this.y ? 'up' : 'down';
    }
    this.x = x;
    this.y = y;
    this.moved = true;
  }
  refreshMove() {
    this.moved = false;
  }
  onTick() {
    this.refreshMove();
  }
  reduceHp(damage: number) {
    this.hp = this.hp - damage;
    if (this.hp <= 0) {
      this.active = false;
    }
  }
  addKill() {
    this.score++;
  }
}
