// When user "likes" a post, update its "Like" count in the database
const likeButtons = document.querySelectorAll(".like-container");
likeButtons.forEach(button => button.addEventListener('click', handleLikeClick));

function handleLikeClick(e) {
    let postID = e.currentTarget.getAttribute('value');
    fetch(`post/${postID}`)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log(error))
}