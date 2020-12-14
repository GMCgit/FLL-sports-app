let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

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
          child.classList.add("btn-outline-dark");
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
          child.classList.add("btn-outline-dark");
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

  friendsO.text.classList.add("invis");
  blockedO.text.classList.remove("invis");

  sessionStorage.setItem("friend", false);
}

function friends() {
  friendsO.button.classList.add("btn-active");
  friendsO.button.classList.remove("btn-unactive");
  blockedO.button.classList.remove("btn-active");
  blockedO.button.classList.add("btn-unactive");

  friendsO.text.classList.remove("invis");
  blockedO.text.classList.add("invis");

  sessionStorage.setItem("friend", true);
}

function toChat() {
  window.location = "../chat/chat.html";
}