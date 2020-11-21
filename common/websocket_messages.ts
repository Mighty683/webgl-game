import { Arena } from "./arena";
import { Direction } from "./types";


/**
 * Player commands
 */
export type MOVE_PLAYER = {
  cmd: 'move_player'
  direction: Direction
}

export type INIT_GAME = {
  cmd: 'init_game'
}

export type PLAYER_COMMAND = MOVE_PLAYER | INIT_GAME;

/**
 * Server commands
 */
export type REFRESH_STATE = {
  cmd: 'refresh_state'
  arena: Arena
}

export type SERVER_COMMAND = REFRESH_STATE;