let p1Nickname = "";
let p2Nickname = "";
let gameCode = "";

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

function getRandomRoomId() {
    return Math.random().toString(36).substr(2, 8);
}

function create_game() {
    // clear local storage
    localStorage.clear();
    p1Nickname = document.getElementById("join-nickname-1").value;
    p2Nickname = document.getElementById("join-nickname-2").value;
    localStorage.setItem("p1Nickname", p1Nickname);
    localStorage.setItem("p2Nickname", p2Nickname);
    gameCode = getRandomRoomId();
    localStorage.setItem("isHost", true);
    localStorage.setItem("gameCode", gameCode);
    
    // Redirect to the lobby.html page
    if (p1Nickname && p2Nickname) {
        window.location.href = 'lobby.html';
    } else {
        alert('Please enter two Nicknames!')
    }
}

// function join_game() {
//     // clear local storage
//     localStorage.clear();

//     // Get nickname
//     let nicknameInput = document.getElementById("join-nickname");
//     nickname = nicknameInput.value;
//     localStorage.setItem("nickname", nickname);

//     gameCode = document.getElementById('game-code').value;
//     localStorage.setItem("isHost", false);
//     localStorage.setItem("nickname", nickname);
//     localStorage.setItem("gameCode", gameCode);

//     if (nickname) {
//         if (gameCode) {
//             showNotification(`Joining game with code ${gameCode}...`);
//             // Placeholder for joining game logic
//             setTimeout(() => window.location.href = 'lobby.html', 2000);
//         } else {
//             alert('Please enter a Game Code!');
//         }
//     } else {
//         alert('Please enter a Nickname!')
//     }
// }

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

