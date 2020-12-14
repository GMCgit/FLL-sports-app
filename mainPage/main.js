let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
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
  if (name !== "" && max !== "" && min !== "" && min > 0 && max >= min) {
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
  } else {
    alert("No")
  }
}

function newInvite() {
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
              ).innerHTML = `https://gmcgit.github.io/FLL-sports-app/invite/invite.html?link=${invite.id}`;
            }
          });
        });
    });
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
        if (m.data().name == stuff.sprort) {
          Max = m.data().max;
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
          }
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
