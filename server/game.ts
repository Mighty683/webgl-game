import { Arena } from "../common/arena";
import { ArenaField, Player } from "../common/arena_elements";
import { Direction } from "../common/types";

function generateNewArena(): Arena {
    return new Arena(new Array(16)
    .fill(null)
    .map(() => new Array(32)
        .fill(null)
        .map(() => new ArenaField('air'))
    ));
}

export class GameServer {
    arena: Arena
    players: Set<Player>
    constructor () {
        this.arena = generateNewArena();
        this.players = new Set();
    }
    movePlayer(player: Player, direction: Direction) {
        if (!player.moved) {
            switch(direction) {
                case 'up':
                    if (this.arena.rows[player.y - 1][player.x]?.canMoveHere()) {
                        player.move(player.x, player.y - 1);
                    }
                    break;
                case 'down':
                    if (this.arena.rows[player.y + 1][player.x]?.canMoveHere()) {
                        player.move(player.x, player.y + 1);
                    }
                    break;
                case 'right':
                    if (this.arena.rows[player.y][player.x + 1]?.canMoveHere()) {
                        player.move(player.x + 1, player.y);
                    }
                    break;
                case 'left':
                    if (this.arena.rows[player.y][player.x - 1]?.canMoveHere()) {
                        player.move(player.x - 1, player.y);
                    }
                    break;
            }
        }
    }
    placePlayer(x: number, y: number) {
        // TODO: Generate hash instead of date.
        let player = new Player(x,y, Date.now().toString())
        this.players.add(player);
        return player;
    }
    generateFullArena() {
        let arena = generateNewArena();
        this.players.forEach(player => {
            console.log(player.x, player.y);
            arena.rows[player.y][player.x].elements.push(player);
        });
        return arena;
    }

    unlockPlayers() {
        this.players.forEach(player => player.refreshMove());
    }
}