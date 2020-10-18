let db = firebase.firestore();
const username = document.getElementById("username");

let params = new URLSearchParams(window.location.search);

db.collection("users")
  .doc(params.get("doc"))
  .get()
  .then((doc) => {
    username.innerHTML = doc.data().username;
  });
