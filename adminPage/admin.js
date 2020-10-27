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
  })
  .catch((err) => {
    window.location = "../mainPage/main.html";
  });

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
    });
    lng.value = "";
    lat.value = "";
    name.value = "";
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
