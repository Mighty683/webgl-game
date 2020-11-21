# webgl-game

POC of small multi-player game. Where players fight on small area.

## Run

- `npm install`
- `npm run start-server` - start server, server is running at `localhost:8080`
- `npm run start` - start front-end, front-end is running at `localhost:1234`

### Server

Server is based on websockets only it's place where game logic is placed.

### Front-end

Front-end contain mainly only render logic based on data from backend.

Commands:
- Move: Arrow keys
- Waves Spells: `a`,`s,`
- Field Spells: `d`,`f`

## TODO:
- Multiplayer
  - Allow multiple games
  - Allow multiple players join game
- Webgl now I used simpler in usage canvas.
- Refactor game logic.
  - Better colition detection.
  - Remove single function loop pattern
  - Introduce events?
- Add layout around game.


### Ideas

#### Spatial Partition

- http://gameprogrammingpatterns.com/spatial-partition.html
- https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
- https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/introduction-to-octrees-r3529/