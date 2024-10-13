// flag-articles.js

document.addEventListener('DOMContentLoaded', () => {
    const TIME_TO_ENABLE_BUTTONS = 10; // seconds
    const TIME_PER_ARTICLE = 45; // seconds
    const TOTAL_VOTES = 6;

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
    const p1VoteElement = document.getElementById('p1-vote');
    const p2VoteElement = document.getElementById('p2-vote');

    // Animated Titles Elements
    const discussTitle = document.getElementById('discuss-title');
    const votingTitle = document.getElementById('voting-title');

    let currentPlayer = 1;
    const p1Nickname = localStorage.getItem('p1Nickname');
    const p2Nickname = localStorage.getItem('p2Nickname');

    const dummyArticles = [
        {
            title: localStorage.getItem('brawlTitle'),
            blurb: localStorage.getItem('brawlContent'),
            image: '/Fabricate/assets/brawl.png',
            real: localStorage.getItem("brawlReal") == "true"
        },
        {
            title: localStorage.getItem('busTitle'),
            blurb: localStorage.getItem('busContent'),
            image: '/Fabricate/assets/bus.jpg',
            real: localStorage.getItem("busReal") == "true"
        },
        { 
            title: 'Man claiming to be the brother of Jesus arrested after wild pursuit', 
            blurb: 'A 30-year-old man, claiming to be the brother of Jesus, has been arrested for allegedly leading police on a wild pursuit through south-west Sydney.', 
            image: '/Fabricate/assets/arrested.jpg',
            real: false
        },
        { 
            title: localStorage.getItem('stonehengeTitle'),
            blurb: localStorage.getItem('stonehengeContent'),
            image: '/Fabricate/assets/stonehenge.jpg',
            real: localStorage.getItem("stonehengeReal") == "true"
        },
        { 
            title: localStorage.getItem('planeTitle'),
            blurb: localStorage.getItem('planeContent'),
            image: '/Fabricate/assets/plane.jpg',
            real: localStorage.getItem("planeReal") == "true"
        },
        { 
            title: "‘Be wary’: Aussie doctor exposes 'deadly' paracetamol contamination", 
            blurb: "Carcinogenic chemicals have been found in paracetamol in a Sydney pharmacy, which can catalyse deadly cancer cells.", 
            image: '/Fabricate/assets/pills.jpg',
            real: false
        },
    ];

    let currentArticleIndex = 0;
    let flaggedArticles = [];
    let countdownInterval;
    let voteTimeouts = [];
    let votesReceived = 0;
    let voteCompleted = false;
    let timerCompleted = false;
    let p1HasVoted = false;
    let p2HasVoted = false;
    let p1Score = 0;
    let p2Score = 0;

    // Load the current article
    function loadArticle(index) {
        if (index >= dummyArticles.length) {
            // All articles have been flagged
            doneBtn.disabled = false;
            doneBtn.classList.remove('gray');
            doneBtn.style.display = 'block';
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

        // Show "Discussion Phase" animated title
        showDiscussTitle();

        // Disable flag buttons initially
        disableFlagButtons();

        // Start the 15-second disable timer
        setTimeout(() => {
            // Hide "Discussion Phase" title
            hideDiscussTitle();

            // Show "Voting Phase" animated title
            showVotingTitle();

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
        currentPlayer = 1;
        p1VoteElement.textContent = '';
        p1VoteElement.classList.remove('fake', 'real');
        p1VoteElement.style.display = 'none';
        p2VoteElement.textContent = '';
        p2VoteElement.classList.remove('fake', 'real');
        p2VoteElement.style.display = 'none';
        p1HasVoted = false;
        p2HasVoted = false;
    }

    // Show "Discussion Phase" animated title
    function showDiscussTitle() {
        discussTitle.style.display = 'block';
        discussTitle.style.animationName = 'fadeInDown';
    }

    // Hide "Discussion Phase" animated title
    function hideDiscussTitle() {
        discussTitle.style.animationName = 'fadeOutUp';
        // Hide after animation completes (1s)
        setTimeout(() => {
            discussTitle.style.display = 'none';
        }, 1000);
    }

    // Show "Voting Phase" animated title
    function showVotingTitle() {
        votingTitle.style.display = 'block';
        votingTitle.style.animationName = 'fadeInUp';
        // Optionally, hide the voting title after some time
        setTimeout(() => {
            votingTitle.style.animationName = 'fadeOutDown';
            setTimeout(() => {
                votingTitle.style.display = 'none';
            }, 1000);
        }, 3000); // Show for 3 seconds
    }

    // Hide "Voting Phase" animated title (called manually if needed)
    function hideVotingTitle() {
        votingTitle.style.animationName = 'fadeOutDown';
        setTimeout(() => {
            votingTitle.style.display = 'none';
        }, 1000);
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
            const maxDelay = (TIME_PER_ARTICLE - TIME_TO_ENABLE_BUTTONS) * 500;
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

        // Hide "Voting Phase" title if it's still visible
        hideVotingTitle();

        // Load the next article after a short delay for smooth transition
        setTimeout(() => {
            currentArticleIndex++;
            loadArticle(currentArticleIndex);
        }, 1000);
    }

    // Handle user vote
    function handleUserVote(flagType) {
        if (p1HasVoted && p2HasVoted) return; // Prevent multiple votes

        // Record the user's vote
        flaggedArticles.push({ article: dummyArticles[currentArticleIndex], flag: flagType });

        // Update the user vote display
        if (flagType === 'fake') {
            if(currentPlayer == 1) {
                p1VoteElement.style.display = 'block';
                p1VoteElement.textContent = `${p1Nickname} voted: Fake`;
                p1VoteElement.classList.add('fake');
                if(!dummyArticles[currentArticleIndex].real) {
                    p1Score++;
                }
                alert(`Time for ${p2Nickname} to vote!`)
            } else {
                p2VoteElement.style.display = 'block';
                p2VoteElement.textContent = `${p2Nickname} voted: Fake`;
                p2VoteElement.classList.add('fake');
                if(!dummyArticles[currentArticleIndex].real) {
                    p2Score++;
                }
            }
        } else if (flagType === 'real') {
            if(currentPlayer == 1) {
                p1VoteElement.style.display = 'block';
                p1VoteElement.textContent = `${p1Nickname} voted: Real`;
                p1VoteElement.classList.add('real');
                alert(`Time for ${p2Nickname} to vote!`);
                if(dummyArticles[currentArticleIndex].real) {
                    p1Score++;
                }
            } else {
                p2VoteElement.style.display = 'block';
                p2VoteElement.textContent = `${p2Nickname} voted: Real`;
                p2VoteElement.classList.add('real');
                if(dummyArticles[currentArticleIndex].real) {
                    p2Score++;
                }
            }
        }

        if(currentPlayer == 1) {
            p1HasVoted = true;
            currentPlayer++;
        } else {
            p2HasVoted = true;
            disableFlagButtons();
        }
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
        // alert('You have completed flagging the articles.');

        // Save the flagged articles and remaining time if needed
        localStorage.setItem('flaggedArticles', JSON.stringify(flaggedArticles));
        localStorage.setItem('remainingTime', timeRemaining);
        redirectToWaitingScreen();
    });

    // Function to redirect back to the waiting screen
    function redirectToWaitingScreen() {
        localStorage.setItem("nextPage", "results");
        localStorage.setItem("p1Score", p1Score);
        localStorage.setItem("p2Score", p2Score);
        window.location.href = 'waiting.html';
    }

    // Load the first article on page load
    loadArticle(currentArticleIndex);
});
