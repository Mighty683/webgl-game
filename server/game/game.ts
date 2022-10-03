import { Direction } from '../../common/types';
import { RefreshState } from '../../common/websocket_messages';
import { ArenaElement } from './arenaElement';
import { Player } from './player';
import { PlayerSocket } from '../playerSocket';

import { ISpell } from './spells/spell';
import { FieldSpell } from './spells/field';
import { WaveSpell } from './spells/wave';

const TICK_TIME = 300;
export class Game {
  elements: Array<ArenaElement>;
  spells: Map<string, ISpell>;
  interval?: NodeJS.Timeout;
  playersSockets: Array<PlayerSocket>;
  id: string;
  constructor() {
    this.elements = new Array();
    this.playersSockets = new Array();
    this.spells = new Map();
    this.spells.set('fire_wave', new WaveSpell('fire'));
    this.spells.set('ice_wave', new WaveSpell('ice'));
    this.spells.set('fire_field', new FieldSpell('fire'));
    this.spells.set('ice_field', new FieldSpell('ice'));
    // TODO: Proper id generation
    this.id = Math.random().toString(36).substr(0, 6);
  }
  movePlayer(player: PlayerSocket, direction: Direction) {
    let gamePlayer = player.gamePlayer;
    if (gamePlayer && gamePlayer.active && !gamePlayer.moved) {
      switch (direction) {
        case 'up':
          this.checkMove(gamePlayer, gamePlayer.x, gamePlayer.y + 1) &&
            gamePlayer.move(gamePlayer.x, gamePlayer.y + 1);
          break;
        case 'down':
          this.checkMove(gamePlayer, gamePlayer.x, gamePlayer.y - 1) &&
            gamePlayer.move(gamePlayer.x, gamePlayer.y - 1);
          break;
        case 'right':
          this.checkMove(gamePlayer, gamePlayer.x + 1, gamePlayer.y) &&
            gamePlayer.move(gamePlayer.x + 1, gamePlayer.y);
          break;
        case 'left':
          this.checkMove(gamePlayer, gamePlayer.x - 1, gamePlayer.y) &&
            gamePlayer.move(gamePlayer.x - 1, gamePlayer.y);
          break;
      }
    }
  }
  checkMove(player: Player, x: number, y: number): boolean {
    // Any solid object on coordinate prevents move
    return !this.elements.find(
      (e) => player !== e && e.x === x && e.y === y && !e.canMoveHere
    );
  }
  castSpell(playerSocket: PlayerSocket, spell: string) {
    if (playerSocket.gamePlayer?.active) {
      let spellInstance = this.spells.get(spell);
      if (spellInstance) {
        spellInstance.run(this, playerSocket.gamePlayer);
      }
    }
  }
  removePlayer(player: PlayerSocket) {
    this.playersSockets.splice(this.playersSockets.indexOf(player), 1);
    if (player.gamePlayer) this.removeElement(player.gamePlayer);
  }
  removeElement(el: ArenaElement) {
    this.elements.splice(this.elements.indexOf(el), 1);
  }
  gameTick() {
    /**
     * Order:
     * - Elements player effects
     * - Player attacks (TODO)
     * - Check if player is alive
     * - Elements onTick
     */
    this.elements.forEach((el) => {
      this.playersSockets.forEach((playerSocket) => {
        if (playerSocket.gamePlayer === el) {
          return;
        }
        if (
          playerSocket.gamePlayer?.x === el.x &&
          playerSocket.gamePlayer?.y === el.y
        ) {
          el.playerEffect && el.playerEffect(playerSocket.gamePlayer);
        }
        if (!playerSocket.gamePlayer?.active) {
          this.placePlayer(0, 0, playerSocket);
        }
      });
      el.onTick && el.onTick();
    });
    this.elements = this.elements.filter((el) => el.active);
  }
  placePlayer(x: number, y: number, playerSocket: PlayerSocket) {
    let gamePlayer = new Player(x, y, playerSocket.id);
    playerSocket.setGamePlayer(gamePlayer);
    this.elements.push(gamePlayer);
    return gamePlayer;
  }
  addPlayer(playerSocket: PlayerSocket) {
    let gamePlayer = this.placePlayer(0, 0, playerSocket);
    this.playersSockets.push(playerSocket);
    this.elements.push(gamePlayer);
    return gamePlayer;
  }
  initGame() {
    this.interval = setInterval(() => {
      this.playersSockets.forEach((player) => {
        let cmd: RefreshState = {
          cmd: 'refresh_state',
          id: this.id,
          elements: this.elements,
          score: player.score,
        };
        this.gameTick();
        player.socket.send(JSON.stringify(cmd));
      });
    }, TICK_TIME);
  }
}
