import { likeButtons, handleLikeClick } from './script.js';
likeButtons.forEach(button => button.addEventListener('click', handleLikeClick));


// Update following/followers count when toggling "Follow" button
const followerCount = document.querySelector(".follower-count");
const toggleFollowButton = document.querySelector(".toggle-follow-button");

if (toggleFollowButton) {
    toggleFollowButton.addEventListener('click', handleToggleFollowClick);
    
    if (toggleFollowButton.id === "unfollow") {
        toggleFollowButton.addEventListener('mouseenter', handleUnfollowMouseOver);
        toggleFollowButton.addEventListener('mouseleave', handleUnfollowMouseLeave);
    }
}    

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