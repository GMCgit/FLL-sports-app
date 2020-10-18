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
              window.location = `../../mainPage/main.html?doc=${doc.id}`;
            }
          }
        });
      });
  }
}
