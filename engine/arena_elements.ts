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
}

export type ArenaElementType = 'solid' | 'entity' | 'air'

export class ArenaElement {
    sprite: string
}