if (sessionStorage.getItem("DocName") == null || sessionStorage.getItem("username") == null || sessionStorage.getItem("pref") == null ||sessionStorage.getItem("admin") == null || sessionStorage.getItem("name") == null || sessionStorage.getItem("password") == null) {
  alert("Something went wrong.")
  localStorage.clear();
  sessionStorage.clear();
  window.location = "../index.html";
}

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

function toChat() {
  window.location = "../chat/chat.html"
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
    sessionStorage.setItem("pref", JSON.stringify(pref))
  } else {
    pref.dark = false;
    db.collection("users")
      .doc(sessionStorage.getItem("DocName"))
      .update({
        pref: JSON.stringify(pref),
      });
    darkMode(false)
    sessionStorage.setItem("pref", JSON.stringify(pref))
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
  if (toDark) {
    document
      .getElementsByClassName("dropdown-menu")[0]
      .classList.add("dark-bg");
    document
      .getElementsByClassName("dropdown-menu")[0]
      .classList.add("darkTxt");
  }
}