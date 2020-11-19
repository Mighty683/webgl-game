export class ArenaField {
    elements: Set<ArenaElement>
    type: ArenaElementType
    constructor (type?: ArenaElementType) {
        this.elements = new Set();
        this.type = type;
    }
    setType (type: ArenaElementType) {
        this.type = type;
    }
}

export type ArenaElementType = 'solid' | 'air'

export class ArenaElement {
    sprite?: string
    color?: string
}

export class Player extends ArenaElement {

}