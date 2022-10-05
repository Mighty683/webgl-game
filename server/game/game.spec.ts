import { Game } from './game';
import { Player } from './player';
import { WaveSpell } from './spells/wave';

describe('game engine', () => {
  let testGame = new Game();

  function getGameTickGenerator(
    gameToHandleTicks: Game
  ): Generator<Promise<undefined>, never, unknown> {
    let pauseGeneratorFunction = function* () {
      let resolveTickPromise: () => void = () => {};
      gameToHandleTicks.startGameTicks(() => {
        resolveTickPromise();
      });
      while (true) {
        let tickPromise = new Promise<undefined>(
          (r) => (resolveTickPromise = r as () => void)
        );
        yield tickPromise;
      }
    };

    return pauseGeneratorFunction();
  }

  beforeEach(() => {
    testGame = new Game(1);
  });

  afterEach(() => {
    testGame.dispose();
  });

  it('should handle player movement', async () => {
    //given
    let p1 = testGame.addPlayer();
    let gameTickGenerator = getGameTickGenerator(testGame);

    //when
    testGame.movePlayer(p1, 'up');
    await gameTickGenerator.next().value;
    testGame.movePlayer(p1, 'up');
    await gameTickGenerator.next().value;
    testGame.movePlayer(p1, 'left');
    await gameTickGenerator.next().value;
    testGame.movePlayer(p1, 'left');
    await gameTickGenerator.next().value;
    testGame.movePlayer(p1, 'right');
    await gameTickGenerator.next().value;

    //then
    expect(p1.y).toEqual(2);
    expect(p1.x).toEqual(-1);
  });

  xit('should handle player collision', async () => {
    //given
    let p1 = testGame.addPlayer();
    let p2 = testGame.addPlayer();
    let gameTickPauseGenerator = getGameTickGenerator(testGame);
    //when
    testGame.movePlayer(p1, 'up');
    await gameTickPauseGenerator.next().value;
    testGame.movePlayer(p1, 'up');
    await gameTickPauseGenerator.next().value;
    testGame.movePlayer(p2, 'up');
    await gameTickPauseGenerator.next().value;
    testGame.movePlayer(p2, 'up');
    await gameTickPauseGenerator.next().value;
    expect(p1.y).toEqual(2);
    expect(p1.x).toEqual(0);
    expect(p2.y).toEqual(1);
    expect(p2.x).toEqual(0);

    //when
  });
  it('should handle player battle', async () => {
    //given
    let p1 = testGame.addPlayer();
    let p2 = testGame.addPlayer();
    let gameTickPauseGenerator = getGameTickGenerator(testGame);

    //when
    testGame.movePlayer(p1, 'up');
    await gameTickPauseGenerator.next().value;
    testGame.movePlayer(p1, 'up');
    await gameTickPauseGenerator.next().value;
    testGame.movePlayer(p2, 'up');
    await gameTickPauseGenerator.next().value;
    testGame.castSpell(p2, 'ice_wave');
    await gameTickPauseGenerator.next().value;
    testGame.castSpell(p2, 'ice_wave');
    await gameTickPauseGenerator.next().value;

    //then
    expect(p1.hp).toBe(Player.defaultHp - WaveSpell.DMG * 2);
    expect(p1.active).toBe(false);
  });
});
