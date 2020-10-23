let db = firebase.firestore();
const username = document.getElementById("username");
const password = document.getElementById("password");

function LogIn() {
  if (username.value == "" || password.value == "") {
    alert("You didn't fill in all the fields");
  } else {
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (username.value == doc.data().username) {
            if (password.value == doc.data().password) {
              sessionStorage.setItem("username", doc.data().username);
              sessionStorage.setItem("password", doc.data().password);
              sessionStorage.setItem("name", doc.data().name);
              if (document.getElementById("Remeber").checked == true) {
                localStorage.setItem("username", doc.data().username);
                localStorage.setItem("password", doc.data().password);
                localStorage.setItem("name", doc.data().name);
              }
              window.location = `../../mainPage/main.html`;
            }
          }
        });
      });

  }
}

if (localStorage.length > 0) {
  sessionStorage.setItem("username", localStorage.getItem("username"));
  sessionStorage.setItem("password", localStorage.getItem("password"));
  sessionStorage.setItem("name", localStorage.getItem("name"));
  window.location = `../../mainPage/main.html`;
}