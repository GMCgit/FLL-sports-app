let db = firebase.firestore();
const username = document.getElementById("username");

let otherObj = JSON.parse(sessionStorage.getItem("docId"));

username.innerHTML = sessionStorage.getItem("username");

let profile = document.getElementById("profile");

let otherUser_user = document.createElement("div");
otherUser_user.classList.add("text");
otherUser_user.innerHTML = `Username: ${otherObj.username}`;
profile.appendChild(otherUser_user);

let otherUser_name = document.createElement("div");
otherUser_name.classList.add("text");
otherUser_name.innerHTML = `Name: ${otherObj.name}`;
profile.appendChild(otherUser_name);

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
      let otherUser_bio= document.createElement("div");
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
