import { Player } from "./player";

export interface ArenaElement {
    sprite?: string
    color?: string
    type: String
    active: boolean
    canMoveHere: boolean
    hp?: number
    x: number
    y: number
    id?: string
    onTick?: () => void
    playerEffect?: (player: Player) => void
}
