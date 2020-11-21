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


### TODO:

- Webgl :D now I used simpler in usage canvas.
- Refactor game logic.
  - Better colition detection.
  - Remove single function loop pattern
  - Introduce events?
- Add layout around game
