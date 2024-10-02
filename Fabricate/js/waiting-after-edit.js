// Retrieve and parse remainingTime from localStorage, default to 180
let timeRemaining = parseInt(localStorage.getItem('remainingTime'), 10) || 180;
const timerElement = document.getElementById('time-remaining');
const progressElement = document.getElementById('progress');
const playersContainer = document.getElementById('players');
const funTipElement = document.getElementById('fun-tip');

const players = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6', 'Player7'];
let currentPlayerIndex = 0;

// Fun tips array
const funTips = [
    "Did you know? Fake news spreads six times faster than the truth on social media.",
    "Tip: Always check the source of the news before sharing it.",
    "Fun Fact: The term 'fake news' has been around since the 1890s!",
    "Remember: If it sounds too good to be true, it probably is.",
    "Did you know? Images can be manipulated to create misleading narratives.",
    "Tip: Cross-reference news with reputable outlets.",
    "Fun Fact: Cognitive biases can make us more susceptible to fake news."
];

// Flag to prevent multiple redirects
let hasRedirected = false;

// Function to display random fun tips
function displayRandomTip() {
    const randomIndex = Math.floor(Math.random() * funTips.length);
    funTipElement.textContent = funTips[randomIndex];
}

// Display a fun tip every 5 seconds
setInterval(displayRandomTip, 5000);

// Initial tip display
displayRandomTip();

// Function to add players at random intervals
function addPlayerAtRandomInterval() {
    if (currentPlayerIndex < players.length && !hasRedirected) {
        const playerElement = document.createElement('div');
        playerElement.textContent = players[currentPlayerIndex];
        playerElement.classList.add('player');
        playerElement.style.color = getRandomColor();

        // Optional: Add avatar emojis
        const avatar = document.createElement('span');
        avatar.textContent = '👤 ';
        playerElement.prepend(avatar);

        playersContainer.appendChild(playerElement);

        currentPlayerIndex++;

        // Random interval between 1 and 3 seconds
        const randomInterval = Math.random() * 2000 + 1000;

        // If the last player has joined, transition to the next page with confetti
        if (currentPlayerIndex === players.length) {
            setTimeout(() => {
                if (!hasRedirected) {
                    hasRedirected = true;
                    localStorage.setItem('remainingTime', timeRemaining);  // Save the remaining time before redirect
                    triggerConfetti();
                    setTimeout(() => {
                        window.location.href = 'flag-articles.html'; // Proceed to the next game phase
                    }, 3000); // Delay to allow confetti animation
                }
            }, 1000); // Delay for dramatic effect before moving to the next page
        } else {
            setTimeout(addPlayerAtRandomInterval, randomInterval); // Recursively add the next player
        }
    }
}

// Generate random colors for players
function getRandomColor() {
    const colors = ['#FF1493', '#1E90FF', '#32CD32', '#FFD700', '#FFA500', '#8A2BE2', '#FF4500'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Start adding players at random intervals
addPlayerAtRandomInterval();

// Timer countdown
const countdown = setInterval(() => {
    timeRemaining--;
    timerElement.textContent = timeRemaining;
    const progressWidth = (timeRemaining / 180) * 100;
    progressElement.style.width = progressWidth + '%';

    if (timeRemaining <= 0) {
        clearInterval(countdown);
        if (!hasRedirected) {
            hasRedirected = true;
            alert('Time is up!');
            window.location.href = 'flag-articles.html';  // Automatically move to the next page if time is up
        }
    }
}, 1000);

// Confetti Animation Function
function triggerConfetti() {
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confettiCount = 300;
    const confetti = [];

    const colors = ['#FF1493', '#1E90FF', '#32CD32', '#FFD700', '#FFA500', '#8A2BE2', '#FF4500'];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
            tiltAngle: 0
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        for (let i = 0; i < confettiCount; i++) {
            const c = confetti[i];
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
            ctx.stroke();
        }
        updateConfetti();
    }

    let tiltAngle = 0;

    function updateConfetti() {
        tiltAngle += 0.1;
        for (let i = 0; i < confettiCount; i++) {
            const c = confetti[i];
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(tiltAngle - (i / 3)) * 15;

            if (c.y > confettiCanvas.height) {
                confetti[i] = {
                    x: Math.random() * confettiCanvas.width,
                    y: -20,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: c.tilt,
                    tiltAngleIncremental: c.tiltAngleIncremental,
                    tiltAngle: c.tiltAngle
                };
            }
        }
    }

    // Animation Loop
    const animationLoop = setInterval(drawConfetti, 16);

    // Stop confetti after 3 seconds
    setTimeout(() => {
        clearInterval(animationLoop);
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }, 3000);
}
