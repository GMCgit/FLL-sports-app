let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

db.collection("admins")
  .doc(sessionStorage.getItem("DocName"))
  .get()
  .then((doc) => {
    if (doc.data().username !== sessionStorage.getItem("username")) {
      window.location = "../mainPage/main.html";
    } else if (doc.data().password !== sessionStorage.getItem("password")) {
      window.location = "../mainPage/main.html";
    }
  }).catch((err) => {
    window.location = "../mainPage/main.html";
  });

function toProfile() {
  window.location = `../profile/profile.html`;
}

function toMap() {
  window.location = "../map/map.html";
}

function toMain() {
  window.location = `../mainPage/main.html`;
}
