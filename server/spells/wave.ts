import { Arena } from "../../common/arena";
import { AreaSpell } from "../../common/arena_elements";
import { Direction, Element } from "../../common/types";
import { getElementColor } from "./elementsHelper";
const DMG = 50;
const DURATION = 1;
export function getWaveElements(x: number, y: number, direction: Direction, type: Element) {
  let elements: Array<AreaSpell> = new Array();
  switch(direction) {
    case 'down':
      elements.push(new AreaSpell(x, y + 1, DURATION, DMG, getElementColor(type)));
      elements.push(new AreaSpell(x, y + 2, DURATION, DMG, getElementColor(type)));
      elements.push(new AreaSpell(x, y + 3, DURATION, DMG, getElementColor(type)));
      break;
    case 'up':
      elements.push(new AreaSpell(x, y - 1, DURATION, DMG, getElementColor(type)));
      elements.push(new AreaSpell(x, y - 2, DURATION, DMG, getElementColor(type)));
      elements.push(new AreaSpell(x, y - 3, DURATION, DMG, getElementColor(type)));
      break;
    case 'left':
      elements.push(new AreaSpell(x - 1 , y, DURATION, DMG, getElementColor(type)));
      elements.push(new AreaSpell(x - 2 , y, DURATION, DMG, getElementColor(type)));
      elements.push(new AreaSpell(x - 3, y, DURATION, DMG, getElementColor(type)));
      break;
    case 'right':
      elements.push(new AreaSpell(x + 1 , y, DURATION, DMG, getElementColor(type)));
      elements.push(new AreaSpell(x + 2 , y, DURATION, DMG, getElementColor(type)));
      elements.push(new AreaSpell(x + 3, y, DURATION, DMG, getElementColor(type)));
      break;
  }
  return elements;
}