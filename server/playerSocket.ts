import { Player } from "./player";

export class PlayerSocket {
    gamePlayer?: Player
    id: string
    score: number
    constructor () {
        this.score = 0;
        this.id = Date.now().toString(36)
    }
    addKill() {
        this.score++;
    }
    setGamePlayer(player: Player) {
        this.gamePlayer = player;
    }
}
