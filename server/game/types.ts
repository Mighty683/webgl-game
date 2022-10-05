import { Player } from './player';
export interface Tickable {
  onTick: () => void;
}

export interface ArenaElement extends Point {
  sprite?: string;
  color?: string;
  type: string;
  active: boolean;
  canMoveHere: boolean;
  id?: string;
}

export interface SpellArenaElement extends TickableArenaElement {
  playerEffect: (player: Player) => void;
}

export interface TickableArenaElement extends ArenaElement, Tickable {}

export interface Point {
  x: number;
  y: number;
}

export type GameSpells = 'fire_wave' | 'ice_wave' | 'fire_field' | 'ice_field';
