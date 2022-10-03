import { Game } from '../game';
import { Player } from '../player';

export interface ISpell {
  run(game: Game, caster: Player): Promise<void>;
}
