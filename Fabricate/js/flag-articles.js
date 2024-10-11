// flag-articles.js

document.addEventListener('DOMContentLoaded', () => {
    const TIME_TO_ENABLE_BUTTONS = 15; // seconds
    const TIME_PER_ARTICLE = 45; // seconds
    const TOTAL_VOTES = 7;

    let timeRemaining = TIME_PER_ARTICLE;
    const timerElement = document.getElementById('time-remaining');
    const timeProgressElement = document.getElementById('time-progress');
    const votesCountElement = document.getElementById('votes-count');
    const votesProgressElement = document.getElementById('votes-progress');
    const articleTitleElement = document.getElementById('article-title');
    const articleBlurbElement = document.getElementById('article-blurb');
    const articleImageElement = document.getElementById('article-image');
    const flagFakeBtn = document.getElementById('flag-fake');
    const flagRealBtn = document.getElementById('flag-real');
    const doneBtn = document.getElementById('done-btn');
    const userVoteElement = document.getElementById('user-vote');

    const dummyArticles = [
        { 
            title: 'Scientists Sequence DNA From 3,600-Year-Old Cheese', 
            blurb: 'A decade after its discovery in the Taklamakan Desert, paleogeneticists in China have extracted and sequenced DNA from cheese found in a Bronze Age grave. "This is why you should never sequence DNA when you’re hungry." stated Associate James Weiss.', 
            image: '/Fabricate/assets/CHEESE.jpg' // Ensure this path is correct
        },
        { 
            title: 'Michael Schumacher ‘seen’ in public for first time in 11 years', 
            blurb: 'Michael Schumacher has reportedly been seen in public for the first time in 11 years. The Formula 1 icon was reportedly present when daughter Gina married partner Iain Bethke over the weekend in Majorca.', 
            image: '/Fabricate/assets/SHOE.jpeg' // Ensure this path is correct
        },
        { 
            title: 'Vatican City Police Unveil New Unit Of Sin-Sniffing Dogs', 
            blurb: 'VATICAN CITY—In an effort to curb a rising number of immoral offenses, the Corps of Gendarmerie of Vatican City announced Friday the deployment of a new unit of highly trained sin-sniffing dogs. “This unit of elite K-9 officers has been taught to alert their handlers to sinful behavior by loudly barking and immediately engaging the impious subject in pursuit,” said a top official for the papal state’s police force', 
            image: '/Fabricate/assets/DOG.jpeg' // Ensure this path is correct
        }
    ];

    let currentArticleIndex = 0;
    let flaggedArticles = [];
    let countdownInterval;
    let voteTimeouts = [];
    let votesReceived = 0;
    let voteCompleted = false;
    let timerCompleted = false;
    let userHasVoted = false; // Track if the user has voted

    // Load the current article
    function loadArticle(index) {
        if (index >= dummyArticles.length) {
            // All articles have been flagged
            doneBtn.disabled = false;
            doneBtn.classList.remove('gray');
            doneBtn.classList.add('active');
            doneBtn.textContent = 'Done';
            return;
        }
        const article = dummyArticles[index];
        articleTitleElement.textContent = article.title;
        articleBlurbElement.textContent = article.blurb;
        articleImageElement.src = article.image; // Update the image source
        articleImageElement.alt = `Image for ${article.title}`; // Update the alt text for accessibility

        // Reset progress bars and counts
        resetProgressBars();

        // Reset user vote display
        resetUserVoteDisplay();

        // Disable flag buttons initially
        disableFlagButtons();

        // Start the 15-second disable timer
        setTimeout(() => {
            enableFlagButtons();
            // Start simulating votes
            simulateVotes();
        }, TIME_TO_ENABLE_BUTTONS * 1000);

        // Reset and start the countdown timer
        resetTimer();
        startCountdown();
    }

    // Disable flag buttons
    function disableFlagButtons() {
        flagFakeBtn.disabled = true;
        flagRealBtn.disabled = true;
        flagFakeBtn.classList.add('gray');
        flagRealBtn.classList.add('gray');
    }

    // Enable flag buttons
    function enableFlagButtons() {
        flagFakeBtn.disabled = false;
        flagRealBtn.disabled = false;
        flagFakeBtn.classList.remove('gray');
        flagRealBtn.classList.remove('gray');
        flagFakeBtn.classList.add('active');
        flagRealBtn.classList.add('active');
    }

    // Reset progress bars and vote count
    function resetProgressBars() {
        // Reset Timer Progress Bar
        timeRemaining = TIME_PER_ARTICLE;
        timerElement.textContent = timeRemaining;
        timeProgressElement.style.width = '100%';

        // Reset Votes Progress Bar
        votesReceived = 0;
        votesCountElement.textContent = votesReceived;
        votesProgressElement.style.width = '0%';
        voteCompleted = false;
        timerCompleted = false;

        // Clear any existing vote timeouts
        voteTimeouts.forEach(timeout => clearTimeout(timeout));
        voteTimeouts = [];
    }

    // Reset user vote display
    function resetUserVoteDisplay() {
        userVoteElement.textContent = '';
        userVoteElement.classList.remove('fake', 'real');
        userVoteElement.style.display = 'none';
        userHasVoted = false;
    }

    // Reset and start the countdown timer
    function resetTimer() {
        clearInterval(countdownInterval);
        timeRemaining = TIME_PER_ARTICLE;
        timerElement.textContent = timeRemaining;
        timeProgressElement.style.width = '100%';
    }

    function startCountdown() {
        countdownInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                timerElement.textContent = timeRemaining;

                // Update timer progress bar
                const progressWidth = (timeRemaining / TIME_PER_ARTICLE) * 100;
                timeProgressElement.style.width = `${progressWidth}%`;
            } else {
                clearInterval(countdownInterval);
                timerCompleted = true;
                checkAndProceed();
            }
        }, 1000);
    }

    // Simulate user votes
    function simulateVotes() {
        for (let i = 0; i < TOTAL_VOTES; i++) {
            // Random delay between 1 to (TIME_PER_ARTICLE - TIME_TO_ENABLE_BUTTONS) seconds
            const maxDelay = (TIME_PER_ARTICLE - TIME_TO_ENABLE_BUTTONS) * 1000;
            const delay = Math.floor(Math.random() * (maxDelay - 1000)) + 1000; // At least 1 second

            const timeout = setTimeout(() => {
                if (voteCompleted) return; // If already proceeding, do nothing
                votesReceived++;
                updateVotesProgress();

                if (votesReceived >= TOTAL_VOTES) {
                    voteCompleted = true;
                    checkAndProceed();
                }
            }, delay);
            voteTimeouts.push(timeout);
        }
    }

    // Update votes progress bar and count
    function updateVotesProgress() {
        votesCountElement.textContent = votesReceived;
        const progressWidth = (votesReceived / TOTAL_VOTES) * 100;
        votesProgressElement.style.width = `${progressWidth}%`;
    }

    // Check if it's time to proceed to the next article
    function checkAndProceed() {
        if (voteCompleted || timerCompleted) {
            proceedToNextArticle();
        }
    }

    // Proceed to the next article
    function proceedToNextArticle() {
        clearInterval(countdownInterval);
        // Clear any remaining vote timeouts
        voteTimeouts.forEach(timeout => clearTimeout(timeout));
        voteTimeouts = [];

        // Optionally, handle undecided flags
        if (!flaggedArticles.some(fa => fa.article === dummyArticles[currentArticleIndex])) {
            flaggedArticles.push({ article: dummyArticles[currentArticleIndex], flag: 'undecided' });
        }

        // Load the next article after a short delay for smooth transition
        setTimeout(() => {
            currentArticleIndex++;
            loadArticle(currentArticleIndex);
        }, 1000);
    }

    // Handle user vote
    function handleUserVote(flagType) {
        if (userHasVoted) return; // Prevent multiple votes

        userHasVoted = true;

        // Record the user's vote
        flaggedArticles.push({ article: dummyArticles[currentArticleIndex], flag: flagType });

        // Update the user vote display
        if (flagType === 'fake') {
            userVoteElement.textContent = 'You voted: Fake';
            userVoteElement.classList.add('fake');
        } else if (flagType === 'real') {
            userVoteElement.textContent = 'You voted: Real';
            userVoteElement.classList.add('real');
        }
        userVoteElement.style.display = 'block';

        // Disable the buttons after voting
        disableFlagButtons();
    }

    // Event listeners for flagging articles
    flagFakeBtn.addEventListener('click', function() {
        handleUserVote('fake');
        checkAndProceed(); // Let the timer or votes control the transition
    });

    flagRealBtn.addEventListener('click', function() {
        handleUserVote('real');
        checkAndProceed(); // Let the timer or votes control the transition
    });

    // Done button event listener
    doneBtn.addEventListener('click', function() {
        alert('You have completed flagging the articles.');

        // Save the flagged articles and remaining time if needed
        localStorage.setItem('flaggedArticles', JSON.stringify(flaggedArticles));
        localStorage.setItem('remainingTime', timeRemaining);
        redirectToWaitingScreen();
    });

    // Function to redirect back to the waiting screen
    function redirectToWaitingScreen() {
        localStorage.setItem("nextPage", "results");
        window.location.href = 'waiting.html';
    }

    // Load the first article on page load
    loadArticle(currentArticleIndex);
});
