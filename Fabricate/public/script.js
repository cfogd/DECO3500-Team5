let globalChannel;
let myClientId;
let myChannel;
let myChannelName;
let gameOn = false;
let players = [];
let totalPlayers = 4; // change
let game;
let myGameRoomName;
let myGameRoomCh;
let colors = ['darkcyan', 'green', 'red', 'purple', 'blue', 'orange'];
let colorsRemaining = 6;

const myNickname = localStorage.getItem("nickname");
const myGameRoomCode = localStorage.getItem("roomCode");
const amIHost = localStorage.getItem("isHost");
const startGameBtn = document.getElementById("start-game-btn");

// connect to Ably
const realtime = new Ably.Realtime({
    authUrl: "/auth",
  });

players = [
    { name: myNickname, isHost: true, color: '' },
    { name: 'Player2', isHost: false, color: '' },
    { name: 'Player3', isHost: false, color: '' },
    { name: 'Player4', isHost: false, color: '' },
    { name: 'Player5', isHost: false, color: '' },
    { name: 'Player6', isHost: false, color: '' }
];

function setColors() {
    for(i = 0; i < playerCount; i++) {
        let randInt = Math.floor(Math.random() * colorsRemaining);
        let color = colors[randInt];
        colors.splice(randInt, 1);
        colorsRemaining--;
        players[i].color = color;
    }
}

// Function to render players dynamically
function renderPlayers() {
    setColors();
    document.getElementById('lobby-code').innerHTML = roomCode;
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = ''; // Clear the list before adding players
    let count = 0;

    players.forEach(player => {
        let li = document.createElement('li');
        li.style.backgroundColor = players[count].color;
        li.textContent = `${player.name}`;
        if (player.isHost) {
            const crown = document.createElement('span');
            crown.textContent = '👑';
            crown.classList.add('crown');
            li.appendChild(crown);
        }
        playerList.appendChild(li);
        count++;
    });
}

// Call renderPlayers when the page loads
window.onload = renderPlayers;

// Function to show temporary notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;

    document.body.appendChild(notification);

    // Fade out and remove notification after 2 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500); // Wait for fade-out before removing
    }, 2000);
}

// Start Game Button Logic
document.getElementById('start-game-btn').addEventListener('click', function() {
    const timerLimit = document.getElementById('timer-limit').value;
    const rounds = document.getElementById('rounds').value;

    if (timerLimit && rounds) {
        // Show notification with game settings
        showNotification(`Starting game with ${timerLimit} seconds and ${rounds} rounds.`);

        // Redirect to the choose-article.html page after 2 seconds
        setTimeout(() => {
            window.location.href = 'choose-article.html';
        }, 2000);
    } else {
        alert('Please enter valid game settings.');
    }
});

// once connected to Ably, instantiate channels and launch the game
realtime.connection.once("connected", () => {
    myClientId = realtime.auth.clientId;
    myGameRoomName = myGameRoomCode + ":primary";
    myChannelName = myGameRoomCode + ":clientChannel-" + myClientId;
    myGameRoomCh = realtime.channels.get(myGameRoomName);
    myChannel = realtime.channels.get(myChannelName);
  
    if (amIHost == "true") {
      const globalGameName = "main-game-thread";
      globalChannel = realtime.channels.get(globalGameName);
      myGameRoomCh.subscribe("thread-ready", (msg) => {
        myGameRoomCh.presence.enter({
          nickname: myNickname,
          isHost: amIHost,
        });
      });
      globalChannel.presence.enter({
        nickname: myNickname,
        roomCode: myGameRoomCode,
        isHost: amIHost,
      });
      startGameBtn.style.display = "inline-block";
    } else if (amIHost != "true") {
      myGameRoomCh.presence.enter({
        nickname: myNickname,
        isHost: amIHost,
      });
      startGameBtn.style.display = "none";
    }
  });
  
  function startGame() {
    myChannel.publish("start-game", {
      start: true,
    });
  }

// Return to Menu Button Logic
document.getElementById('return-menu-btn').addEventListener('click', function() {
    // Redirect to the main menu (index.html)
    window.location.href = 'index.html';
});
