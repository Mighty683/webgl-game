import { ArenaElement, Player } from "./arena_elements";
import { CenterCoordinates, Direction } from "./types";


/**
 * Player commands
 */
export type MovePlayer = {
  cmd: 'move_player'
  direction: Direction
}


export type CastSpell = {
  cmd: 'cast_spell'
  spell: string
}

export type PlayerCommand = MovePlayer
  | CastSpell;

/**
 * Server commands
 */
export type RefreshState = {
  cmd: 'refresh_state'
  elements: Array<ArenaElement>
}

export type SetPlayerId = {
  cmd: 'set_player_id'
  id: string
}

export type SERVER_COMMAND = RefreshState | SetPlayerId;