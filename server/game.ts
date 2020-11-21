import { Arena } from "../common/arena";
import { ArenaElement, ArenaField, Player } from "../common/arena_elements";
import { Direction } from "../common/types";
import { getWaveElements } from "./spells/wave";

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
    elements: Set<ArenaElement>
    constructor () {
        this.arena = generateNewArena();
        this.players = new Set();
        this.elements = new Set();
    }
    movePlayer(player: Player, direction: Direction) {
        if (player.active && !player.moved) {
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
    castSpell(player: Player, spell: string) {
        if (player.active) {
            if (spell === 'fire_wave') {
                let wave = getWaveElements(player.x, player.y, player.direction, 'fire');
                wave.forEach(el => this.elements.add(el));
            }
            if (spell === 'ice_wave') {
                let wave = getWaveElements(player.x, player.y, player.direction, 'ice');
                wave.forEach(el => this.elements.add(el));
            }
        }
    }
    removePlayer(player: Player) {
        this.players.delete(player);
    }
    gameTick() {
        let arena = generateNewArena();
        this.players.forEach(player => {
            arena.rows[player.y][player.x].elements.push(player);
        });
        this.elements.forEach(el => {
            arena.rows[el.y][el.x].elements.push(el);
            let fieldPlayer = arena.rows[el.y][el.x].elements.find(el => el.type === 'player') as Player;
            if (fieldPlayer) {
                el.playerEffect && el.playerEffect(fieldPlayer);
            }
        });
        this.elements.forEach(element => {
            element.onTick && element.onTick();
            if (!element.active) {
                this.elements.delete(element);
            }
        });
        return arena;
    }

    unlockPlayers() {
        this.players.forEach(player => player.refreshMove());
    }
}