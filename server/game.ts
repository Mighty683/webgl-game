import { Arena } from "../common/arena";
import { ArenaField, Player } from "../common/arena_elements";

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
    movePlayer(player: Player, direction: 'up' | 'left' | 'down'| 'right') {
        if (!player.moved) {
            switch(direction) {
                case 'up':
                    if (this.arena.rows[player.y - 1][player.x]?.canMoveHere()) {
                        player.move(player.y - 1, player.x);
                    }
                    break;
                case 'down':
                    if (this.arena.rows[player.y + 1][player.x]?.canMoveHere()) {
                        player.move(player.y + 1, player.x);
                    }
                    break;
                case 'right':
                    if (this.arena.rows[player.y][player.x + 1]?.canMoveHere()) {
                        player.move(player.y, player.x + 1);
                    }
                    break;
                case 'left':
                    if (this.arena.rows[player.y][player.x - 1]?.canMoveHere()) {
                        player.move(player.y, player.x - 1);
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
            arena.rows[player.y][player.x].elements.push(player);
        });
        return arena;
    }
}