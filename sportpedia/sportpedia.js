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
          reviews: JSON.parse(sport.data().reviews),
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

  textArea.innerHTML = `<h1>${sportData.name}</h1><hr />`;

  textArea.innerHTML += `<div id="status"></div>
  <div id="ratingForm">
      <fieldset class="rating">
          <legend>Please rate:</legend>
          <input type="radio" id="star5" name="rating" value="5" /><label for="star5" title="Rocks!">5 stars</label>
          <input type="radio" id="star4" name="rating" value="4" /><label for="star4" title="Pretty good">4 stars</label>
          <input type="radio" id="star3" name="rating" value="3" /><label for="star3" title="Meh">3 stars</label>
          <input type="radio" id="star2" name="rating" value="2" /><label for="star2" title="Kinda bad">2 stars</label>
          <input type="radio" id="star1" name="rating" value="1" /><label for="star1" title="Sucks big time">1 star</label>
      </fieldset>
      <div class="clearfix"></div>
      <button class="submit clearfix btn btn-outline-success" onclick="submitReview()">Submit</button>
  </div> <hr />`;

  textArea.innerHTML += `<h3 id="ratingRes">This sport has avrage review of ${sportData.reviews.avg} from ${sportData.reviews.reviews.length} user</h3><hr>`;

  textArea.innerHTML += `<h3>Max: ${sportData.max}<br>Min: ${sportData.min}</h3>`;
  if (sportData.desc !== "") {
    textArea.innerHTML += `<hr /><div>Description: ${sportData.desc}</div>`;
  }
  textArea.innerHTML += `<div class="invis" id="sportId">${sportData.id}</div>`;
}
function submitReview() {
  db.collection("sports")
    .doc(document.getElementById("sportId").innerHTML)
    .get()
    .then((doc) => {
      let reviews = JSON.parse(doc.data().reviews);
      let indexOf = -1;
      reviews.reviews.forEach((review) => {
        if (review.owner == sessionStorage.getItem("DocName")) {
          indexOf = reviews.reviews.indexOf(review);
        }
      });

      let value = document.getElementById("star5").checked
        ? 5
        : document.getElementById("star4").checked
        ? 4
        : document.getElementById("star3").checked
        ? 3
        : document.getElementById("star2").checked
        ? 2
        : document.getElementById("star1").checked
        ? 1
        : false;

      if (value == false) {
        return alert("You need to select a value");
      }

      let reviewsArr = reviews.reviews;

      if (indexOf == -1) {
        reviewsArr.push({
          owner: sessionStorage.getItem("DocName"),
          value: value,
        });
      } else {
        reviewsArr[indexOf] = {
          owner: sessionStorage.getItem("DocName"),
          value: value,
        };
      }

      db.collection("sports")
        .doc(document.getElementById("sportId").innerHTML)
        .update({
          reviews: JSON.stringify({
            avg: getNewAvg(reviewsArr),
            reviews: reviewsArr
          })
        });
      document.getElementById("ratingRes").innerHTML = `This sport has avrage review of ${getNewAvg(reviewsArr)} from ${reviewsArr.length} user`
    });
}

let getNewAvg = (arr) => {
  return arr.length > 1
    ? arr.reduce((a, b) => a.value + b.value) / arr.length
    : arr[0].value;
};
