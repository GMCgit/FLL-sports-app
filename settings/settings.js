let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

let pref = JSON.parse(sessionStorage.getItem("pref"));

if (pref.dark) {
  document.getElementById("darkCheck").click();
}

function toMain() {
  window.location = `../mainPage/main.html`;
}

function toMap() {
  window.location = `../map/map.html`;
}

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

function toAdmin() {
  window.location = "../adminPage/admin.html";
}

function toProfile() {
  window.location = "../profile/profile.html";
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function changed(el) {
  if (el.checked) {
    pref.dark = true;
    db.collection("users")
      .doc(sessionStorage.getItem("DocName"))
      .update({
        pref: JSON.stringify(pref),
      });
    darkMode(true);
  } else {
    pref.dark = false;
    db.collection("users")
      .doc(sessionStorage.getItem("DocName"))
      .update({
        pref: JSON.stringify(pref),
      });
    darkMode(false)
  }
}

function darkMode(toDark) {
  if (toDark) {
    document.getElementById("settingsBg").classList.add("dark");
    document.getElementById("settings").classList.add("darkTxt");
  } else {
    document.getElementById("settingsBg").classList.remove("dark");
    document.getElementById("settings").classList.remove("darkTxt");
  }
}