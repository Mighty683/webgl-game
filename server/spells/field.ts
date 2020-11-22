import { Direction, Element } from "../../common/types";
import { PlayerSocket } from "../playerSocket";
import { AreaSpell } from "./areaSpell";
const DMG = 50;
const DURATION = 10;

export function getFieldElements(type: Element, creator: PlayerSocket) {
    let elements: Array<AreaSpell> = new Array();
    let gamePlayer = creator.gamePlayer;
    switch(gamePlayer?.direction) {
      case 'down':
        elements.push(new AreaSpell(gamePlayer.x, gamePlayer.y - 1, DURATION, DMG, creator));
        break;
      case 'up':
        elements.push(new AreaSpell(gamePlayer.x, gamePlayer.y + 1, DURATION, DMG, creator));
        break;
      case 'left':
        elements.push(new AreaSpell(gamePlayer.x - 1 , gamePlayer.y, DURATION, DMG, creator));
        break;
      case 'right':
        elements.push(new AreaSpell(gamePlayer.x + 1 , gamePlayer.y, DURATION, DMG, creator));
        break;
    }
    return elements;
  }