import { Direction } from "../common/types";
import { RefreshState } from "../common/websocket_messages";
import { ArenaElement } from "./arenaElement";
import { Player } from "./player";
import { PlayerSocket } from "./playerSocket";
import { getFieldElements } from "./spells/field";
import { getWaveElements } from "./spells/wave";

const TICK_TIME = 300;
export class Game {
    elements: Array<ArenaElement>
    interval?: NodeJS.Timeout
    playersSockets: Array<PlayerSocket>
    id: string
    constructor () {
        this.elements = new Array();
        this.playersSockets = new Array();
        // TODO: Proper id generation
        this.id = Math.random().toString(36).substr(0, 6);
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
    castSpell(player: Player, spell: string) {
        if (player.active) {
            if (spell === 'fire_wave') {
                let wave = getWaveElements(player.x, player.y, player.direction, 'fire');
                this.elements = this.elements.concat(wave);
            }
            if (spell === 'ice_wave') {
                let wave = getWaveElements(player.x, player.y, player.direction, 'ice');
                this.elements = this.elements.concat(wave);
            }
            if (spell === 'fire_field') {
                let wave = getFieldElements(player.x, player.y, player.direction, 'fire');
                this.elements = this.elements.concat(wave);
            }
            if (spell === 'ice_field') {
                let wave = getFieldElements(player.x, player.y, player.direction, 'ice');
                this.elements = this.elements.concat(wave);
            }
        }
    }
    removePlayer(player: PlayerSocket) {
        this.playersSockets.splice(
            this.playersSockets.indexOf(player), 1
        );
        if (player.player)
        this.removeElement(player.player);
    }
    removeElement(el: ArenaElement) {
        this.elements.splice(
            this.elements.indexOf(el), 1
        );
    }
    gameTick() {
        this.elements.forEach(el => {
            this.playersSockets.forEach(playerSocket => {
                if (playerSocket.player === el) {
                    return;
                }
                if (playerSocket.player?.x === el.x && playerSocket.player.y === el.y) {
                    el.playerEffect && el.playerEffect(playerSocket.player)
                }
            })
            el.onTick && el.onTick();
        });
        this.elements = this.elements.filter(el => el.active);
    }
    placePlayer(x: number, y: number, playerSocket: PlayerSocket) {
        let gamePlayer = new Player(x,y, Date.now().toString())
        this.playersSockets.push(playerSocket);
        this.elements.push(gamePlayer);
        return gamePlayer;
    }
    initGame() {
        this.interval = setInterval(() => {
            this.playersSockets.forEach(player => {
                let cmd: RefreshState = {
                    cmd: 'refresh_state',
                    id: this.id,
                    elements: this.elements
                }
                this.gameTick();
                player.socket.send(JSON.stringify(cmd));
            });
        }, TICK_TIME);
    }
}