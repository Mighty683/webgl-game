export type Direction = 'up' | 'down' | 'left' | 'right';
export type Command = Direction | 'fire_wave' | 'fire_field'
export type Element = 'fire';
export type CenterCoordinates = { x: number, y: number }