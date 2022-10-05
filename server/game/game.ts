import { Direction } from '../../common/types';
import { Player } from './player';

import { ISpell } from './spells/spell';
import { FieldSpell } from './spells/field';
import { WaveSpell } from './spells/wave';
import { ArenaElement, GameSpells, SpellArenaElement } from './types';
import { ArenaTree, ArenaTreeNodeBounds } from './arenaTree';

export class Game {
  static defaultTickTime = 500;
  static arenaSize = 10000;
  arenaElementsTree: ArenaTree<ArenaElement>;
  arenaSpellsTree: ArenaTree<SpellArenaElement>;
  playersArenaTree: ArenaTree<Player>;
  spells: Map<string, ISpell>;
  interval?: NodeJS.Timeout;
  players: Set<Player>;
  id: string;
  tickTime: number;
  constructor(tickTime?: number) {
    let arenaBounds = new ArenaTreeNodeBounds(
      -Game.arenaSize,
      Game.arenaSize,
      Game.arenaSize,
      -Game.arenaSize
    );
    this.tickTime = tickTime || Game.defaultTickTime;
    this.playersArenaTree = new ArenaTree<Player>(0, arenaBounds);
    this.arenaElementsTree = new ArenaTree<ArenaElement>(0, arenaBounds);
    this.arenaSpellsTree = new ArenaTree<SpellArenaElement>(0, arenaBounds);
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

      this.playersArenaTree.remove(gamePlayer);
      this.playersArenaTree.insert(gamePlayer);
    }
  }
  canMoveHere(x: number, y: number): boolean {
    return (
      this.arenaElementsTree
        .getAt({
          x,
          y,
        })
        .every((point) => point.canMoveHere) &&
      !this.playersArenaTree.getAt({
        x,
        y,
      }).length
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
    this.playersArenaTree.remove(player);
  }

  gameTick() {
    /**
     * Order:
     * - Spells players effect
     * - Player attacks (TODO)
     * - Elements onTick
     * - Cleanup inactive elements
     */
    Array.from(this.players.values()).forEach((player) => {
      let spellsAtPlayerPosition = this.arenaSpellsTree.getAt(player);
      spellsAtPlayerPosition.forEach((spell) => spell.playerEffect(player));
    });
    this.players.forEach((player) => player.onTick());
    this.arenaSpellsTree.flatten().forEach((spell) => spell.onTick());
  }
  addPlayer() {
    let gamePlayer = new Player(0, 0);
    this.players.add(gamePlayer);
    this.playersArenaTree.insert(gamePlayer);
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
