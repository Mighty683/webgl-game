import { Element} from '../../common/types';
export function getElementColor(element:  Element): string {
  switch(element) {
    case 'fire':
      return '#FF5733';
    case 'ice':
      return '#AED6F1';
  }
}