import { Player } from './player';
export interface Tickable {
  onTick?: () => void;
}

export interface ArenaElement extends Tickable {
  sprite?: string;
  color?: string;
  type: String;
  active: boolean;
  canMoveHere: boolean;
  hp?: number;
  x: number;
  y: number;
  id?: string;
  playerEffect?: (player: Player) => void;
}
