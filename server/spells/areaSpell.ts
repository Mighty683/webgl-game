import { ArenaElement } from "../arenaElement";
import { Player } from "../player";
import { PlayerSocket } from "../playerSocket";


export class AreaSpell implements ArenaElement {
    x: number
    y: number
    duration: number;
    damage: number;
    color: string;
    type = 'area_spell'
    active: boolean
    canMoveHere = true;
    creator: PlayerSocket
    constructor (x: number, y: number, duration: number, damage: number, color: string, creator: PlayerSocket) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.creator = creator;
        this.duration = duration;
        this.damage = damage;
        this.active = true;
    }
    onTick() {
        this.duration = this.duration - 1;
        if (this.duration <= 0) {
            this.active = false;
        }
    }
    playerEffect(player: Player) {
        if (player.active) {
            player.reduceHp(this.damage);
            if (!player.active) {
                this.creator.addKill();
            }
        }
    }
}