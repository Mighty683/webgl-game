import { Game } from './game';

describe('game engine', () => {
  it('should handle player movement', async () => {
    //given
    let testGame = new Game();
    let p1 = testGame.addPlayer();

    //when
    let gameTickGenerator = function* () {
      let resolveTickPromise: () => void = () => {};
      testGame.initGame(() => {
        resolveTickPromise();
      });
      while (true) {
        let tickPromise = new Promise<undefined>(
          (r) => (resolveTickPromise = r as () => void)
        );
        yield tickPromise;
      }
    };

    testGame.movePlayer(p1, 'up');
    await gameTickGenerator().next().value;
    testGame.movePlayer(p1, 'up');
    await gameTickGenerator().next().value;
    testGame.movePlayer(p1, 'left');
    await gameTickGenerator().next().value;
    testGame.movePlayer(p1, 'left');
    await gameTickGenerator().next().value;
    testGame.movePlayer(p1, 'right');
    await gameTickGenerator().next().value;
    //then
    expect(testGame.players.values().next().value.y).toEqual(2);
    expect(testGame.players.values().next().value.x).toEqual(-1);
  });
});
