import { Direction } from '../common/types';
import { ArenaElement } from './arenaElement';

export class Player implements ArenaElement {
  x: number;
  y: number;
  id: string;
  hp: number;
  moved: boolean;
  direction: Direction;
  type = 'player';
  active: boolean;
  sprite?: string | undefined;
  color?: string | undefined;
  canMoveHere = false;
  constructor(x: number, y: number, id: string) {
    this.color = '#F5CBA7';
    this.x = x;
    this.y = y;
    this.id = id;
    this.hp = 100;
    this.direction = 'right';
    this.moved = false;
    this.active = true;
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
}
