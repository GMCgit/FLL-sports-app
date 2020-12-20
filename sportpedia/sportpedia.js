let db = firebase.firestore();
const username = document.getElementById("username");

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
    document.getElementById("sportpediaBg").classList.add("dark");
    document.getElementById("content").classList.add("darkTxt");
  } else {
    document.getElementById("sportpediaBg").classList.remove("dark");
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

db.collection("sports")
  .get()
  .then((q) => {
    let sprotSelector = document.getElementById("sportsSelector");
    q.forEach((sport) => {
      let child = document.createElement("button");
      if (pref.dark) {
        child.className = "btn btn-outline-primary button";
      } else {
        child.className = "btn btn-outline-dark button";
      }
      child.innerHTML = sport.data().name;
      child.setAttribute(
        "data",
        JSON.stringify({
          name: sport.data().name,
          min: sport.data().min,
          max: sport.data().max,
          desc: sport.data().description,
          id: sport.id,
        })
      );
      child.onclick = function (e) {
        selectSport(this);
      };
      sprotSelector.appendChild(child);
      sprotSelector.appendChild(document.createElement("br"));
    });
  });

function selectSport(elm) {
  let sportData = JSON.parse(elm.getAttribute("data"));
  let textArea = document.getElementById("sportData");

  textArea.innerHTML = `<h1>${sportData.name}</h1><hr /><h3>Max: ${sportData.max}<br>Min: ${sportData.min}</h3>`
  if (sportData.desc !== "") {
    textArea.innerHTML += `<hr /><div>Description: ${sportData.desc}</div>`
  }
}
