// When user "likes" a post, update its "Like" count in the database
const likeButtons = document.querySelectorAll(".like-container");
likeButtons.forEach(button => button.addEventListener('click', handleLikeClick));

function handleLikeClick(e) {
    let postID = e.currentTarget.getAttribute('value');
    fetch(`/post/${postID}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        let likeContainer = document.querySelector(`[value="${postID}"]`);
        let likeCount = likeContainer.querySelector(".like-count");
        likeCount.innerHTML = data.count;
        
        if (data.currently_liked) likeContainer.setAttribute("id", "liked");
        else likeContainer.setAttribute("id", "not-liked");
    })
}


const followerCount = document.querySelector(".follower-count");

const toggleFollowButton = document.querySelector(".toggle-follow-button");
if (toggleFollowButton.id === "unfollow") {
    toggleFollowButton.addEventListener('mouseenter', handleUnfollowMouseOver);
    toggleFollowButton.addEventListener('mouseleave', handleUnfollowMouseLeave);
}

toggleFollowButton.addEventListener('click', handleToggleFollowClick);

function handleToggleFollowClick(e) {
    let username = e.currentTarget.getAttribute('value');
    fetch(`/profile/${username}/toggle_follow`)
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        // Update "Followers" count
        followerCount.textContent = data.viewed_user_followers;
    })
    
    let action = e.currentTarget.getAttribute('id');
    toggleFollowButton.setAttribute('id', action === "follow" ? "unfollow" : "follow");
    action = e.currentTarget.getAttribute('id');
    toggleFollowButton.textContent = action === "follow" ? "Follow" : "Following";

    if (action === "unfollow") {
        toggleFollowButton.addEventListener('mouseenter', handleUnfollowMouseOver);
        toggleFollowButton.addEventListener('mouseleave', handleUnfollowMouseLeave);
    }
    else {
        toggleFollowButton.removeEventListener('mouseenter', handleUnfollowMouseOver);
        toggleFollowButton.removeEventListener('mouseleave', handleUnfollowMouseLeave);    
    }
    
}

function handleUnfollowMouseOver(e) {
    toggleFollowButton.textContent = "Unfollow";
}

function handleUnfollowMouseLeave(e) {
    toggleFollowButton.textContent = "Following";
}