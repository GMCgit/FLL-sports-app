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

db.collection("users")
  .doc(sessionStorage.getItem("DocName"))
  .get()
  .then((doc) => {
    if (doc.data().inMatch == true) {
      document.getElementById("inMatch").classList.remove("invis");

      let stuff = JSON.parse(sessionStorage.getItem('fieldData'));

      document.getElementById("inMatchName").innerHTML = stuff.name
      document.getElementById("inMatchSport").innerHTML = stuff.sport

    } else {
      document.getElementById("inMatch").classList.add("invis");
    }
  });