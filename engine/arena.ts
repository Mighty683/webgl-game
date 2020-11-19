import { ArenaField } from "./arena_elements";
import { ARENA } from "./arena_model";

export const ARENA_WIDTH = 32;
export const ARENA_HEIGHT = 16;

export class Arena {
    rows: Array<Array<ArenaField>>
    constructor() {
        this.rows = ARENA;
    }
}