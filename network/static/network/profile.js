import {
  editButtons,
  handleEditClick,
  likeButtons,
  handleLikeClick,
  // setupModal,
  // setupForm,
} from "./script.js";

likeButtons.forEach((button) =>
  button.addEventListener("click", handleLikeClick)
);
if (editButtons.length)
  editButtons.forEach((button) => {
    button.addEventListener("click", handleEditClick);
  });

// Update following/followers count when toggling "Follow" button
const followerCount = document.querySelector(".follower-count");
const toggleFollowButton = document.querySelector(".toggle-follow-button");

if (toggleFollowButton) {
  toggleFollowButton.addEventListener("click", handleToggleFollowClick);

  if (toggleFollowButton.id === "unfollow") {
    toggleFollowButton.addEventListener("mouseenter", handleUnfollowMouseOver);
    toggleFollowButton.addEventListener("mouseleave", handleUnfollowMouseLeave);
  }
}

function handleToggleFollowClick(e) {
  let username = e.currentTarget.getAttribute("value");
  fetch(`/profile/${username}/toggle_follow`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      // Update "Followers" count
      followerCount.textContent = data.viewed_user_followers;
    });

  let action = e.currentTarget.getAttribute("id");
  toggleFollowButton.setAttribute(
    "id",
    action === "follow" ? "unfollow" : "follow"
  );
  action = e.currentTarget.getAttribute("id");
  toggleFollowButton.textContent = action === "follow" ? "Follow" : "Following";

  if (action === "unfollow") {
    toggleFollowButton.addEventListener("mouseenter", handleUnfollowMouseOver);
    toggleFollowButton.addEventListener("mouseleave", handleUnfollowMouseLeave);
  } else {
    toggleFollowButton.removeEventListener(
      "mouseenter",
      handleUnfollowMouseOver
    );
    toggleFollowButton.removeEventListener(
      "mouseleave",
      handleUnfollowMouseLeave
    );
  }
}

function handleUnfollowMouseOver(e) {
  toggleFollowButton.textContent = "Unfollow";
}

function handleUnfollowMouseLeave(e) {
  toggleFollowButton.textContent = "Following";
}

// When "Set up profile" button is clicked show a profile setup pane
const setupButton = document.querySelector(".setup-profile");
const setupModal = document.querySelector(".setup-modal");
const setupForm = document.querySelector(".setup-form");

const handleOutsideClick = (e) => {
  if (e.target.getAttribute("class") === "setup-modal") {
    setupModal.classList.add("display-hide");
    setupForm.classList.add("display-hide");
    setupForm.querySelector("textarea").value = "";
    setupButton.classList.remove("display-hide");
    setupModal.removeEventListener("click", handleOutsideClick);
  }
};

const handleSetupClick = (e) => {
  if (setupModal.classList.contains("display-hide")) {
    setupButton.classList.add("display-hide");
    setupModal.classList.remove("display-hide");
    setupForm.classList.remove("display-hide");

    // Add EventListener to close setup modal when click is registered outside the form
    setupModal.addEventListener("click", handleOutsideClick);
  }
};

if (setupButton) {
  setupButton.addEventListener("click", handleSetupClick);
}
