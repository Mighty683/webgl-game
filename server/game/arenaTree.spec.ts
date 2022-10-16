import { ArenaTreeNode, ArenaTreeNodeBounds } from './arenaTree';
import { Point } from './types';

describe('ArenaTree', () => {
  ArenaTreeNode.NODE_OBJECT_COUNT_LIMIT = 2;

  describe('split', () => {
    it('should split into proper nodes', () => {
      let rootNode = new ArenaTreeNode(
        new ArenaTreeNodeBounds(-100, 100, 100, -100)
      );
      rootNode.split();

      expect(rootNode.nodes[0].bounds.center).toEqual({
        x: -50.5,
        y: 50,
      });
      expect(rootNode.nodes[1].bounds.center).toEqual({
        x: 50,
        y: 50.5,
      });
      expect(rootNode.nodes[2].bounds.center).toEqual({
        x: 50.5,
        y: -50,
      });
      expect(rootNode.nodes[3].bounds.center).toEqual({
        x: -50,
        y: -50.5,
      });
    });

    it('should not split into nodes smaller than 1', () => {
      let rootNode = new ArenaTreeNode(new ArenaTreeNodeBounds(-1, 1, 1, -1));

      rootNode.insert({ x: 0, y: 0 });
      rootNode.insert({ x: 0, y: 0 });
      rootNode.insert({ x: 0, y: 0 });
      rootNode.insert({ x: 0, y: 0 });

      expect(rootNode.nodes[0].nodes.length).toBe(0);
      expect(rootNode.nodes[0].points.size).toBe(4);
    });
  });

  describe('remove', () => {
    it('should remove point', () => {
      let rootNode = new ArenaTreeNode(
        new ArenaTreeNodeBounds(-100, 100, 100, -100)
      );
      let point: Point = {
        x: 0,
        y: 0,
      };

      rootNode.insert(point);
      rootNode.remove(point);

      expect(rootNode.getAt(point).length).toBe(0);
    });
  });

  describe('findNode', () => {
    it('should find proper node for point', () => {
      let rootNode = new ArenaTreeNode(
        new ArenaTreeNodeBounds(-100, 100, 100, -100)
      );
      rootNode.split();

      expect(
        rootNode.findNode({
          x: 1,
          y: 1,
        })
      ).toBe(rootNode.nodes[1]);
    });
  });

  describe('insert', () => {
    it('should insert elements into proper places', () => {
      let rootNode = new ArenaTreeNode(
        new ArenaTreeNodeBounds(-10, 10, 10, -10)
      );
      rootNode.insert({
        x: 0,
        y: 0,
      });
      rootNode.insert({
        x: 1,
        y: 1,
      });
      rootNode.insert({
        x: 2,
        y: 2,
      });
      expect(rootNode.nodes[0].points.size).toBe(1);
      expect(rootNode.nodes[1].points.size).toBe(2);
      expect(rootNode.points.size).toBe(0);
    });
  });
  describe('getAt', () => {
    it('should return proper points', () => {
      let arenaSize = 100000;
      //given
      let pointA: Point = {
        x: 0,
        y: 0,
      };
      let pointADouble: Point = {
        x: 0,
        y: 0,
      };
      let pointB: Point = {
        x: 1000,
        y: 2000,
      };
      let rootNode = new ArenaTreeNode(
        new ArenaTreeNodeBounds(-arenaSize, arenaSize, arenaSize, -arenaSize)
      );
      rootNode.insert(pointA);
      rootNode.insert(pointADouble);
      rootNode.insert(pointB);
      //then
      expect(
        rootNode.getAt({
          x: 0,
          y: 0,
        })[0]
      ).toBe(pointA);
      expect(
        rootNode.getAt({
          x: 0,
          y: 0,
        })[1]
      ).toBe(pointADouble);
      expect(rootNode.getAt({ x: 1, y: 1 }).length).toBe(0);
    });
  });
});

describe('ArenaTreeNodeBounds', () => {
  it('should calculate width', () => {
    expect(new ArenaTreeNodeBounds(-1, 2, 0, 0).width).toBe(3);
    expect(new ArenaTreeNodeBounds(2, -1, 0, 0).width).toBe(3);
    expect(new ArenaTreeNodeBounds(2, 2, 0, 0).width).toBe(0);
  });
  it('should calculate height', () => {
    expect(new ArenaTreeNodeBounds(0, 0, -1, 2).height).toBe(3);
    expect(new ArenaTreeNodeBounds(0, 0, 2, -1).height).toBe(3);
    expect(new ArenaTreeNodeBounds(0, 0, 2, 2).height).toBe(0);
  });

  it('should calculate center', () => {
    expect(new ArenaTreeNodeBounds(2, 4, -1, 2).center).toEqual({
      x: 3,
      y: 0.5,
    });
  });

  it('should detect point inside', () => {
    let point: Point = {
      x: 0,
      y: 0,
    };

    expect(new ArenaTreeNodeBounds(-1, 1, 1, -1).isInside(point)).toBe(true);
    expect(new ArenaTreeNodeBounds(1, 2, 2, 1).isInside(point)).toBe(false);
  });
});
