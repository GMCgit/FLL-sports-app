let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

if (sessionStorage.getItem("DocName") == null || sessionStorage.getItem("username") == null || sessionStorage.getItem("pref") == null ||sessionStorage.getItem("admin") == null || sessionStorage.getItem("name") == null || sessionStorage.getItem("password") == null) {
  alert("Something went wrong.")
  localStorage.clear();
  sessionStorage.clear();
  window.location = "../index.html";
}

let pref = JSON.parse(sessionStorage.getItem("pref"));

if (pref.dark) {
  darkMode(true);
}

function darkMode(toDark) {
  if (toDark) {
    document.getElementById("friendsBg").classList.add("dark");
    document.getElementById("content").classList.add("darkTxt");
    document.getElementById("friends_list").classList.add("fbbgDark");
    document.getElementById("blocked_list").classList.add("fbbgDark");
    document.getElementById("friend_button").classList.add("darkTxt")
    document.getElementById("blocked_button").classList.add("darkTxt")
  } else {
    document.getElementById("friendsBg").classList.remove("dark");
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

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

function toProfile() {
  window.location = `../profile/profile.html`;
}

function toMap() {
  window.location = "../map/map.html";
}

function toAdmin() {
  window.location = "../adminPage/admin.html";
}

function toMain() {
  window.location = `../mainPage/main.html`;
}

let friendsO = {
  button: document.getElementById("friend_button"),
  text: document.getElementById("friends_list"),
};

let blockedO = {
  button: document.getElementById("blocked_button"),
  text: document.getElementById("blocked_list"),
};

db.collection("users")
  .doc(sessionStorage.getItem("DocName"))
  .get()
  .then((doc) => {
    let friends = doc.data().friends;
    let blocked = doc.data().blocked;

    friendsO.text.innerHTML = "<div class='text'>Friends:</div>";
    friends.forEach((m) => {
      db.collection("users")
        .doc(m)
        .get()
        .then((friendD) => {
          let child = document.createElement("button");
          child.innerHTML = friendD.data().username;
          child.classList.add("btn");
          if (pref.dark) {
            child.classList.add("btn-outline-primary");
          } else {
            child.classList.add("btn-outline-dark");
          }
          child.classList.add("button-others");
          child.value = friendD.id;
          child.data = friendD.data().name;
          child.onclick = function (e) {
            goToPerson(this);
          };
          friendsO.text.appendChild(child);
        });
    });

    blockedO.text.innerHTML = "<div class='text'>Blocked:</div>";
    blocked.forEach((m) => {
      db.collection("users")
        .doc(m)
        .get()
        .then((friendD) => {
          let child = document.createElement("button");
          child.innerHTML = friendD.data().username;
          child.classList.add("btn");

          if (pref.dark) {
            child.classList.add("btn-outline-primary");
          } else {
            child.classList.add("btn-outline-dark");
          }
          child.classList.add("button-others");
          child.value = friendD.id;
          child.data = friendD.data().name;
          child.onclick = function (e) {
            goToPerson(this);
          };
          blockedO.text.appendChild(child);
        });
    });
  });

if (sessionStorage.getItem("friend") == "true") {
  friends();
} else {
  blocked();
}

function blocked() {
  friendsO.button.classList.remove("btn-active");
  friendsO.button.classList.add("btn-unactive");
  blockedO.button.classList.add("btn-active");
  blockedO.button.classList.remove("btn-unactive");

  if (pref.dark) {
    friendsO.button.classList.remove("btn-active-dark");
    friendsO.button.classList.add("btn-unactive-dark");
    blockedO.button.classList.add("btn-active-dark");
    blockedO.button.classList.remove("btn-unactive-dark");
  }

  friendsO.text.classList.add("invis");
  blockedO.text.classList.remove("invis");

  sessionStorage.setItem("friend", false);
}

function friends() {
  friendsO.button.classList.add("btn-active");
  friendsO.button.classList.remove("btn-unactive");
  blockedO.button.classList.remove("btn-active");
  blockedO.button.classList.add("btn-unactive");

  if (pref.dark) {
    friendsO.button.classList.add("btn-active-dark");
    friendsO.button.classList.remove("btn-unactive-dark");
    blockedO.button.classList.remove("btn-active-dark");
    blockedO.button.classList.add("btn-unactive-dark");
  }

  friendsO.text.classList.remove("invis");
  blockedO.text.classList.add("invis");

  sessionStorage.setItem("friend", true);
}

function toChat() {
  window.location = "../chat/chat.html";
}
