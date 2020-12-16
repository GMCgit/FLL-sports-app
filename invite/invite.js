let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
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
    document.getElementsByClassName("dropdown-menu")[0].classList.add("dark-bg")
    document.getElementsByClassName("dropdown-menu")[0].classList.add("darkTxt")
  }
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
  window.location = "../mainPage/main.html";
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

let invite = document.getElementById("inviteRes");

if (new URLSearchParams(location.search).get("link") != null) {
  let found = null;
  db.collection("invites")
    .get()
    .then((q) => {
      q.forEach((doc) => {
        if (doc.id == new URLSearchParams(location.search).get("link")) {
          found = doc.data().fieldData;
        }
      });
    })
    .then(() => {
      if (found != null) {
        invite.innerHTML = "Found it";
        document.getElementById("inviteBtn").classList.remove("invis");

        found = JSON.parse(found);

        document.getElementById(
          "Header"
        ).innerHTML = `You were invited to join a match at ${found.name} for ${found.sport}`;

        sessionStorage.setItem("fDt", JSON.stringify(found));
      } else {
        invite.innerHTML = "Link not found";
      }
    });
} else {
  invite.innerHTML = "no link";
}

function joinMatch() {
  let stuff = JSON.parse(sessionStorage.getItem("fDt"));

  let difficulty = stuff.difficulty;
  let name = stuff.name;

  let ableToJoin = null;
  let itterated = false;
  let arr;
  db.collection("fields")
    .get()
    .then((q) => {
      q.forEach((doc) => {
        db.collection("users")
          .doc(sessionStorage.getItem("DocName"))
          .get()
          .then((ybc) => {
            if (difficulty == "easy") {
              arr = doc.data().easy;
            } else if (difficulty == "medium") {
              arr = doc.data().medium;
            } else if (difficulty == "hard") {
              arr = doc.data().medium;
            }
            let arr2 = ybc.data().blocked;
            arr.every((blockedP) => {
              if (arr2.includes(blockedP)) {
                ableToJoin = false;
                return false;
              }
            });
            if (ableToJoin == null) ableToJoin = true;
          })
          .then(() => {
            if (ableToJoin == true) {
              for (let i = 0; i < arr.length; i++) {
                db.collection("users")
                  .doc(arr[i])
                  .get()
                  .then((tbl) => {
                    let arr3 = tbl.data().blocked;
                    if (arr3.includes(sessionStorage.getItem("DocName"))) {
                      ableToJoin = false;
                      itterated = true;
                      i = arr.length;
                    } else {
                      if (i == arr.length - 1) {
                        db.collection("users")
                          .doc(sessionStorage.getItem("DocName"))
                          .get()
                          .then((c) => {
                            if (c.data().inMatch == false) {
                              db.collection("fields")
                                .get()
                                .then((q) => {
                                  q.forEach((doc) => {
                                    if (doc.data().name == name) {
                                      let joiningObj = {
                                        name: doc.data().name,
                                        field: doc.id,
                                        difficulty: difficulty,
                                        sport: doc.data().Sport,
                                      };

                                      sessionStorage.setItem(
                                        "fieldData",
                                        JSON.stringify(joiningObj)
                                      );

                                      db.collection("users")
                                        .doc(sessionStorage.getItem("DocName"))
                                        .update({
                                          inMatch: true,
                                          fieldData: JSON.stringify(joiningObj),
                                        });

                                      if (difficulty == "easy") {
                                        let newArr = doc.data().easy || [];
                                        newArr.push(
                                          sessionStorage.getItem("DocName")
                                        );
                                        db.collection("fields")
                                          .doc(doc.id)
                                          .update({
                                            easy: newArr,
                                          });
                                      } else if (difficulty == "medium") {
                                        let newArr = doc.data().medium || [];
                                        newArr.push(
                                          sessionStorage.getItem("DocName")
                                        );
                                        db.collection("fields")
                                          .doc(doc.id)
                                          .update({
                                            medium: newArr,
                                          });
                                      } else if (difficulty == "hard") {
                                        let newArr = doc.data().hard || [];
                                        newArr.push(
                                          sessionStorage.getItem("DocName")
                                        );
                                        db.collection("fields")
                                          .doc(doc.id)
                                          .update({
                                            hard: newArr,
                                          });
                                      }
                                      return alert("Success!");
                                    }
                                  });
                                });
                            } else {
                              alert("You are already in a match");
                            }
                          });
                      }
                    }
                  });
              }
              if (!itterated) {
                alert("You can't join this match");
                itterated = true;
              }
            } else {
              alert("You can't join this match");
            }
          });
      });
    });
}

function toChat() {
  window.location = "../chat/chat.html";
}
