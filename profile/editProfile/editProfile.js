let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");
document.getElementById(
  "Username"
).innerHTML = `Username: ${sessionStorage.getItem("username")}`;
document.getElementById("Name").innerHTML = `Name: ${sessionStorage.getItem(
  "name"
)}`;

if (sessionStorage.getItem("bio") !== "undefined") {
  document.getElementById("bio").value = sessionStorage.getItem("bio");
}

function toMain() {
  window.location = `../../mainPage/main.html`;
}

function toMap() {
  window.location = `../../map/map.html`;
}

function toProfile() {
  window.location = "../../profile/profile.html";
}

function change_username() {
  if (document.getElementById("new_username").value == "") {
    alert("You have to submit a username");
    return;
  }
  db.collection("users")
    .doc(sessionStorage.getItem("DocName"))
    .update({
      username: document.getElementById("new_username").value,
    });

  sessionStorage.removeItem("username");
  sessionStorage.setItem(
    "username",
    document.getElementById("new_username").value
  );

  if (localStorage.getItem("username") !== null) {
    localStorage.removeItem("username");
    localStorage.setItem(
      "username",
      document.getElementById("new_username").value
    );
  }

  username.innerHTML = sessionStorage.getItem("username");
  document.getElementById(
    "Username"
  ).innerHTML = `Username: ${sessionStorage.getItem("username")}`;
}

function change_name() {
  if (document.getElementById("new_name").value == "") {
    alert("You have to submit a name");
    return;
  }
  db.collection("users")
    .doc(sessionStorage.getItem("DocName"))
    .update({
      name: document.getElementById("new_name").value,
    });

  sessionStorage.removeItem("name");
  sessionStorage.setItem("name", document.getElementById("new_name").value);

  if (localStorage.getItem("name") !== null) {
    localStorage.removeItem("name");
    localStorage.setItem("name", document.getElementById("new_name").value);
  }

  document.getElementById("name").innerHTML = `name: ${sessionStorage.getItem(
    "name"
  )}`;
}

function PassChange() {
  db.collection("users")
    .doc(sessionStorage.getItem("DocName"))
    .get()
    .then((q) => {
      pass = q.data().password;
    })
    .then(() => {
      if (
        document.getElementById("new_pass").value == "" ||
        document.getElementById("old_pass").value !== pass
      ) {
        alert("ne");
        return;
      }
      db.collection("users")
        .doc(sessionStorage.getItem("DocName"))
        .update({
          password: document.getElementById("new_pass").value,
        });
      alert("Password changed");
      sessionStorage.removeItem("password");
      sessionStorage.setItem(
        "password",
        document.getElementById("new_pass").value
      );

      if (localStorage.getItem("password") !== null) {
        localStorage.removeItem("password");
        localStorage.setItem(
          "password",
          document.getElementById("new_pass").value
        );
      }
    });
}

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

function toAdmin() {
  window.location = "../../adminPage/admin.html";
}

function fav_sports() {
  db.collection("users")
    .doc(sessionStorage.getItem("DocName"))
    .update({
      favourite_sports: document.getElementById("sports").value,
    });
}

function update_age() {
  if (Number(document.getElementById("age").value) > 0 && Number(document.getElementById("age").value) % 1 == 0) {
    db.collection("users")
      .doc(sessionStorage.getItem("DocName"))
      .update({
        age: Number(document.getElementById("age").value),
      });
    alert("Updated your age");
  } else {
    alert("ne");
  }
}

function bio_change() {
  if (document.getElementById("bio").value !== sessionStorage.getItem("bio")) {
    db.collection("users")
      .doc(sessionStorage.getItem("DocName"))
      .update({
        biography: document.getElementById("bio").value,
      });
    sessionStorage.removeItem("bio");
    sessionStorage.setItem("bio", document.getElementById("bio").value);
  }
}
