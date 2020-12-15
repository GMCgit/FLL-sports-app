let db = firebase.firestore();
const username = document.getElementById("username");

if (sessionStorage.getItem("bio") !== "undefined") {
  document.getElementById("Biography").innerHTML = sessionStorage.getItem(
    "bio"
  );
}

let pref = JSON.parse(sessionStorage.getItem("pref"));

if (pref.dark) {
  darkMode(true);
}

function darkMode(toDark) {
  if (toDark) {
    document.getElementById("profileBg").classList.add("dark");
    document.getElementById("content").classList.add("darkTxt");
  } else {
    document.getElementById("profileBg").classList.remove("dark");
    document.getElementById("content").classList.remove("darkTxt");
  }

  if (toDark) {
    document.getElementById("navbar").classList.remove("navbar-light");
    document.getElementById("navbar").classList.remove("bg-light");
    document.getElementById("navbar").classList.add("navbar-dark");
    document.getElementById("navbar").classList.add("bg-dark");
  } else {
    document.getElementById("navbar").classList.remove("navbar-dark");
    document.getElementById("navbar").classList.remove("bg-dark");
    document.getElementById("navbar").classList.add("navbar-light");
    document.getElementById("navbar").classList.add("bg-light");
  }
}

username.innerHTML = sessionStorage.getItem("username");
document.getElementById(
  "Username"
).innerHTML = `Username: ${sessionStorage.getItem("username")}`;
document.getElementById("Name").innerHTML = `Name: ${sessionStorage.getItem(
  "name"
)}`;

function toMain() {
  window.location = `../mainPage/main.html`;
}

function toMap() {
  window.location = `../map/map.html`;
}

function signOut() {
  localStorage.clear();
  sessionStorage.clear();
  window.location = "../index.html";
}

function toEditProfile() {
  window.location = "../profile/editProfile/editProfile.html";
}
function toFriends() {
  alert("ne radi nis jos");
}

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

function toAdmin() {
  window.location = "../adminPage/admin.html";
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function toChat() {
  window.location = "../chat/chat.html";
}

function toSettings() {
  window.location = "../settings/settings.html";
}
