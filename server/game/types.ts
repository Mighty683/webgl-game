import { Game } from './game';
import { Player } from './player';

export interface Tickable {
  onTick: TickCallback;
}

export type TickCallback = (game: Game) => void;

export interface ArenaField extends Point {
  sprite?: string;
  color?: string;
  type: string;
  canMoveHere: boolean;
  id?: string;
}

export function isPlayerEffectField(
  field: ArenaField
): field is PlayerEffectArenaField {
  return 'playerEffect' in field;
}

export interface PlayerEffectArenaField extends TickableArenaField {
  playerEffect: (player: Player) => void;
}

export function isTickableField(
  field: ArenaField
): field is TickableArenaField {
  return 'onTick' in field;
}

export interface TickableArenaField extends ArenaField, Tickable {}

export interface Point {
  x: number;
  y: number;
}

export type GameSpells = 'fire_wave' | 'ice_wave' | 'fire_field' | 'ice_field';
