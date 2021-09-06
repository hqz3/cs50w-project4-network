// Post submit button enabled only after user inputs text
const postBody = document.querySelector(".new-post-form textarea");
const postButton = document.querySelector(".submit-container input");

if (postBody) {
    postBody.addEventListener('keyup', handlePostBodyInput);
}

function handlePostBodyInput(e) {
    if (postBody.value === "") {
        postButton.disabled = true;
        postButton.style = "filter: opacity(50%)"
    }
    else {
        postButton.style = "filter: opacity(100%)"
        postButton.disabled = false;
    } 
}


// When user "likes" a post, update its "Like" count in the database
const likeButtons = document.querySelectorAll(".like-container");
likeButtons.forEach(button => button.addEventListener('click', handleLikeClick));

function handleLikeClick(e) {
    let postID = e.currentTarget.getAttribute('value');
    fetch(`post/${postID}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            let likeContainer = document.querySelector(`[value="${postID}"]`);
            let likeCount = likeContainer.querySelector(".like-count");
            likeCount.innerHTML = data.count;

            if (data.currently_liked) {
                likeContainer.setAttribute("id", "liked");
                likeContainer.title = "Unlike";
            }
            else {
                likeContainer.setAttribute("id", "not-liked");
                likeContainer.title = "Like";
            }
        })
}