import { Element } from '../../../common/types';
import { Game } from '../game';
import { Player } from '../player';
import { AreaEffectElement } from './areaSpell';
import { getElementColor } from './elementsHelper';
import { ISpell } from './spell';

export class FieldSpell implements ISpell {
  static DMG = 5;
  static DURATION = 10;
  private type: Element;
  constructor(type: Element) {
    this.type = type;
  }
  async run(game: Game, caster: Player): Promise<void> {
    this.getFieldElements(this.type, caster).forEach((el) =>
      game.arenaSpellsTree.insert(el)
    );
  }
  private getFieldElements(type: Element, caster: Player) {
    let elements: Array<AreaEffectElement> = new Array();
    switch (caster?.direction) {
      case 'down':
        elements.push(
          new AreaEffectElement(
            caster.x,
            caster.y - 1,
            FieldSpell.DURATION,
            FieldSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        break;
      case 'up':
        elements.push(
          new AreaEffectElement(
            caster.x,
            caster.y + 1,
            FieldSpell.DURATION,
            FieldSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        break;
      case 'left':
        elements.push(
          new AreaEffectElement(
            caster.x - 1,
            caster.y,
            FieldSpell.DURATION,
            FieldSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        break;
      case 'right':
        elements.push(
          new AreaEffectElement(
            caster.x + 1,
            caster.y,
            FieldSpell.DURATION,
            FieldSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        break;
    }
    return elements;
  }
}
