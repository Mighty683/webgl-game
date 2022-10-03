import { Element } from '../../../common/types';
import { Game } from '../game';
import { Player } from '../player';
import { AreaEffectElement } from './areaSpell';
import { getElementColor } from './elementsHelper';
import { ISpell } from './spell';

export class WaveSpell implements ISpell {
  static DMG = 50;
  static DURATION = 1;
  private type: Element;
  constructor(type: Element) {
    this.type = type;
  }

  async run(game: Game, caster: Player): Promise<void> {
    game.elements = game.elements.concat(
      this.getWaveElements(this.type, caster)
    );
  }

  private getWaveElements(type: Element, caster: Player) {
    let elements: Array<AreaEffectElement> = new Array();
    switch (caster?.direction) {
      case 'down':
        elements.push(
          new AreaEffectElement(
            caster.x,
            caster.y - 1,
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        elements.push(
          new AreaEffectElement(
            caster.x,
            caster.y - 2,
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        elements.push(
          new AreaEffectElement(
            caster.x,
            caster.y - 3,
            WaveSpell.DURATION,
            WaveSpell.DMG,
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
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        elements.push(
          new AreaEffectElement(
            caster.x,
            caster.y + 2,
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        elements.push(
          new AreaEffectElement(
            caster.x,
            caster.y + 3,
            WaveSpell.DURATION,
            WaveSpell.DMG,
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
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        elements.push(
          new AreaEffectElement(
            caster.x - 2,
            caster.y,
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        elements.push(
          new AreaEffectElement(
            caster.x - 3,
            caster.y,
            WaveSpell.DURATION,
            WaveSpell.DMG,
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
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        elements.push(
          new AreaEffectElement(
            caster.x + 2,
            caster.y,
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        elements.push(
          new AreaEffectElement(
            caster.x + 3,
            caster.y,
            WaveSpell.DURATION,
            WaveSpell.DMG,
            getElementColor(type),
            caster
          )
        );
        break;
      default:
        break;
    }
    return elements;
  }
}
