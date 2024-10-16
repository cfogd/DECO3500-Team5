// choose-article.js

let selectedArticle = null;
let timeRemaining = 180; // Initial time in seconds
const timerElement = document.getElementById('time-remaining');
const progressElement = document.getElementById('progress');
const selectArticleBtn = document.getElementById('select-article-btn');
const editArticleModal = document.getElementById('edit-article-modal');
const closeEditModalBtn = document.getElementById('close-edit-modal');
const articleTitleInput = document.getElementById('article-title-input'); // Title input inside modal
const articleContentTextarea = document.getElementById('article-content-textarea'); // Content textarea inside modal
const editArticleForm = document.getElementById('edit-article-form'); // The form element
const currentPlayerElement = document.getElementById('currentPlayer');
let countdownInterval = null;
let currentPlayer = 1;
const p1Nickname = localStorage.getItem("p1Nickname");
const p2Nickname = localStorage.getItem("p2Nickname");
const p1Color = localStorage.getItem("p0color");
const p2Color = localStorage.getItem("p1color");
const a1Title = document.getElementById("a1Title");
const a1Content = document.getElementById("a1Content");
const a1Img = document.getElementById("a1Img");
const a2Title = document.getElementById("a2Title");
const a2Content = document.getElementById("a2Content");
const a2Img = document.getElementById("a2Img");
let p1UpdatedImg;
let p2UpdatedImg;
let p1Unedited;
let p2Unedited;

const articles = [
    { 
        title: "Viewers stunned by wild plane crash at Bathurst 1000", 
        content: 'The Bathurst 1000 has witnessed some truly bizarre scenes, with a pre-race plane landing going awry on the track, leaving viewers lost for words.', 
        image: '/Fabricate/assets/plane.jpg',
    },
    {
        title: 'Aussie researchers make groundbreaking Stonehenge discovery',
        content: 'Researchers analysed samples from the centre stone and discovered it actually originated from Scotland, some 750 kilometres away.',
        image: '/Fabricate/assets/stonehenge.jpg',
    }
]

// Load edited articles from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const editedArticles = JSON.parse(localStorage.getItem('editedArticles')) || {};

    // Iterate through edited articles and update the DOM
    // Since we don't want to change the main page's articles for the demo,
    // you can optionally remove this loop or keep it if you plan to use the data elsewhere.
    // For the demo, it's safe to keep it as it doesn't alter the main page.
    /*
    for (const [articleId, data] of Object.entries(editedArticles)) {
        const articleElement = document.getElementById(articleId);
        if (articleElement) {
            articleElement.querySelector('h2').textContent = data.title;
            articleElement.querySelector('p').textContent = data.content;
        }
    }
    */

    // Start the timer
    currentPlayerElement.textContent = p1Nickname;
    currentPlayerElement.style.color = p1Color;
    document.body.style.filter = 'blur(8px)';
    setTimeout(function() {
        alert(`Time for ${p1Nickname} to edit their article! Hide your screen!`);
    },10)
    setTimeout(function() {
        document.body.style.filter = '';
    },10)
    startTimer();
});

// Function to handle article selection
function selectArticle(articleId) {
    selectedArticle = articleId;

    if(currentPlayer == 1) {
        if(selectedArticle == 'article-1') { // If article 1 is selected, store unedited article 2
            localStorage.setItem("brawlTitle", a2Title.textContent);
            localStorage.setItem("brawlContent", a2Content.textContent);
            localStorage.setItem("brawlReal", true);
            localStorage.setItem("busReal", false);
            p1Unedited = "brawl";
        } else {
            localStorage.setItem("busTitle", a1Title.textContent);
            localStorage.setItem("busContent", a1Content.textContent);
            localStorage.setItem("busReal", true);
            localStorage.setItem("brawlReal", false);
            p1Unedited = "bus";
        }
    } else {
        if(selectedArticle == 'article-1') {
            localStorage.setItem("stonehengeTitle", a2Title.textContent);
            localStorage.setItem("stonehengeContent", a2Content.textContent);
            localStorage.setItem("stonehengeReal", true);
            localStorage.setItem("planeReal", false);
            p2Unedited = "stonehenge"
        } else {
            localStorage.setItem("planeTitle", a1Title.textContent);
            localStorage.setItem("planeContent", a1Content.textContent);
            localStorage.setItem("stonehengeReal", false);
            localStorage.setItem("planeReal", true);
            p2Unedited = "plane";
        }
    }

    // Remove active class from all articles
    document.querySelectorAll('.article-option').forEach(article => {
        article.classList.remove('active');
    });

    // Add active class to the selected article
    document.getElementById(articleId).classList.add('active');

    // Enable the "Select Article" button
    selectArticleBtn.disabled = false;
    selectArticleBtn.classList.remove('gray');
    selectArticleBtn.classList.add('active');
}

