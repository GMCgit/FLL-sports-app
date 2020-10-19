let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

function toMain() {
  window.location = `../mainPage/main.html`;
}
