let nickname = "";

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

function create_game() {
    // clear local storage
    localStorage.clear();

    // Get nickname
    let nicknameInput = document.getElementById("join-nickname");
    nickname = nicknameInput.value;
    localStorage.setItem("nickname", nickname);
    
    // Redirect to the lobby.html page
    if (nickname) {
        window.location.href = 'lobby.html';
    } else {
        alert('Please enter a nickname.')
    }
}

function join_game() {
    // clear local storage
    localStorage.clear();

    // Get nickname
    let nicknameInput = document.getElementById("join-nickname");
    nickname = nicknameInput.value;
    localStorage.setItem("nickname", nickname);

    const gameCode = document.getElementById('game-code').value;

    if (nickname) {
        if (gameCode) {
            showNotification(`Joining game with code ${gameCode}...`);
            // Placeholder for joining game logic
            setTimeout(() => window.location.href = 'lobby.html', 2000);
        } else {
            alert('Please enter a game code.');
        }
    } else {
        alert('Please enter a nickname.')
    }
}

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

