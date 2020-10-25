let db = firebase.firestore();
const username = document.getElementById("username");

let otherObj = JSON.parse(sessionStorage.getItem("docId"))

username.innerHTML = otherObj.username;

function toMain() {
  window.location = `../mainPage/main.html`;
}

function toMap() {
  window.location = `../map/map.html`
}

function toEditProfile() {
  window.location = "../profile/editProfile/editProfile.html"
}