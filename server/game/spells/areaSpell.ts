import { ArenaElement } from '../arenaElement';
import { Player } from '../player';

export class AreaEffectElement implements ArenaElement {
  x: number;
  y: number;
  duration: number;
  damage: number;
  color: string;
  type = 'area_spell';
  active: boolean;
  canMoveHere = true;
  caster: Player;
  constructor(
    x: number,
    y: number,
    duration: number,
    damage: number,
    color: string,
    caster: Player
  ) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.damage = damage;
    this.active = true;
    this.caster = caster;
  }
  onTick() {
    this.duration = this.duration - 1;
    if (this.duration <= 0) {
      this.active = false;
    }
  }
  playerEffect(player: Player) {
    if (player.active) {
      player.reduceHp(this.damage);
      if (player.hp <= 0) {
        this.caster.addKill();
      }
    }
  }
}
