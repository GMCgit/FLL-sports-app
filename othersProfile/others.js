let db = firebase.firestore();
const username = document.getElementById("username");

let otherObj = JSON.parse(sessionStorage.getItem("docId"));

username.innerHTML = sessionStorage.getItem("username");

let profile = document.getElementById("profile");

let otherUser = document.createElement("div");
otherUser.classList.add("text");
otherUser.innerHTML = `Username: ${otherObj.username}`;
profile.appendChild(otherUser);

function toMain() {
  window.location = `../mainPage/main.html`;
}

function toMap() {
  window.location = `../map/map.html`;
}

function toProfile() {
  window.location = '../profile/profile.html'
}
