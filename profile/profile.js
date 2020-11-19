let db = firebase.firestore();
const username = document.getElementById("username");

if (sessionStorage.getItem("bio") !== "undefined") {
  document.getElementById("Biography").innerHTML = sessionStorage.getItem("bio");
}

username.innerHTML = sessionStorage.getItem("username");
document.getElementById("Username").innerHTML = `Username: ${sessionStorage.getItem("username")}`;
document.getElementById("Name").innerHTML = `Name: ${sessionStorage.getItem("name")}`;

function toMain() {
  window.location = `../mainPage/main.html`;
}

function toMap() {
  window.location = `../map/map.html`
}

function signOut() {
  localStorage.clear();
  sessionStorage.clear();
  window.location = "../index.html";
}

function toEditProfile() {
  window.location = "../profile/editProfile/editProfile.html"
}
function toFriends() {
  alert("ne radi nis jos")
}

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

function toAdmin() {
  window.location = "../adminPage/admin.html";
}