let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

function toProfile() {
  window.location = `../profile/profile.html`;
}
