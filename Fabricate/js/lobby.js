const myNickname = localStorage.getItem("nickname");
const gameCode = localStorage.getItem("gameCode");
let colors = ['red', 'blue', 'green', 'hotpink', 'purple', 'orange'];
let colorsRemaining = 6;

// Simulate the list of players, could be replaced with a dynamic list based on actual game data
let players = [
    { name: myNickname, crown: true, color: ''},
    { name: 'Kamala', crown: false, color: ''},
    { name: 'Joe', crown: false, color: '' },
    { name: 'Donald', crown: false, color: '' },
    { name: 'George', crown: false, color: ''},
    { name: 'Bernie', crown: false, color: ''}
];

// Function to render players dynamically
function renderPlayers() {
    document.getElementById('lobby-code').innerHTML = gameCode;
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = ''; // Clear the list before adding players
    let count = 0;

    players.forEach(player => {
        let li = document.createElement('li');
        let randInt = Math.floor(Math.random() * colorsRemaining);
        let playerColor = colors[randInt];
        colors.splice(randInt, 1);
        colorsRemaining--;
        players[count].color = playerColor;
        localStorage.setItem(`p${count}color`, playerColor);
        li.style.backgroundColor = playerColor;
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
