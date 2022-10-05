import { ArenaElement, Point } from './types';

export class ArenaTree {
  public static NODE_OBJECT_COUNT_LIMIT = 10;
  public static MAX_LEVEL = 20;
  public level: number;
  public nodes: Array<ArenaTree> = [];
  public points: Array<Point> = [];
  public bounds: ArenaTreeNodeBounds;
  constructor(level: number, bounds: ArenaTreeNodeBounds) {
    this.level = level;
    this.bounds = bounds;
  }

  public clear(): void {
    this.points = [];
    this.nodes.forEach((node) => node.clear());
    this.nodes = [];
  }

  public split() {
    this.nodes[0] = new ArenaTree(
      this.level + 1,
      new ArenaTreeNodeBounds(
        this.bounds.x1,
        this.bounds.center.x % 1
          ? this.bounds.center.x
          : this.bounds.center.x - 1,
        this.bounds.y1,
        this.bounds.center.y
      )
    );
    this.nodes[1] = new ArenaTree(
      this.level + 1,
      new ArenaTreeNodeBounds(
        this.bounds.center.x,
        this.bounds.x2,
        this.bounds.y1,
        this.bounds.center.y % 1
          ? this.bounds.center.y
          : this.bounds.center.y + 1
      )
    );
    this.nodes[2] = new ArenaTree(
      this.level + 1,
      new ArenaTreeNodeBounds(
        this.bounds.center.x % 1
          ? this.bounds.center.x
          : this.bounds.center.x + 1,
        this.bounds.x2,
        this.bounds.center.y,
        this.bounds.y2
      )
    );
    this.nodes[3] = new ArenaTree(
      this.level + 1,
      new ArenaTreeNodeBounds(
        this.bounds.x1,
        this.bounds.center.x,
        this.bounds.center.y % 1
          ? this.bounds.center.y
          : this.bounds.center.y - 1,
        this.bounds.y2
      )
    );
  }

  public findNode(point: Point): ArenaTree | void {
    return this.nodes.find((node) => node.bounds.isInside(point));
  }

  public insert(point: Point) {
    if (this.nodes.length) {
      this.insertIntoProperNode(point);
    } else {
      this.points.push(point);
      if (this.points.length > ArenaTree.NODE_OBJECT_COUNT_LIMIT) {
        if (this.level < ArenaTree.MAX_LEVEL) {
          this.split();
          this.points.forEach((point) => this.insertIntoProperNode(point));
          this.points = [];
        } else {
          throw new Error('Reached Arena Tree capacity level');
        }
      }
    }
  }

  public remove(searchPoint: Point) {
    if (this.nodes.length) {
      let fitNode = this.findNode(searchPoint);
      if (fitNode) {
        fitNode.remove(searchPoint);
      }
    } else {
      this.points.splice(this.points.indexOf(searchPoint), 1);
    }
  }

  public getAt(searchPoint: Point): Array<Point> {
    if (this.nodes.length) {
      return this.nodes.reduce<Point[]>(
        (acc, node) => acc.concat(node.getAt(searchPoint)),
        []
      );
    } else {
      return this.points.filter(
        (point) => searchPoint.x === point.x && searchPoint.y === point.y
      );
    }
  }

  private insertIntoProperNode(point: Point) {
    if (this.bounds.isInside(point)) {
      let fitNode = this.findNode(point);
      if (fitNode) {
        fitNode.insert(point);
      } else if (this.nodes[0]) {
        // This case happens for points in center of bounds.
        this.nodes[0].insert(point);
      } else {
        throw new Error('Point not fitting any node!');
      }
    } else {
      throw new Error('Point not in bounds range');
    }
  }
}

export class ArenaTreeNodeBounds {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  constructor(x1: number, x2: number, y1: number, y2: number) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  get center(): Point {
    return {
      x: (this.x1 + this.x2) / 2,
      y: (this.y1 + this.y2) / 2,
    };
  }

  get width(): number {
    return Math.abs(this.x1 - this.x2);
  }

  get height(): number {
    return Math.abs(this.y1 - this.y2);
  }

  isInside(point: Point) {
    return (
      point.x >= this.x1 &&
      point.x <= this.x2 &&
      point.y <= this.y1 &&
      point.y >= this.y2
    );
  }
}
