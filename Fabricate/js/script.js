document.getElementById('create-game-btn').addEventListener('click', function() {
    // Clear remainingTime from localStorage
    localStorage.removeItem('remainingTime');
    
    // Redirect to the lobby.html page
    window.location.href = 'lobby.html';
});

document.getElementById('join-game-btn').addEventListener('click', function() {
    const gameCode = document.getElementById('game-code').value;
    if (gameCode) {
        // Placeholder for joining game logic
        alert('Joining game with code: ' + gameCode);
    } else {
        alert('Please enter a game code.');
    }
});

// Modal functionality
const modal = document.getElementById('how-to-play-modal');
const howToPlayLink = document.getElementById('how-to-play');
const closeModal = document.getElementById('close-modal');
if (closeModal) {
    closeModal.addEventListener('click', function() {
        const modal = document.getElementById('how-to-play-modal');
        modal.style.display = 'none'; // Hide the modal
    });
}
const backToHomeBtn = document.getElementById('back-to-home');

howToPlayLink.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'flex'; // Show the modal
});

closeModal.addEventListener('click', function() {
    modal.style.display = 'none'; // Hide the modal
});

backToHomeBtn.addEventListener('click', function() {
    modal.style.display = 'none'; // Hide the modal
});

// Close modal when clicking outside the content
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

document.getElementById('how-to-play').addEventListener('click', function(e) {
    e.preventDefault();
    const modal = document.getElementById('how-to-play-modal');
    modal.style.display = 'flex'; // Show the modal
});

