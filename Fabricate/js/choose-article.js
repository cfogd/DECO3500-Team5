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
let countdownInterval = null;

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
    startTimer();
});

// Function to handle article selection
function selectArticle(articleId) {
    selectedArticle = articleId;

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
    window.location.href = 'waiting.html';
});

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