// Add click event listeners for articles
document.getElementById('article-1').addEventListener('click', () => selectArticle('article-1'));
document.getElementById('article-2').addEventListener('click', () => selectArticle('article-2'));

// Add click event listener for the "Select Article" button
selectArticleBtn.addEventListener('click', function() {
    if (selectedArticle) {
        const articleElement = document.getElementById(selectedArticle);

        // Extract title and content from the selected article's DOM
        const title = articleElement.querySelector('h2').textContent;
        const content = articleElement.querySelector('p').textContent;

        // Populate the modal with the selected article's data
        articleTitleInput.value = title;
        articleContentTextarea.value = content;

        // Show the modal
        editArticleModal.style.display = 'flex';

        // Pause the timer
        clearInterval(countdownInterval);
    }
});

// Function to start the timer
function startTimer() {
    countdownInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerElement.textContent = timeRemaining;

            // Update progress bar
            const progressWidth = (timeRemaining / 180) * 100;
            progressElement.style.width = progressWidth + '%';
        } else {
            clearInterval(countdownInterval);
            alert('Time is up! An article will be automatically selected for you.');
            // Handle the case where the time runs out (auto-select or redirect)
            autoSelectArticle();
        }
    }, 1000);
}

// Function to handle automatic article selection when time is up
function autoSelectArticle() {
    if (!selectedArticle) {
        // Automatically select the first article if none is selected
        selectArticle('article-1');
        selectArticleBtn.click();
    } else {
        // Proceed with the already selected article
        editArticleModal.style.display = 'flex';
    }
}

// Handle form submission
editArticleForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve updated values
    const updatedTitle = articleTitleInput.value.trim();
    const updatedContent = articleContentTextarea.value.trim();

    if(currentPlayer == 1) {
        if (p1Unedited == "brawl") {
            localStorage.setItem('busTitle', updatedTitle);
            localStorage.setItem('busContent', updatedContent);
        } else {
            localStorage.setItem('brawlTitle', updatedTitle);
            localStorage.setItem('brawlContent', updatedContent);
        }
    } else {
        if (p2Unedited == "stonehenge") {
            localStorage.setItem('planeTitle', updatedTitle);
            localStorage.setItem('planeContent', updatedContent);
        } else {
            localStorage.setItem('stonehengeTitle', updatedTitle);
            localStorage.setItem('stonehengeContent', updatedContent);
        }
    }

    // Basic validation
    if (updatedTitle === '' || updatedContent === '') {
        alert('Title and Content cannot be empty.');
        return;
    }

    // **Removed DOM modification to prevent changing the main page's articles**
    /*
    // Update the selected article's title and content in the DOM
    const articleElement = document.getElementById(selectedArticle);
    articleElement.querySelector('h2').textContent = updatedTitle;
    articleElement.querySelector('p').textContent = updatedContent;
    */

    // Save to localStorage (optional for the demo)
    const editedArticles = JSON.parse(localStorage.getItem('editedArticles')) || {};
    editedArticles[selectedArticle] = {
        title: updatedTitle,
        content: updatedContent
    };
    localStorage.setItem('editedArticles', JSON.stringify(editedArticles));

    // Hide the modal
    editArticleModal.style.display = 'none';

    // Resume the timer if there's remaining time
    if (timeRemaining > 0) {
        startTimer();
    }

    // Redirect to the first waiting page (waiting.html)
    localStorage.setItem("nextPage", "flag");
    if (currentPlayer == 1) {
        changePlayers();
    } else {
        window.location.href = 'waiting.html';
    }
});

function changePlayers() {
    document.body.style.filter = 'blur(8px)';
    setTimeout(function() {
        alert(`Time for ${p2Nickname} to edit their article! Hide your screen!`);
    },10)
    setTimeout(function() {
        document.body.style.filter = '';
    },10)
    currentPlayer++;
    currentPlayerElement.textContent = p2Nickname;
    currentPlayerElement.style.color = p2Color;

    a1Title.textContent = articles[0].title;
    a1Content.textContent = articles[0].content;
    a1Img.src = articles[0].image;

    a2Title.textContent = articles[1].title;
    a2Content.textContent = articles[1].content;
    a2Img.src = articles[1].image;

    timeRemaining = 180;
}

// Handle closing the modal when clicking the close button
closeEditModalBtn.addEventListener('click', function() {
    editArticleModal.style.display = 'none';

    // Resume the timer if there's remaining time
    if (timeRemaining > 0) {
        startTimer();
    }
});

// Close modal when clicking outside the content
window.addEventListener('click', function(event) {
    if (event.target === editArticleModal) {
        editArticleModal.style.display = 'none';

        // Resume the timer if there's remaining time
        if (timeRemaining > 0) {
            startTimer();
        }
    }
});
