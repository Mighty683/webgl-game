import { ArenaField } from "./arena_elements";

export const ARENA_WIDTH = 32;
export const ARENA_HEIGHT = 16;

export class Arena {
    rows: Array<Array<ArenaField>>
    constructor(rows: Array<Array<ArenaField>>) {
        this.rows = rows;
    }
}