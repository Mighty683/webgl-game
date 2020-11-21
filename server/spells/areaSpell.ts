import { ArenaElement, Player } from "../../common/arena_elements";

export class AreaSpell implements ArenaElement {
    x: number
    y: number
    duration: number;
    damage: number;
    color: string;
    type = 'area_spell'
    active: boolean
    canMoveHere = true;
    constructor (x: number, y: number, duration: number, damage: number, color: string) {
        this.color = color;
        this.x = x;
        this.y = y;
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
        player.reduceHp(this.damage);
    }
}