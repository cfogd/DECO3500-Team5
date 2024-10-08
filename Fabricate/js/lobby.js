const myNickname = localStorage.getItem("nickname");
const gameCode = localStorage.getItem("gameCode");
const colors = ['red', 'blue', 'green', 'brown', 'purple', 'orange'];

// Simulate the list of players, could be replaced with a dynamic list based on actual game data
let players = [
    { name: myNickname, crown: true, color: colors[0] },
    { name: 'Player2', crown: false, color: colors[1] },
    { name: 'Player3', crown: false, color: colors[2] },
    { name: 'Player4', crown: false, color: colors[3] },
    { name: 'Player5', crown: false, color: colors[4] },
    { name: 'Player6', crown: false, color: colors[5] }
];

// Function to render players dynamically
function renderPlayers() {
    document.getElementById('lobby-code').innerHTML = gameCode;
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = ''; // Clear the list before adding players
    let count = 0;

    players.forEach(player => {
        let li = document.createElement('li');
        li.style.backgroundColor = players[count].color;
        li.textContent = `${player.name}`;
        if (player.crown) {
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

// Return to Menu Button Logic
document.getElementById('return-menu-btn').addEventListener('click', function() {
    // Redirect to the main menu (index.html)
    window.location.href = 'index.html';
});
