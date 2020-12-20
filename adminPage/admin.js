let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

db.collection("admins")
  .doc(sessionStorage.getItem("DocName"))
  .get()
  .catch(function(error) {
    alert("something is wrong")
    window.location = "../mainPage/main.html";
  })
  .then((doc) => {
    if (doc.data().username !== sessionStorage.getItem("username")) {
      window.location = "../mainPage/main.html";
    } else if (doc.data().password !== sessionStorage.getItem("password")) {
      window.location = "../mainPage/main.html";
    }
  })
  .catch(function(error) {
    window.location = "../mainPage/main.html";
  });

function toChat() {
  window.location = "../chat/chat.html";
}

let pref = JSON.parse(sessionStorage.getItem("pref"));

if (pref.dark) {
  darkMode(true);
}

function darkMode(toDark) {
  if (toDark) {
    document.getElementById("adminBG").classList.add("dark");
    document.getElementById("content").classList.add("darkTxt");
  } else {
    document.getElementById("adminBG").classList.remove("dark");
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
    document
      .getElementsByClassName("dropdown-menu")[0]
      .classList.add("dark-bg");
    document
      .getElementsByClassName("dropdown-menu")[0]
      .classList.add("darkTxt");
  }
}

db.collection("users")
  .get()
  .then((querySearch) => {
    let counter = 0;
    let adminCounter = 0;
    querySearch.forEach((doc) => {
      counter++;
    });
    db.collection("admins")
      .get()
      .then((q) => {
        q.forEach((doc2) => {
          adminCounter++;
        });
      })
      .then(() => {
        document.getElementById(
          "userCount"
        ).innerHTML = `There are <div class="userCount">${counter}</div> users and <div class="userCount">${adminCounter}</div> admins`;
      });
  });

let object = document.getElementById("location-suggestions");
db.collection("map_suggestions")
  .get()
  .then((querySearch) => {
    querySearch.forEach((doc) => {
      if (doc.id != "Gdje je dugi spoj?") {
        let child = document.createElement("button");
        child.innerHTML = doc.data().name;
        child.className = "btn btn-outline-info";
        child.style = "font-weight: bold;";
        child.onclick = function () {
          sessionStorage.setItem("suggestion-doc_id", doc.id);
          window.location =
            "../adminPage/user-suggested-field/user-suggested-field.html";
        };
        object.appendChild(child);
      }
    });
  });

let sport_object = document.getElementById("sport-suggestion");
db.collection("sport_suggestions")
  .get()
  .then((querySearch) => {
    querySearch.forEach((doc) => {
      if (doc.id != "ππππππππππππππππππππππππππππππππππππππππππππππππππ") {
        let child = document.createElement("button");
        child.innerHTML = doc.data().name;
        child.className = "btn btn-outline-info";
        child.style = "font-weight: bold;";
        child.onclick = function () {
          sessionStorage.setItem("suggestion-doc-id", doc.id);
          window.location =
            "../adminPage/user-suggested-sport/user-suggested-sport.html";
        };
        sport_object.appendChild(child);
      }
    });
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

function newField() {
  let lng = document.getElementById("lng");
  let lat = document.getElementById("lat");
  let name = document.getElementById("name");
  let sport = document.getElementById("sport");

  if (
    lng.value !== "" &&
    lat.value !== "" &&
    name.value !== "" &&
    Number.parseFloat(lng.value) < 180 &&
    Number.parseFloat(lng.value) > -180 &&
    Number.parseFloat(lat.value) < 90 &&
    Number.parseFloat(lat.value) > -90
  ) {
    db.collection("fields").add({
      name: name.value,
      position: JSON.stringify({
        lat: Number.parseFloat(lat.value),
        lng: Number.parseFloat(lng.value),
      }),
      Sport: sport.value,
      easy: [],
      medium: [],
      hard: [],
    });
    lng.value = "";
    lat.value = "";
    name.value = "";
    sport.value = "";
  } else {
    alert("You need to input all the data correctly");
  }
}

function assignAdmin() {
  let user = document.getElementById("usernameIn");
  let password = document.getElementById("password");

  if (user.value !== "" && password.value !== "") {
    db.collection("users")
      .get()
      .then((querySearch) => {
        querySearch.forEach((doc) => {
          if (
            doc.data().username == user.value &&
            doc.data().password == password.value
          ) {
            db.collection("admins").doc(doc.id).set({
              username: doc.data().username,
              password: doc.data().password,
              name: doc.data().name,
            });
          }
        });
      });
  } else {
    alert("You have to input everything");
  }
}

function removeAdmin() {
  let user = document.getElementById("usernameIn");
  let password = document.getElementById("password");
  if (user.value !== "" && password.value !== "") {
    db.collection("admins")
      .get()
      .then((querySearch) => {
        querySearch.forEach((doc) => {
          if (
            doc.data().username == user.value &&
            doc.data().password == password.value
          ) {
            db.collection("admins")
              .doc(doc.id)
              .delete()
              .then(() => {
                alert(`Removed ${user.value} from the admin list`);
              });
          }
        });
      });
  } else {
    alert("You have to input everything");
  }
}

function newSport() {
  let sport = {
    name: document.getElementById("sportName").value,
    min: parseInt(document.getElementById("minPlayers").value),
    max: parseInt(document.getElementById("maxPlayers").value),
  };

  db.collection("sports").add(sport);

  document.getElementById("minPlayers").value = "";
  document.getElementById("maxPlayers").value = "";
  document.getElementById("sportName").value = "";
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}
