import { Arena } from "./arena";
import { Direction } from "./types";


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

export type InitGame = {
  cmd: 'init_game'
}

export type PlayerCommand = MovePlayer
  | InitGame
  | CastSpell;

/**
 * Server commands
 */
export type REFRESH_STATE = {
  cmd: 'refresh_state'
  arena: Arena
}

export type SERVER_COMMAND = REFRESH_STATE;