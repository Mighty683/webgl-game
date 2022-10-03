# webgl-game

POC of small multi-player game. Where players fight on small area.

## Run

- `npm install`
- `npm run start-server` - start server, server is running at `localhost:8080`
- `npm run start` - start front-end, front-end is running at `localhost:1234`

### Server

Server is based on web-sockets only it's place where game logic is placed.

### Front-end

Front-end contain mainly only render logic based on data from backend.

Commands:

- Move: Arrow keys
- Waves Spells: `a`,`s`
- Field Spells: `d`,`f`

## TODO:

- Webgl now I used simpler in usage canvas.
- Refactor game logic.
  - Better collision detection.
  - Remove single function loop pattern
  - Introduce events?
  - Separate players from arena elements
  - Move centering of render to server
- Add layout around game
  - Waiting room
  - List of games
  - Display messages about game:
    - Death message
    - Kill message

### Ideas

#### Spatial Partition

- http://gameprogrammingpatterns.com/spatial-partition.html
- https://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
- https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/introduction-to-octrees-r3529/
