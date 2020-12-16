function toProfile() {
  window.location = `../profile/profile.html`;
}

function toMain() {
  window.location = `../mainPage/main.html`;
}

let pref = JSON.parse(sessionStorage.getItem("pref"));

if (pref.dark) {
  darkMode(true);
}

function darkMode(toDark) {
  if (toDark) {
    document.getElementById("mapBg").classList.add("dark");
    document.getElementById("content").classList.add("darkTxt");
  } else {
    document.getElementById("mapBg").classList.remove("dark");
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
  if (toDark) {
    document.getElementsByClassName("dropdown-menu")[0].classList.add("dark-bg")
    document.getElementsByClassName("dropdown-menu")[0].classList.add("darkTxt")
  }
}

let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

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

function place_suggestion() {
  if (
    document.getElementById("suggest_adress").value !== "" &&
    document.getElementById("suggest_name").value !== "" &&
    document.getElementById("suggest_sports").value !== ""
  ) {
    db.collection("map_suggestions").add({
      adress: document.getElementById("suggest_adress").value,
      name: document.getElementById("suggest_name").value,
      sports: document.getElementById("suggest_sports").value.split(" "),
      user_doc: sessionStorage.getItem("DocName"),
      user_name: sessionStorage.getItem("name"),
      comment: document.getElementById("suggest_comment").value,
    });
    alert("succes");
  } else {
    alert("you didn't fill all fields");
  }
}
