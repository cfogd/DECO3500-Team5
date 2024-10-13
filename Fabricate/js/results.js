// Assuming the results are coming from the game server or local data
const nickname = localStorage.getItem("nickname");
const score = localStorage.getItem("score");

const gameResults = {
    playerScore: score,
    mostDeceptive: { player: nickname, deceivedCount: 5 },
    bestDetective: { player: "Catherine", sortedCount: 9 },
    superPredictable: { player: "Zi", predictableCount: 4 },
    worstDetective: { player: "Matt", sortedCount: 2 }
};

// Fill in the results on the page
document.getElementById("player-score").textContent = gameResults.playerScore;

let mostDeceptivePlayer = document.getElementById("most-deceptive");
mostDeceptivePlayer.textContent = gameResults.mostDeceptive.player;
mostDeceptivePlayer.style.color = localStorage.getItem("p0color");
document.getElementById("deceptive-count").textContent = gameResults.mostDeceptive.deceivedCount;

let bestDetectivePlayer = document.getElementById("best-detective");
bestDetectivePlayer.textContent = gameResults.bestDetective.player;
bestDetectivePlayer.style.color = localStorage.getItem("p3color");
document.getElementById("detective-count").textContent = gameResults.bestDetective.sortedCount;

let superPredictablePlayer = document.getElementById("super-predictable");
superPredictablePlayer.textContent = gameResults.superPredictable.player;
superPredictablePlayer.style.color = localStorage.getItem("p1color");
document.getElementById("predictable-count").textContent = gameResults.superPredictable.predictableCount;

let worstDetectivePlayer = document.getElementById("worst-detective");
worstDetectivePlayer.textContent = gameResults.worstDetective.player;
worstDetectivePlayer.style.color = localStorage.getItem("p5color");
document.getElementById("worst-detective-count").textContent = gameResults.worstDetective.sortedCount;

// Dummy data representing the user's guesses for each article
const userGuesses = [
    { title: 'Article Title 6', guess: 'False News', correct: true },
    { title: 'Article Title 9', guess: 'Real News', correct: true },
    { title: 'Article Title 3', guess: 'Real News', correct: true },
    { title: 'Article Title 4', guess: 'Real News', correct: false },
    { title: 'Article Title 8', guess: 'Fake News', correct: true }
];

// Show the user's guesses in the modal
function showUserGuesses() {
    const guessesList = document.getElementById('guesses-list');
    guessesList.innerHTML = ''; // Clear existing guesses

    userGuesses.forEach((guess) => {
        const guessCard = document.createElement('div');
        guessCard.classList.add('guess-card');
        guessCard.classList.add(guess.correct ? 'green' : 'red');

        guessCard.innerHTML = `
            <h4>${guess.title}</h4>
            <p>You Guessed: ${guess.guess}</p>
        `;

        guessesList.appendChild(guessCard);
    });
}

// Event listener for opening the modal
document.getElementById('view-details-btn').addEventListener('click', function() {
    showUserGuesses();
    document.getElementById('details-modal').style.display = 'flex';  // Show the modal
});

// Event listener for closing the modal
document.getElementById('close-modal-btn').addEventListener('click', function() {
    document.getElementById('details-modal').style.display = 'none';  // Hide the modal
});

// Other buttons (play again, return to menu)
document.getElementById('play-again-btn').addEventListener('click', function() {
    // Clear remainingTime from localStorage
    localStorage.removeItem('remainingTime');
    
    // Redirect to the game lobby for a new game
    window.location.href = 'lobby.html';
});

document.getElementById('return-menu-btn').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirect back to the main menu
});
