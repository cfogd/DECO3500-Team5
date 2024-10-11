// flag-articles.js

let timeRemaining = parseInt(localStorage.getItem('remainingTime'), 10) || 120;
const timerElement = document.getElementById('time-remaining');
const progressElement = document.getElementById('progress');
const articleTitleElement = document.getElementById('article-title');
const articleBlurbElement = document.getElementById('article-blurb');
const articleImageElement = document.getElementById('article-image'); // Added this line
const flagFakeBtn = document.getElementById('flag-fake');
const flagRealBtn = document.getElementById('flag-real');
const doneBtn = document.getElementById('done-btn');

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

// Load the current article
function loadArticle(index) {
    if (index >= dummyArticles.length) {
        // All articles have been flagged
        doneBtn.disabled = false;
        doneBtn.classList.remove('gray');
        doneBtn.classList.add('active');  // Assuming .active has the enabled styles in CSS
        return;
    }
    const article = dummyArticles[index];
    articleTitleElement.textContent = article.title;
    articleBlurbElement.textContent = article.blurb;
    articleImageElement.src = article.image; // Update the image source
    articleImageElement.alt = `Image for ${article.title}`; // Update the alt text for accessibility
}

// Initialize with the first article
loadArticle(currentArticleIndex);

// Event listeners for flagging articles
flagFakeBtn.addEventListener('click', function() {
    flaggedArticles.push({ article: dummyArticles[currentArticleIndex], flag: 'fake' });
    loadNextArticle();
});

flagRealBtn.addEventListener('click', function() {
    flaggedArticles.push({ article: dummyArticles[currentArticleIndex], flag: 'real' });
    loadNextArticle();
});

// Load the next article or enable the Done button after the third article is flagged
function loadNextArticle() {
    currentArticleIndex++;
    if (currentArticleIndex < dummyArticles.length) {
        loadArticle(currentArticleIndex);
    } else {
        // After flagging all articles, enable the "Done" button
        doneBtn.disabled = false;
        doneBtn.classList.remove('gray');
        doneBtn.classList.add('active');  // Assuming .active has the enabled styles in CSS
    }
}

// Timer countdown function
const countdown = setInterval(() => {
    if (timeRemaining > 0) {
        timeRemaining--;
        timerElement.textContent = timeRemaining;

        // Update progress bar
        const progressWidth = (timeRemaining / 120) * 100;
        progressElement.style.width = progressWidth + '%';
    } else {
        clearInterval(countdown);
        alert('Time is up!');
        redirectToWaitingScreen();
    }
}, 1000);

// Done button event listener
doneBtn.addEventListener('click', function() {
    alert('You have completed flagging the articles.');

    // Save the remaining time and redirect to the waiting screen
    localStorage.setItem('remainingTime', timeRemaining);
    redirectToWaitingScreen();
});

// Function to redirect back to the waiting screen
function redirectToWaitingScreen() {
    localStorage.setItem("nextPage", "results");
    window.location.href = 'waiting.html';
}

// Optional: Save flagged articles to localStorage before redirecting
// This can be useful for displaying results on the waiting page
// Uncomment if needed
/*
window.addEventListener('beforeunload', function() {
    localStorage.setItem('flaggedArticles', JSON.stringify(flaggedArticles));
});
*/
