const {
    Worker,
    isMainThread,
    parentPort,
    threadId,
    workerData,
} = require("worker_threads");
const envConfig = require("dotenv").config();
const Ably = require("ably");
const p2 = require("p2");

const ABLY_API_KEY = process.env.ABLY_API_KEY;

let players = {};
let playerChannels = {};
let gameOn = false;
let totalPlayers = 0;
let gameRoomName = workerData.hostRoomCode + ":primary";
let roomCode = workerData.hostRoomCode;
let gameRoom;
let gameTickerOn = false;
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
    alivePlayers--;
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

// finish the game
function finishGame(playerId) {
  console.log("finished");
  let firstRunnerUpName = "";
  let secondRunnerUpName = "";
  let winnerName = "Nobody";
  let leftoverPlayers = new Array();
  for (let item in players) {
    leftoverPlayers.push({
      nickname: players[item].nickname,
      score: players[item].score,
    });
  }

  leftoverPlayers.sort((a, b) => {
    return b.score - a.score;
  });
  if (playerId == "") {
    if (leftoverPlayers.length >= 3) {
      firstRunnerUpName = leftoverPlayers[0].nickname;
      secondRunnerUpName = leftoverPlayers[1].nickname;
    } else if (leftoverPlayers == 2) {
      firstRunnerUp = leftoverPlayers[0].nickname;
    }
  } else {
    winnerName = players[playerId].nickname;
    if (leftoverPlayers.length >= 3) {
      firstRunnerUpName = leftoverPlayers[1].nickname;
      secondRunnerUpName = leftoverPlayers[2].nickname;
    } else if (leftoverPlayers.length == 2) {
      firstRunnerUpName = leftoverPlayers[1].nickname;
    }
  }

  // fan out leaderboard info when the game has finished
  gameRoom.publish("game-over", {
    winner: winnerName,
    firstRunnerUp: firstRunnerUpName,
    secondRunnerUp: secondRunnerUpName,
    totalPlayers: totalPlayers,
  });

  killWorkerThread();
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
  const randomColor = "000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
  return "0x" + randomColor;
}

