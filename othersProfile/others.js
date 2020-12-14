let db = firebase.firestore();
const username = document.getElementById("username");

let otherObj = JSON.parse(sessionStorage.getItem("docId"));

if (otherObj.name == "") {
  db.collection("users")
    .doc(otherObj.docId)
    .get()
    .then((q) => {
      let otherUser_name = document.createElement("div");
      otherUser_name.classList.add("text");
      otherUser_name.innerHTML = `Name: ${q.data().name}`;
      profile.appendChild(otherUser_name);
    });
}

username.innerHTML = sessionStorage.getItem("username");

let profile = document.getElementById("profileText");

let otherUser_user = document.createElement("div");
otherUser_user.classList.add("text");
otherUser_user.innerHTML = `Username: ${otherObj.username}`;
profile.appendChild(otherUser_user);

if (otherObj.name != "") {
  let otherUser_name = document.createElement("div");
  otherUser_name.classList.add("text");
  otherUser_name.innerHTML = `Name: ${otherObj.name}`;
  profile.appendChild(otherUser_name);
}

db.collection("users")
  .doc(JSON.parse(sessionStorage.getItem("docId")).docId)
  .get()
  .then((q) => {
    let age = q.data().age;
    let sport = q.data().favourite_sports;
    let bio = q.data().biography;
    if (age !== undefined) {
      let otherUser_age = document.createElement("div");
      otherUser_age.classList.add("text");
      otherUser_age.innerHTML = `Age: ${age}`;
      profile.appendChild(otherUser_age);
    }
    if (sport !== undefined) {
      let otherUser_sport = document.createElement("div");
      otherUser_sport.classList.add("text");
      otherUser_sport.innerHTML = `Favourite sport: ${sport}`;
      profile.appendChild(otherUser_sport);
    }
    if (bio !== undefined) {
      let otherUser_bio = document.createElement("div");
      otherUser_bio.classList.add("text");
      otherUser_bio.innerHTML = `Biography: ${bio}`;
      profile.appendChild(otherUser_bio);
    }
  });

function toMain() {
  window.location = `../mainPage/main.html`;
}

function toMap() {
  window.location = `../map/map.html`;
}

function toProfile() {
  window.location = "../profile/profile.html";
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

function addFriend() {
  if (
    JSON.parse(sessionStorage.getItem("docId")).docId !=
    sessionStorage.getItem("DocName")
  ) {
    db.collection("users")
      .doc(sessionStorage.getItem("DocName"))
      .get()
      .then((check) => {
        let arr = check.data().blocked;
        if (arr.includes(JSON.parse(sessionStorage.getItem("docId")).docId)) {
          alert("no");
        } else {
          db.collection("users")
            .doc(sessionStorage.getItem("DocName"))
            .update({
              friends: firebase.firestore.FieldValue.arrayUnion(
                JSON.parse(sessionStorage.getItem("docId")).docId
              ),
            });
          document.getElementById("addFriend").classList.add("invis");
          document.getElementById("removeFriend").classList.remove("invis");
          alert(
            JSON.parse(sessionStorage.getItem("docId")).username +
              " is now your friend"
          );
        }
      });
  } else {
    alert("no");
  }
}

function removeFriend() {
  db.collection("users")
    .doc(sessionStorage.getItem("DocName"))
    .update({
      friends: firebase.firestore.FieldValue.arrayRemove(
        JSON.parse(sessionStorage.getItem("docId")).docId
      ),
    });
  document.getElementById("addFriend").classList.remove("invis");
  document.getElementById("removeFriend").classList.add("invis");
  alert(
    JSON.parse(sessionStorage.getItem("docId")).username + " is not your friend"
  );
}

function addBlocked() {
  if (
    JSON.parse(sessionStorage.getItem("docId")).docId !=
    sessionStorage.getItem("DocName")
  ) {
    db.collection("users")
      .doc(sessionStorage.getItem("DocName"))
      .get()
      .then((check) => {
        let arr = check.data().friends;
        if (arr.includes(JSON.parse(sessionStorage.getItem("docId")).docId)) {
          alert("no");
        } else {
          db.collection("users")
            .doc(sessionStorage.getItem("DocName"))
            .update({
              blocked: firebase.firestore.FieldValue.arrayUnion(
                JSON.parse(sessionStorage.getItem("docId")).docId
              ),
            });
          document.getElementById("addBlocked").classList.add("invis");
          document.getElementById("removeBlocked").classList.remove("invis");
          alert(
            JSON.parse(sessionStorage.getItem("docId")).username +
              " is now blocked"
          );
        }
      });
  } else {
    alert("no");
  }
}

function removeBlocked() {
  db.collection("users")
    .doc(sessionStorage.getItem("DocName"))
    .update({
      blocked: firebase.firestore.FieldValue.arrayRemove(
        JSON.parse(sessionStorage.getItem("docId")).docId
      ),
    });
  document.getElementById("addBlocked").classList.remove("invis");
  document.getElementById("removeBlocked").classList.add("invis");
  alert(
    JSON.parse(sessionStorage.getItem("docId")).username + " is now unblocked"
  );
}

db.collection("users")
  .doc(sessionStorage.getItem("DocName"))
  .get()
  .then((check) => {
    let arr = check.data().blocked;
    if (arr.includes(JSON.parse(sessionStorage.getItem("docId")).docId)) {
      document.getElementById("addBlocked").classList.add("invis");
      document.getElementById("removeBlocked").classList.remove("invis");
    }
    arr = check.data().friends;
    if (arr.includes(JSON.parse(sessionStorage.getItem("docId")).docId)) {
      document.getElementById("addFriend").classList.add("invis");
      document.getElementById("removeFriend").classList.remove("invis");
    }
  });
