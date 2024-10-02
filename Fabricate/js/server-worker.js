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

const realtime = new Ably.Realtime({
    key: ABLY_API_KEY,
    echoMessages: false,
});

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
};
players[newPlayerId] = newPlayerObject;
subscribeToPlayerInput(playerChannels[newPlayerId], newPlayerId);
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

