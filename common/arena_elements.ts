export class ArenaField {
    elements: Array<ArenaElement>
    type: ArenaElementType
    constructor (type?: ArenaElementType) {
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

export class ArenaElement {
    sprite?: string
    color?: string
    type: string
    constructor (type: string, sprite?: string, color?: string) {
        this.type = type;
        this.sprite = sprite;
        this.color = color;
    }
}

export class Player extends ArenaElement {
    x: number
    y: number
    id: string
    moved: boolean
    constructor(x: number, y: number, id: string) {
        super('player', undefined, '#DFABCD');
        this.x = x;
        this.y = y;
        this.id = id;
        this.moved = false;
    }
    move(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.moved = true;
    }
}