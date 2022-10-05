import { Player } from './player';
export interface Tickable {
  onTick?: () => void;
}

export interface ArenaElement extends Tickable, Point {
  sprite?: string;
  color?: string;
  type: string;
  active: boolean;
  canMoveHere: boolean;
  id?: string;
  playerEffect?: (player: Player) => void;
}

export interface Point {
  x: number;
  y: number;
}

export type GameSpells = 'fire_wave' | 'ice_wave' | 'fire_field' | 'ice_field';
