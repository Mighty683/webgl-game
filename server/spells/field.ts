import { Direction, Element } from "../../common/types";
import { AreaSpell } from "./areaSpell";
import { getElementColor } from "./elementsHelper";
const DMG = 50;
const DURATION = 10;

export function getFieldElements(x: number, y: number, direction: Direction, type: Element) {
    let elements: Array<AreaSpell> = new Array();
    switch(direction) {
      case 'down':
        elements.push(new AreaSpell(x, y - 1, DURATION, DMG, getElementColor(type)));
        break;
      case 'up':
        elements.push(new AreaSpell(x, y + 1, DURATION, DMG, getElementColor(type)));
        break;
      case 'left':
        elements.push(new AreaSpell(x - 1 , y, DURATION, DMG, getElementColor(type)));
        break;
      case 'right':
        elements.push(new AreaSpell(x + 1 , y, DURATION, DMG, getElementColor(type)));
        break;
    }
    return elements;
  }