import { Element } from '../../../common/types';
import { Game } from '../game';
import { Player } from '../player';
import { AreaEffectElement } from './areaSpell';
import { getElementColor } from './elementsHelper';
import { ISpell } from './spell';
const DMG = 50;
const DURATION = 10;

export class FieldSpell implements ISpell {
  static DMG = 50;
  static DURATION = 10;
  private type: Element;
  constructor(type: Element) {
    this.type = type;
  }
  async run(game: Game, caster: Player): Promise<void> {
    game.elements = game.elements.concat(
      this.getFieldElements(this.type, caster)
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
            DURATION,
            DMG,
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
            DURATION,
            DMG,
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
            DURATION,
            DMG,
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
            DURATION,
            DMG,
            getElementColor(type),
            caster
          )
        );
        break;
    }
    return elements;
  }
}
