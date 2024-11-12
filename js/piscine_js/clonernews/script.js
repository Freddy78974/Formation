const baseUrl = 'https://hacker-news.firebaseio.com/v0/';
let start = 0;
let n = 10;
let pageSelection = "topstories";
const loadedComments = {};
let fetchedStoryIds = [];
let timer;
const topStorie = document.querySelector("#topStorie");
const newStorie = document.querySelector("#newStorie");
const bestStorie = document.querySelector("#bestStorie");
const askStorie = document.querySelector("#askStorie");
const showStorie = document.querySelector("#showStorie");
const jobStorie = document.querySelector("#jobStorie");
// Check if the element is found before adding an event listener
topStorie.addEventListener("click", () => {
    const existingPosts = document.querySelectorAll('.post');
    existingPosts.forEach(post => post.remove());
    pageSelection = "topstories";
    console.log('top');
    fetchAndDisplayStories();
    resetButtonColors();
    topStorie.style.backgroundColor = "rgba(23, 23, 229, 0.1000)";
});
newStorie.addEventListener("click", () => {
    const existingPosts = document.querySelectorAll('.post');
    existingPosts.forEach(post => post.remove());
    pageSelection = "newstories";
    console.log('new');
    fetchAndDisplayStories();
    resetButtonColors();
    newStorie.style.backgroundColor = "rgba(23, 23, 229, 0.1000)";
});
bestStorie.addEventListener("click", () => {
    const existingPosts = document.querySelectorAll('.post');
    existingPosts.forEach(post => post.remove());
    pageSelection = "beststories";
    console.log('best');
    fetchAndDisplayStories();
    resetButtonColors();
    bestStorie.style.backgroundColor = "rgba(23, 23, 229, 0.1000)";
});
askStorie.addEventListener("click", () => {
    const existingPosts = document.querySelectorAll('.post');
    existingPosts.forEach(post => post.remove());
    pageSelection = "askstories";
    console.log('ask');
    fetchAndDisplayStories();
    resetButtonColors();
    askStorie.style.backgroundColor = "rgba(23, 23, 229, 0.1000)";
});
showStorie.addEventListener("click", () => {
    const existingPosts = document.querySelectorAll('.post');
    existingPosts.forEach(post => post.remove());
    pageSelection = "showstories";
    console.log('show');
    fetchAndDisplayStories();
    resetButtonColors();
    showStorie.style.backgroundColor = "rgba(23, 23, 229, 0.1000)";
});
jobStorie.addEventListener("click", () => {
    const existingPosts = document.querySelectorAll('.post');
    existingPosts.forEach(post => post.remove());
    pageSelection = "jobstories";
    console.log('job');
    fetchAndDisplayStories();
    resetButtonColors();
    jobStorie.style.backgroundColor = "rgba(23, 23, 229, 0.1000)";
});
function resetButtonColors() {
    // Reset background color for all buttons
    topStorie.style.backgroundColor = "rgba(23, 23, 229, 0.500)";
    newStorie.style.backgroundColor = "rgba(23, 23, 229, 0.500)";
    bestStorie.style.backgroundColor = "rgba(23, 23, 229, 0.500)";
    askStorie.style.backgroundColor = "rgba(23, 23, 229, 0.500)";
    showStorie.style.backgroundColor = "rgba(23, 23, 229, 0.500)";
    jobStorie.style.backgroundColor = "rgba(23, 23, 229, 0.500)";
}
function fetchTopStoriesID() {
    clearInterval(timer);
    document.querySelector(".container").style.display = "none";
    
    return fetch(`${baseUrl}/${pageSelection}.json`)
    .then(response => response.json());
}
function fetchAndDisplayStories() {
    return fetchTopStoriesID()
        .then(storyIds => {
            const newStoryIds = storyIds.slice(start, start + n);
            fetchedStoryIds = fetchedStoryIds.concat(newStoryIds);
            const storyPromises = newStoryIds.map(storyId =>
                fetch(`${baseUrl}item/${storyId}.json`).then(response => response.json())
            );
            return Promise.all(storyPromises);
        })
        .then(stories => {
            stories.forEach(story => {
                const storyElement = document.createElement('div');
                storyElement.className = 'post';
                storyElement.innerHTML = `
                    <a href="#" class="post-link" data-story-id="${story.id}">${story.title}</a>
                    <div class="naration">A ${story.type} by ${story.by}</div>
                    <div class="post-text">${story.text}</div>
                    <div class="comments">${story.descendants} Comments</div>
                `;
                document.body.appendChild(storyElement);
                const postLink = storyElement.querySelector('.post-link');
                postLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    const storyId = postLink.getAttribute('data-story-id');
                    if (!loadedComments[storyId]) {
                        loadComments(storyId, storyElement);
                        loadedComments[storyId] = true;
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function loadComments(postId, containerElement) {
    fetch(`${baseUrl}item/${postId}.json`)
        .then(response => response.json())
        .then(comment => {
            comment.kids.forEach(commentId => {
                fetch(`${baseUrl}item/${commentId}.json`)
                    .then(response => response.json())
                    .then(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.innerHTML = `
                            <div class="comment">${comment.text}</div>
                            <div class="commentOf">comment of ${comment.by}</div>
                        `;
                        containerElement.appendChild(commentElement);
                    })
                    .catch(error => {
                        console.error('Error fetching comment:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
}
window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        start += n;
        // Fetch and display more stories
        fetchAndDisplayStories();
    }
};
// Initial fetch and display
fetchAndDisplayStories();
async function fetchLatestID() {
    latestID = await fetch(`${baseUrl}/${pageSelection}.json`)
        .then(response => response.json())
        .then(newStoriesID_array => newStoriesID_array[0]);
    timer = setInterval(checkForUpdate, 5000);
}
async function checkForUpdate() {
    let latestID_updated = await fetch(`${baseUrl}/${pageSelection}.json`)
        .then(response => response.json())
        .then(newStoriesID_array => newStoriesID_array[0]);
    if (latestID_updated != latestID) {
        document.querySelector(".container").style.display = '';
    }
    console.log('updated')
}