const postBody = document.querySelector(".new-post-form textarea");
const postButton = document.querySelector(".submit-container input");
if (postBody) postBody.addEventListener("keyup", handlePostBodyInput);

// Post submit button enabled after user inputs text
function handlePostBodyInput(e) {
  if (postBody.value === "") {
    postButton.disabled = true;
    postButton.style = "filter: opacity(50%)";
  } else {
    postButton.style = "filter: opacity(100%)";
    postButton.disabled = false;
  }
}

// Toggling edit buttons
export const editButtons = document.querySelectorAll(".edit");
if (editButtons.length)
  editButtons.forEach((button) => {
    button.addEventListener("click", handleEditClick);
  });

export async function handleEditClick(e) {
  let postID = e.currentTarget.dataset.postId;
  let postBody = document.querySelector(`div[data-post-id="${postID}"]`);
  let originalPost = postBody.querySelector(".original-post");
  let editForm = postBody.querySelector(".edit-form");
  let saveButton = editForm.querySelector(".save-button");
  if (postBody.dataset.status === "close") {
    originalPost.classList.add("display-hide");
    editForm.classList.remove("display-hide");
    postBody.dataset.status = "open";
    // Add eventListener for "Save button"
    saveButton.addEventListener("click", handleSaveClick);
  } else {
    originalPost.classList.remove("display-hide");
    editForm.classList.add("display-hide");
    // Reset the edit form's textarea
    editForm.querySelector("textarea").value = originalPost.textContent;
    postBody.dataset.status = "close";
    // Remove eventListener for "Save button"
    saveButton.removeEventListener("click", handleSaveClick);
  }
}

// Save edited post into database
async function handleSaveClick(e) {
  e.preventDefault();
  let postID = e.currentTarget.dataset.postId;
  let postBody = document.querySelector(`div[data-post-id="${postID}"]`);
  let content = postBody.querySelector("textarea").value;

  let response = await fetch(`/edit-post/${postID}`, {
    method: "PUT",
    body: JSON.stringify({ content: content }),
  });
  let data = await response.json();

  // Update original post shown on webpage
  let originalPost = postBody.querySelector(".original-post");
  originalPost.textContent = data.content;

  // Hide edit form and show updated post
  let editForm = postBody.querySelector(".edit-form");
  editForm.classList.add("display-hide");
  originalPost.classList.remove("display-hide");
  postBody.dataset.status = "close";
}

// When user "likes" a post, update its "Like" count in database
export const likeButtons = document.querySelectorAll(".like-container");
likeButtons.forEach((button) =>
  button.addEventListener("click", handleLikeClick)
);

export function handleLikeClick(e) {
  let postID = e.currentTarget.getAttribute("value");
  fetch(`/post/${postID}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      let likeContainer = document.querySelector(`[value="${postID}"]`);
      let likeCount = likeContainer.querySelector(".like-count");
      likeCount.innerHTML = data.count;

      if (data.currently_liked) {
        likeContainer.setAttribute("id", "liked");
        likeContainer.title = "Unlike";
      } else {
        likeContainer.setAttribute("id", "not-liked");
        likeContainer.title = "Like";
      }
    });
}
