const {
    Worker,
    isMainThread,
    parentPort,
    threadId,
    workerData,
} = require("worker_threads");
const Ably = require("ably");

const ABLY_API_KEY = process.env.ABLY_API_KEY;

let players = {};
let playerChannels = {};
let totalPlayers = 0;
let gameRoomName = workerData.hostRoomCode + ":primary";
let roomCode = workerData.hostRoomCode;
let gameOn = false;
let gameRoom;
let gameTickerOn = false;
let colors = ['darkcyan', 'green', 'red', 'purple', 'blue', 'orange'];
let colorsRemaining = 6;

const MIN_PLAYERS_TO_START_GAME = 2;
const GAME_TICKER_MS = 100;

const realtime = new Ably.Realtime({
    key: ABLY_API_KEY,
    echoMessages: false,
});

realtime.connection.once("connected", () => {
  gameRoom = realtime.channels.get(gameRoomName);

  gameRoom.presence.subscribe("enter", (player) => {
  console.log("new player");
  let newPlayerId;
  totalPlayers++;
  parentPort.postMessage({
      roomName: roomCode,
      totalPlayers: totalPlayers,
      gameOn: gameOn,
  });
  newPlayerId = player.clientId;
  playerChannels[newPlayerId] = realtime.channels.get(
      workerData.hostRoomCode + ":clientChannel-" + player.clientId
  );
  if (++colorIndex == 6) {
      colorIndex = 0;
  }
  if (totalPlayers == 1) {
      gameTickerOn = true;
      startGameDataTicker();
  }
  newPlayerObject = {
      id: newPlayerId,
      score: 0,
      nickname: player.data.nickname,
      color: randomColorGenerator()
  };
  players[newPlayerId] = newPlayerObject;
  subscribeToPlayerInput(playerChannels[newPlayerId], newPlayerId);
  });

  gameRoom.presence.subscribe("leave", (player) => {
    let leavingPlayer = player.clientId;
    totalPlayers--;
    parentPort.postMessage({
      roomName: roomCode,
      totalPlayers: totalPlayers,
    });
    delete players[leavingPlayer];
    if (totalPlayers <= 0) {
      killWorkerThread();
    }
  });
  gameRoom.publish("thread-ready", {
    start: true,
  });
});

function startGameDataTicker() {
    let tickInterval = setInterval(() => {
      if (!gameTickerOn) {
        clearInterval(tickInterval);
      } else {
        
        // fan out the latest game state
        gameRoom.publish("game-state", {
          players: players,
          playerCount: totalPlayers,
          gameOn: gameOn,
        });
      }
    }, GAME_TICKER_MS);
}

// reset all variables in the server
function killWorkerThread() {
  parentPort.postMessage({
    resetEntry: true,
    roomName: roomCode,
  });
  for (let item in playerChannels) {
    playerChannels[item].detach();
  }
  process.exit(0);
}

// method to randomly generate a color for the player
function randomColorGenerator() {
  let randInt = Math.floor(Math.random() * colorsRemaining);
  let color = colors[randInt];
  colors.splice(randInt, 1);
  colorsRemaining--;
  return color;
}

