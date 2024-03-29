import { Game } from '../game';
import { Player } from '../player';
import { PlayerEffectArenaField } from '../types';

export class AreaEffectElement implements PlayerEffectArenaField {
  x: number;
  y: number;
  duration: number;
  damage: number;
  color: string;
  type = 'area_spell';
  canMoveHere = true;
  active = true;
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
    this.caster = caster;
    this.onTick = this.onTick.bind(this);
  }
  onTick(game: Game) {
    if (!this.active) {
      game.removeField(this);
      game.removeTickable(this);
    } else {
      this.duration--;
      if (this.duration <= 0) {
        this.active = false;
      }
    }
  }
  playerEffect(player: Player) {
    if (player.active && this.active) {
      player.reduceHp(this.damage);
      if (player.hp <= 0) {
        this.caster.addKill();
      }
    }
  }
}
