import { Direction } from '../../common/types';
import { Player } from './player';

import { ISpell } from './spells/spell';
import { FieldSpell } from './spells/field';
import { WaveSpell } from './spells/wave';
import {
  ArenaField,
  GameSpells,
  isPlayerEffectField,
  isTickableField,
  Tickable,
  TickableArenaField,
} from './types';
import { ArenaTreeNode, ArenaTreeNodeBounds } from './arenaTree';

export class Game {
  static defaultTickTime = 500;
  static arenaSize = 10000;
  id: string;

  private arenaTreeRoot: ArenaTreeNode<ArenaField>;
  private tickRootInterval?: NodeJS.Timeout;
  private spellsLibrary: Map<string, ISpell>;
  private playersSet: Set<Player>;
  private tickTime: number;
  private tickables: Set<Tickable>;

  constructor(tickTime?: number) {
    let arenaBounds = new ArenaTreeNodeBounds(
      -Game.arenaSize,
      Game.arenaSize,
      Game.arenaSize,
      -Game.arenaSize
    );
    this.tickTime = tickTime || Game.defaultTickTime;
    this.arenaTreeRoot = new ArenaTreeNode<ArenaField>(arenaBounds);
    this.playersSet = new Set();
    this.tickables = new Set();
    this.spellsLibrary = new Map<GameSpells, ISpell>();
    this.spellsLibrary.set('fire_wave', new WaveSpell('fire'));
    this.spellsLibrary.set('ice_wave', new WaveSpell('ice'));
    this.spellsLibrary.set('fire_field', new FieldSpell('fire'));
    this.spellsLibrary.set('ice_field', new FieldSpell('ice'));
    // TODO: Proper id generation
    this.id = Math.random().toString(36).substr(0, 6);
  }

  addField<T extends ArenaField>(field: T) {
    this.arenaTreeRoot.add(field);
  }
  removeField<T extends ArenaField>(field: T) {
    this.arenaTreeRoot.remove(field);
  }

  addTickable(tickable: Tickable) {
    this.tickables.add(tickable);
  }

  removeTickable(tickable: Tickable) {
    this.tickables.delete(tickable);
  }

  getFieldsList() {
    return this.arenaTreeRoot.flatten();
  }

  getPlayerList() {
    return this.playersSet.values();
  }

  movePlayer(gamePlayer: Player, direction: Direction) {
    if (gamePlayer && gamePlayer.active && !gamePlayer.moved) {
      switch (direction) {
        case 'up':
          this.canMoveHere(gamePlayer.x, gamePlayer.y + 1) &&
            gamePlayer.move(gamePlayer.x, gamePlayer.y + 1);
          break;
        case 'down':
          this.canMoveHere(gamePlayer.x, gamePlayer.y - 1) &&
            gamePlayer.move(gamePlayer.x, gamePlayer.y - 1);
          break;
        case 'right':
          this.canMoveHere(gamePlayer.x + 1, gamePlayer.y) &&
            gamePlayer.move(gamePlayer.x + 1, gamePlayer.y);
          break;
        case 'left':
          this.canMoveHere(gamePlayer.x - 1, gamePlayer.y) &&
            gamePlayer.move(gamePlayer.x - 1, gamePlayer.y);
          break;
      }

      this.arenaTreeRoot.remove(gamePlayer);
      this.arenaTreeRoot.add(gamePlayer);
    }
  }

  canMoveHere(x: number, y: number): boolean {
    return this.arenaTreeRoot
      .getAt({
        x,
        y,
      })
      .every((point) => point.canMoveHere);
  }

  castSpell(caster: Player, spell: GameSpells) {
    let spellInstance = this.spellsLibrary.get(spell);
    if (spellInstance) {
      spellInstance.run(this, caster);
    }
  }

  removePlayer(player: Player) {
    this.playersSet.delete(player);
    this.arenaTreeRoot.remove(player);
  }

  gameTick() {
    /**
     * Order:
     * - Field effects on player
     * - Player attacks (TODO)
     * - Elements onTick
     */
    Array.from(this.playersSet.values()).forEach((player) => {
      let fieldsAtPlayerPosition = this.arenaTreeRoot.getAt(player);
      fieldsAtPlayerPosition
        .filter(isPlayerEffectField)
        .forEach((spell) => spell.playerEffect(player));
    });
    this.playersSet.forEach((player) => player.onTick());
    Array.from(this.tickables.values()).forEach((tickable) =>
      tickable.onTick(this)
    );
  }

  addPlayer() {
    let gamePlayer = new Player(0, 0);
    this.playersSet.add(gamePlayer);
    return gamePlayer;
  }

  startGameTicks(finishTickCallback: () => void) {
    // TODO: Rewrite
    this.tickRootInterval = global.setInterval(() => {
      const start = performance.now();
      this.gameTick();
      const end = performance.now();

      if (end - start > this.tickTime) {
        console.warn('Tick performance to slow!');
      }
      finishTickCallback();
    }, this.tickTime);
  }

  dispose() {
    if (this.tickRootInterval) global.clearInterval(this.tickRootInterval);
  }
}
