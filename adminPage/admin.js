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
