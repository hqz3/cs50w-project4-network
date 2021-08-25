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

            if (data.currently_liked) likeContainer.style = "color: crimson; border-color: crimson"
            else likeContainer.style = "color: black"
        })
}