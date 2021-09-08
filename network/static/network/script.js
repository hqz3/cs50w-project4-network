const postBody = document.querySelector(".new-post-form textarea");
const postButton = document.querySelector(".submit-container input");
if (postBody) postBody.addEventListener('keyup', handlePostBodyInput);

// Post submit button enabled only after user inputs text
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

// Toggling edit buttons
const editButtons = document.querySelectorAll(".edit");
if (editButtons.length) editButtons.forEach(button => {
    button.addEventListener('click', handleEditClick);
})

async function handleEditClick(e) {
    let postID = e.currentTarget.dataset.postId;
    let postBody = document.querySelector(`div[data-post-id="${postID}"]`);
    let originalPost = postBody.querySelector(".original-post");
    let editForm = postBody.querySelector(".edit-form");
    
    if (e.currentTarget.dataset.status === 'close') {
        // let response = await fetch(`/edit-post/${postID}`);
        // let data = await response.json();

        originalPost.classList.add("display-hide");
        editForm.classList.remove("display-hide");
        e.currentTarget.dataset.status = 'open';
    }
    else {
        originalPost.classList.remove("display-hide")
        editForm.classList.add("display-hide");
        e.currentTarget.dataset.status = 'close';
    }

}


// When user "likes" a post, update its "Like" count in the database
export const likeButtons = document.querySelectorAll(".like-container");
likeButtons.forEach(button => button.addEventListener('click', handleLikeClick));

export function handleLikeClick(e) {
    let postID = e.currentTarget.getAttribute('value');
    fetch(`/post/${postID}`)
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