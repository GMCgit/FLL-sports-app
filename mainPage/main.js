let db = firebase.firestore();
const username = document.getElementById("username");

if (sessionStorage.getItem("DocName") == null || sessionStorage.getItem("username") == null || sessionStorage.getItem("pref") == null ||sessionStorage.getItem("admin") == null || sessionStorage.getItem("name") == null || sessionStorage.getItem("password") == null) {
  alert("Something went wrong.")
  localStorage.clear();
  sessionStorage.clear();
  window.location = "../index.html";
}

username.innerHTML = sessionStorage.getItem("username");
let hasInvite = false;
db.collection("invites")
  .get()
  .then((qC) => {
    qC.forEach((inviteC) => {
      if (inviteC.data().owner == sessionStorage.getItem("DocName")) {
        document.getElementById(
          "inviteLink"
        ).innerHTML = `<a target="blank" href="../invite/invite.html?link=${inviteC.id}">invite</a><br> invite::${inviteC.id}`;
        hasInvite = true;
      }
    });
  });

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

let pref = JSON.parse(sessionStorage.getItem("pref"));

if (pref.dark) {
  darkMode(true);
}

function toSportpedia() {
  window.location = "../sportpedia/sportpedia.html";
}

function darkMode(toDark) {
  if (toDark) {
    document.getElementById("mainBg").classList.add("dark");
    document.getElementById("content").classList.add("darkTxt");
  } else {
    document.getElementById("mainBg").classList.remove("dark");
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

function toChat() {
  window.location = "../chat/chat.html";
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

function sport_suggest() {
  let name = document.getElementById("name").value;
  let max = document.getElementById("max").value;
  let min = document.getElementById("min").value;
  if (
    name !== "" &&
    min !== "" &&
    min > 0 &&
    min % 1 == 0 &&
    max % 1 == 0 &&
    min < 50
  ) {
    if (max !== "") {
      if (max >= min) {
        db.collection("sport_suggestions")
          .add({
            name: name,
            max: max,
            min: min,
            comment: document.getElementById("comment").value,
            user_doc: sessionStorage.getItem("DocName"),
            user_name: sessionStorage.getItem("name"),
          })
          .then(alert("succes"));
      } else {alert("no")}
    } else {
        db.collection("sport_suggestions")
          .add({
            name: name,
            max: max,
            min: min,
            comment: document.getElementById("comment").value,
            user_doc: sessionStorage.getItem("DocName"),
            user_name: sessionStorage.getItem("name"),
          })
          .then(alert("succes"));
        }
  } else {
    alert("No");
  }
}

function test(e) {
  if (e.keyCode === 13) {
    e.preventDefault()
    console.log("π")
  }
}

function newInvite() {
  if (hasInvite == false) {
    db.collection("invites")
      .add({
        fieldData: sessionStorage.getItem("fieldData"),
        owner: sessionStorage.getItem("DocName"),
      })
      .then(() => {
        db.collection("invites")
          .get()
          .then((q) => {
            q.forEach((invite) => {
              if (invite.data().owner == sessionStorage.getItem("DocName")) {
                document.getElementById(
                  "inviteLink"
                ).innerHTML = `<a target="blank" href="../invite/invite.html?link=${invite.id}">invite</a><br> invite::${invite.id}`;
                hasInvite = true;
              }
            });
          });
      });
  } else {
    alert("Invite already there");
  }
}

function leaveMatch() {
  let stuff = JSON.parse(sessionStorage.getItem("fieldData"));
  db.collection("fields")
    .doc(stuff.field)
    .get()
    .then((doc) => {
      if (stuff.difficulty == "easy") {
        let index = doc.data().easy.indexOf(sessionStorage.getItem("DocName"));
        let newArr = doc.data().easy;
        newArr.splice(index, 1);
        db.collection("fields").doc(stuff.field).update({
          easy: newArr,
        });
      } else if (stuff.difficulty == "medium") {
        let index = doc
          .data()
          .medium.indexOf(sessionStorage.getItem("DocName"));
        db.collection("fields")
          .doc(stuff.field)
          .update({
            medium: doc.data().medium.splice(index, 1),
          });
      } else if (stuff.difficulty == "hard") {
        let index = doc.data().hard.indexOf(sessionStorage.getItem("DocName"));
        db.collection("fields")
          .doc(stuff.field)
          .update({
            hard: doc.data().hard.splice(index, 1),
          });
      }
    })
    .then(() => {
      db.collection("fields")
        .doc(stuff.field)
        .get()
        .then((f) => {
          if (stuff.difficulty == "easy") {
            let arr = f.data().easyB;
            arr.forEach((b) => {
              if (JSON.parse(b).owner == sessionStorage.getItem("DocName")) {
                arr.splice(arr.indexOf(b), 1);
              }
            });
            db.collection("fields").doc(stuff.field).update({
              easyB: arr,
            });
          } else if (stuff.difficulty == "medium") {
            let arr = f.data().mediumB;
            arr.forEach((b) => {
              if (JSON.parse(b).owner == sessionStorage.getItem("DocName")) {
                arr.splice(arr.indexOf(b), 1);
              }
            });
            db.collection("fields").doc(stuff.field).update({
              mediumB: arr,
            });
          } else if (stuff.difficulty == "hard") {
            let arr = f.data().hardB;
            arr.forEach((b) => {
              if (JSON.parse(b).owner == sessionStorage.getItem("DocName")) {
                arr.splice(arr.indexOf(b), 1);
              }
            });
            db.collection("fields").doc(stuff.field).update({
              hardB: arr,
            });
          }
          let users;

          if (stuff.difficulty == "easy") {
            users = f.data().easy;
          } else if (stuff.difficulty == "medium") {
            users = f.data().medium;
          } else if (stuff.difficulty == "hard") {
            users = f.data().hard;
          }

          db.collection("chat")
            .get()
            .then((q) => {
              q.forEach((ch) => {
                let arr = ch.data().users;

                if (
                  ch.data().name == `${stuff.name}, ${stuff.difficulty}` &&
                  check(users, arr)
                ) {
                  console.log(users);
                  db.collection("chat").doc(ch.id).update({
                    users: users,
                  });
                }
              });
            });
        })
        .then(() => {
          sessionStorage.removeItem("fieldData");
          document.getElementById("inMatch").classList.add("invis");
          db.collection("users")
            .doc(sessionStorage.getItem("DocName"))
            .update({
              inMatch: false,
              fieldData: "",
            })
            .then(() => {
              db.collection("invites")
                .get()
                .then((q) => {
                  q.forEach((invite) => {
                    if (
                      invite.data().owner == sessionStorage.getItem("DocName")
                    ) {
                      db.collection("invites").doc(invite.id).delete();
                    }
                  });
                });
            });
        });
    });
}

db.collection("users")
  .doc(sessionStorage.getItem("DocName"))
  .get()
  .then((doc) => {
    if (doc.data().inMatch == true) {
      if (sessionStorage.getItem("fieldData") == null) {
        db.collection("users")
          .doc(sessionStorage.getItem("DocName"))
          .get()
          .then((doc) => {
            document.getElementById("inMatch").classList.remove("invis");

            let stuff = JSON.parse(doc.data().fieldData);

            document.getElementById("inMatchSport").innerHTML = stuff.sport;
            document.getElementById("inMatchName").innerHTML = stuff.name;

            sessionStorage.setItem("fieldData", doc.data().fieldData);

            sprotStatus();
          });
      } else {
        document.getElementById("inMatch").classList.remove("invis");

        let stuff = JSON.parse(sessionStorage.getItem("fieldData"));

        document.getElementById("inMatchSport").innerHTML = stuff.sport;
        document.getElementById("inMatchName").innerHTML = stuff.name;

        sprotStatus();
      }
    } else {
      document.getElementById("inMatch").classList.add("invis");
    }
  });

function sprotStatus() {
  let stuff = JSON.parse(sessionStorage.getItem("fieldData"));
  let Max = 0;
  db.collection("sports")
    .get()
    .then((qS) => {
      qS.forEach((m) => {
        if (m.data().name == stuff.sport) {
          Max = m.data().min;
        }
      });
    })
    .then(() => {
      db.collection("fields")
        .doc(stuff.field)
        .get()
        .then((doc) => {
          if (stuff.difficulty == "easy") {
            document.getElementById("inMatchStatus").innerHTML = `${
              doc.data().easy.length
            } / ${Max} players ready`;
            if (doc.data().easy.length >= Max) {
              createChat(stuff);
            } else {
              delChat(stuff);
            }
          } else if (stuff.difficulty == "medium") {
            document.getElementById("inMatchStatus").innerHTML = `${
              doc.data().medium.length
            } / ${Max} players ready`;
            if (doc.data().medium.length >= Max) {
              createChat(stuff);
            } else {
              delChat(stuff);
            }
          } else if (stuff.difficulty == "hard") {
            document.getElementById("inMatchStatus").innerHTML = `${
              doc.data().hard.length
            } / ${Max} players ready`;
            if (doc.data().hard.length >= Max) {
              createChat(stuff);
            } else {
              delChat(stuff);
            }
          }
        });
    });
}

function delChat(stuff) {
  let users = [];
  db.collection("fields")
    .doc(stuff.field)
    .get()
    .then((field) => {
      if (stuff.difficulty == "easy") {
        users = field.data().easy;
      } else if (stuff.difficulty == "medium") {
        users = field.data().medium;
      } else if (stuff.difficulty == "hard") {
        users = field.data().hard;
      }
      db.collection("chat")
        .get()
        .then((q) => {
          q.forEach((ch) => {
            if (
              ch.data().name == `${stuff.name}, ${stuff.difficulty}` &&
              check(ch.data().users, users)
            ) {
              db.collection("chat").doc(ch.id).delete();
            }
          });
        });
    });
}

function check(arrI, arrO) {
  let isTrue = true;

  arrI.forEach((elm) => {
    if (!arrO.includes(elm)) {
      isTrue = false;
    }
  });

  return isTrue;
}

function createChat(stuff) {
  let users = [];
  let exists = false;
  db.collection("fields")
    .doc(stuff.field)
    .get()
    .then((field) => {
      if (stuff.difficulty == "easy") {
        users = field.data().easy;
      } else if (stuff.difficulty == "medium") {
        users = field.data().medium;
      } else if (stuff.difficulty == "hard") {
        users = field.data().hard;
      }

      db.collection("chat")
        .get()
        .then((q) => {
          q.forEach((ch) => {
            if (
              ch.data().name == `${stuff.name}, ${stuff.difficulty}` &&
              check(ch.data().users, users)
            ) {
              exists = true;
              if (JSON.stringify(users) != JSON.stringify(ch.data().users)) {
                db.collection("chat").doc(ch.id).update({
                  users: users,
                });
              }
            }
          });
        })
        .then(() => {
          if (exists == false) {
            db.collection("chat").add({
              users: users,
              name: `${stuff.name}, ${stuff.difficulty}`,
              msgs: [],
            });
          }
          document.getElementById("chat").classList.remove("invis");
        });
    });
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}
