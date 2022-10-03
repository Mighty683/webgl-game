import { Player } from '../server/game/player';
import { ArenaElement } from '../server/game/types';
import { Direction } from './types';

/**
 * Player commands
 */
export type MovePlayer = {
  cmd: 'move_player';
  direction: Direction;
};

export type CastSpell = {
  cmd: 'cast_spell';
  spell: string;
};

export type CreateGame = {
  cmd: 'create_game';
};

export type JoinGame = {
  cmd: 'join_game';
  id: string;
};

export type PlayerCommand = MovePlayer | CastSpell | JoinGame | CreateGame;

/**
 * Server commands
 */
export type RefreshState = {
  cmd: 'refresh_state';
  id: string;
  x: number;
  y: number;
  hp: number;
  elements: Array<ArenaElement>;
  players: Array<PlayerRefreshData>;
  score: number;
};

export type SetPlayerId = {
  cmd: 'set_player_id';
  id: string;
};

export type CloseGame = {
  cmd: 'close_game';
};

export type SERVER_COMMAND = RefreshState | SetPlayerId | CloseGame;

export type PlayerRefreshData = {
  x: number;
  y: number;
  sprite?: string | undefined;
  color?: string | undefined;
};
