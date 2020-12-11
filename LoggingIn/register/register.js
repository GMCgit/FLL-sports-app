let db = firebase.firestore();
const username = document.getElementById("userName");
const password = document.getElementById("password");
const name = document.getElementById("name");

function register() {
  if (username.value !== "" && password.value !== "" && name.value !== "") {
    let takenUser = false;
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (username.value == doc.data().username) {
            takenUser = true;
          }
        });
      });

    if (takenUser == false) {
      db.collection("users")
        .add({
          username: username.value,
          password: password.value,
          name: name.value,
          inMatch: false,
          blocked: [],
          friends: [],
        })
        .then((docRef) => {
          console.log("Success!");
          window.location.href = "../../index.html";
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Username taken")
    }
  } else {
    alert("You have to fill in all the fields");
  }
}
