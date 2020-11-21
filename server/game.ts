import { ArenaElement, Player } from "../common/arena_elements";
import { Direction } from "../common/types";
import { getWaveElements } from "./spells/wave";

export class Game {
    elements: Array<ArenaElement>
    constructor () {
        this.elements = new Array();
    }
    movePlayer(player: Player, direction: Direction) {
        if (player.active && !player.moved) {
            switch(direction) {
                case 'up':
                    this.checkMove(player, player.x, player.y + 1) && player.move(player.x, player.y + 1);
                    break;
                case 'down':
                    this.checkMove(player, player.x, player.y - 1) && player.move(player.x, player.y - 1);
                    break;
                case 'right':
                    this.checkMove(player, player.x + 1, player.y) && player.move(player.x + 1, player.y);
                    break;
                case 'left':
                    this.checkMove(player, player.x - 1, player.y) && player.move(player.x - 1, player.y);
                    break;
            }
        }
    }
    checkMove(player: Player, x: number, y: number): boolean {
        // Any solid object on coordinate prevents move
        return !this.elements.find(e => player !== e && e.x === x && e.y === y && !e.canMoveHere)
    }
    placePlayer(x: number, y: number) {
        let player = new Player(x,y, Date.now().toString())
        this.elements.push(player);
        return player;
    }
    castSpell(player: Player, spell: string) {
        if (player.active) {
            if (spell === 'fire_wave') {
                let wave = getWaveElements(player.x, player.y, player.direction, 'fire');
                this.elements.concat(wave);
            }
            if (spell === 'ice_wave') {
                let wave = getWaveElements(player.x, player.y, player.direction, 'ice');
                this.elements.concat(wave);
            }
        }
    }
    removePlayer(player: Player) {
        this.elements.splice(
            this.elements.indexOf(player), 1
        );
    }
    gameTick() {
        this.elements.forEach(el => {
            el.onTick && el.onTick();
        })
    }
}