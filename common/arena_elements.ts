import { Direction } from "./types";

export class ArenaField {
    elements: Array<ArenaElement>
    type: ArenaElementType
    constructor (type: ArenaElementType) {
        this.elements = new Array();
        this.type = type;
    }
    setType (type: ArenaElementType) {
        this.type = type;
    }
    canMoveHere() {
        return this.type !== 'solid' && !this.elements.find(el => {
            return el.type === 'player';
        });
    }
}

export type ArenaElementType = 'solid' | 'air'

export interface ArenaElement {
    sprite?: string
    color?: string
    type: string
    onTick?: () => void
    playerEffect?: (player: Player) => void
    active: boolean,
    x: number
    y: number
}

export class Player implements ArenaElement {
    x: number
    y: number
    id: string
    hp: number
    moved: boolean
    direction: Direction
    type = 'player'
    active: boolean
    sprite?: string | undefined;
    color?: string | undefined;
    constructor(x: number, y: number, id: string) {
        this.color = '#F5CBA7';
        this.x = x;
        this.y = y;
        this.id = id;
        this.hp = 100;
        this.direction = 'right';
        this.moved = false;
        this.active = true;
    }
    move(x: number, y: number) {
        if (x != this.x) {
            this.direction = x > this.x ? 'right' : 'left';
        }
        if (y != this.y) {
            this.direction = y > this.y ? 'up' : 'down';
        }
        this.x = x;
        this.y = y;
        this.moved = true;
    }
    refreshMove() {
        this.moved = false;
    }
    reduceHp(damage: number) {
        this.hp = this.hp - damage;
        if (this.hp <= 0) {
            this.active = false;
        }
    }
}

export class AreaSpell implements ArenaElement {
    x: number
    y: number
    hp: number;
    damage: number;
    color: string;
    type = 'area_spell'
    active: boolean
    constructor (x: number, y: number, hp: number, damage: number, color: string) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.damage = damage;
        this.active = true;
    }
    onTick() {
        this.hp = this.hp - 1;
        if (this.hp <= 0) {
            this.active = false;
        }
    }
    playerEffect(player: Player) {
        player.reduceHp(this.damage);
    }
}