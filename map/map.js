function toProfile() {
  window.location = `../profile/profile.html`;
}

function toMain() {
  window.location = `../mainPage/main.html`;
}

let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");