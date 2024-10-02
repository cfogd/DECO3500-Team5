// Assuming the results are coming from the game server or local data
const gameResults = {
    mostDeceptive: { player: "Player1", deceivedCount: 5 },
    bestDetective: { player: "Player5", sortedCount: 9 },
    superPredictable: { player: "Player5" },
    worstDetective: { player: "Player2", sortedCount: 2 }
};

// Fill in the results on the page
document.getElementById("most-deceptive").textContent = gameResults.mostDeceptive.player;
document.getElementById("deceptive-count").textContent = gameResults.mostDeceptive.deceivedCount;

document.getElementById("best-detective").textContent = gameResults.bestDetective.player;
document.getElementById("detective-count").textContent = gameResults.bestDetective.sortedCount;

document.getElementById("super-predictable").textContent = gameResults.superPredictable.player;

document.getElementById("worst-detective").textContent = gameResults.worstDetective.player;
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
