let db = firebase.firestore();
const username = document.getElementById("username");
const password = document.getElementById("password");

function LogIn() {
  if (username.value == "" || password.value == "") {
    alert("You didn't fill in all the fields");
  } else {
    let loggedIn = false;
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (username.value == doc.data().username) {
            if (password.value == doc.data().password) {
              loggedIn = true;
              sessionStorage.setItem("username", doc.data().username);
              sessionStorage.setItem("password", doc.data().password);
              sessionStorage.setItem("name", doc.data().name);
              sessionStorage.setItem("DocName", doc.id);
              sessionStorage.setItem("bio", doc.data().biography);
              sessionStorage.setItem("pref", doc.data().pref);
              if (document.getElementById("Remeber").checked == true) {
                localStorage.setItem("username", doc.data().username);
                localStorage.setItem("password", doc.data().password);
                localStorage.setItem("name", doc.data().name);
                localStorage.setItem("DocName", doc.id);
              }
              db.collection("admins")
                .get()
                .then((querySearch) => {
                  querySearch.forEach((doc2) => {
                    if (doc2.data().username == doc.data().username) {
                      sessionStorage.setItem("admin", true);
                      if (document.getElementById("Remeber").checked == true) {
                        localStorage.setItem("admin", true);
                      }
                      return (window.location = `../../mainPage/main.html`);
                    } else {
                      if (sessionStorage.getItem("admin") !== null) {
                        return;
                      }
                      sessionStorage.setItem("admin", false);
                      if (document.getElementById("Remeber").checked == true) {
                        localStorage.setItem("admin", false);
                      }
                    }
                  });
                });

              db.collection("users")
                .doc(doc.id)
                .update({
                  lastLogin: new Date(),
                })
                .then(() => {
                  window.location = `../../mainPage/main.html`;
                });
            }
          }
        });
      })
      .then(() => {
        if (!loggedIn) {
          alert("Username or password is wrong.");
        }
      });
  }
}

if (
  localStorage.getItem("username") !== null &&
  localStorage.getItem("password") !== null
) {
  sessionStorage.setItem("username", localStorage.getItem("username"));
  sessionStorage.setItem("password", localStorage.getItem("password"));
  sessionStorage.setItem("name", localStorage.getItem("name"));
  sessionStorage.setItem("DocName", localStorage.getItem("DocName"));
  sessionStorage.setItem("admin", localStorage.getItem("admin"));
  db.collection("users")
    .doc(sessionStorage.getItem("DocName"))
    .update({
      lastLogin: new Date(),
    })
    .then(() => {
      db.collection("users")
        .doc(sessionStorage.getItem("DocName"))
        .get((doc) => {
          sessionStorage.setItem("pref", doc.data().pref);
        })
        .then(() => {
          window.location = `../../mainPage/main.html`;
        });
    });
}
