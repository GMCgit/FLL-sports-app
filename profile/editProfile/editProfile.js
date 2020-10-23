let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");
document.getElementById("Username").innerHTML = `Username: ${sessionStorage.getItem("username")}`;
document.getElementById("Name").innerHTML = `Name: ${sessionStorage.getItem("name")}`;

function toMain() {
  window.location = `/mainPage/main.html`;
}

function toMap() {
  window.location = `/map/map.html`
}

function toProfile() {
    window.location = "/profile/profile.html"
}