import { Direction } from '../../common/types';
import { RefreshState } from '../../common/websocket_messages';
import { Player } from './player';

import { ISpell } from './spells/spell';
import { FieldSpell } from './spells/field';
import { WaveSpell } from './spells/wave';
import { ArenaElement, GameSpells } from './types';

export class Game {
  static defaultTickTime = 500;
  arenaElements: Array<ArenaElement>;
  spells: Map<string, ISpell>;
  interval?: NodeJS.Timeout;
  players: Set<Player>;
  id: string;
  tickTime: number;
  constructor(tickTime?: number) {
    this.tickTime = tickTime || Game.defaultTickTime;
    this.arenaElements = new Array();
    this.players = new Set();
    this.spells = new Map<GameSpells, ISpell>();
    this.spells.set('fire_wave', new WaveSpell('fire'));
    this.spells.set('ice_wave', new WaveSpell('ice'));
    this.spells.set('fire_field', new FieldSpell('fire'));
    this.spells.set('ice_field', new FieldSpell('ice'));
    // TODO: Proper id generation
    this.id = Math.random().toString(36).substr(0, 6);
  }
  movePlayer(gamePlayer: Player, direction: Direction) {
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
    return !this.arenaElements.find(
      (e) => player !== e && e.x === x && e.y === y && !e.canMoveHere
    );
  }
  castSpell(caster: Player, spell: GameSpells) {
    let spellInstance = this.spells.get(spell);
    if (spellInstance) {
      spellInstance.run(this, caster);
    }
  }
  removePlayer(player: Player) {
    this.players.delete(player);
    this.removeElement(player);
  }
  removeElement(el: ArenaElement) {
    this.arenaElements.splice(this.arenaElements.indexOf(el), 1);
  }
  async gameTick() {
    /**
     * Order:
     * - Elements player effects
     * - Player attacks (TODO)
     * - Check if player is alive
     * - Elements onTick
     */
    this.arenaElements.forEach((el) => {
      this.players.forEach((gamePlayer) => {
        if (gamePlayer === el) {
          return;
        }
        if (gamePlayer.x === el.x && gamePlayer.y === el.y) {
          el.playerEffect && el.playerEffect(gamePlayer);
        }
      });
      el.onTick && el.onTick();
    });
    this.players.forEach((p) => p.onTick());
    this.arenaElements = this.arenaElements.filter((el) => el.active);
  }
  addPlayer() {
    let gamePlayer = new Player(0, 0);
    this.players.add(gamePlayer);
    return gamePlayer;
  }
  startGameTicks(finishTickCallback: () => void) {
    // TODO: Rewrite
    this.interval = global.setInterval(() => {
      this.gameTick();
      finishTickCallback();
    }, this.tickTime);
  }

  dispose() {
    if (this.interval) global.clearInterval(this.interval);
  }
}
