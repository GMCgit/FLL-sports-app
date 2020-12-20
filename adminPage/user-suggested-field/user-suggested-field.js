let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

db.collection("map_suggestions")
  .doc(sessionStorage.getItem("suggestion-doc_id"))
  .get()
  .then((q) => {
    document.getElementById("suggestao").innerHTML =
      "suggested by: " + q.data().user_name;
    document.getElementById("suggestao").onclick = function (funkcija) {
      let osoba = {
        innerText: q.data().user_name,
        data: "",
        value: q.data().user_doc,
      };
      goToPerson(osoba);
    };
    document.getElementById("name").value = q.data().name;
    document.getElementById("sports").value = q.data().sports;
    document.getElementById("adress").value = q.data().adress;
    document.getElementById("comment").value = q.data().comment;
  });

function delete_suggestion() {
  db.collection("map_suggestions")
    .doc(sessionStorage.getItem("suggestion-doc_id"))
    .delete()
    .catch(function (error) {
      console.log(error);
      console.log("Contact Bornaj (pi)");
      alert("Something went wrong. Contact developers or admins.");
    })
    .then(function () {
      sessionStorage.removeItem("suggestion-doc_id");
      alert("Suggestion deleted");
      window.location = "../admin.html";
    });
}
sessionStorage.setItem("update_button_added", false);

function add_field() {
  let add = true;
  let name = document.getElementById("name").value;
  let sport = document.getElementById("sports").value;
  let position = {
    lat: document.getElementById("lat").value,
    lng: document.getElementById("lng").value,
  };
  if (
    name !== "" &&
    sport !== "" &&
    position.lat !== "" &&
    position.lng !== ""
  ) {
    db.collection("fields")
      .get()
      .then((querySearch) => {
        querySearch.forEach((doc) => {
          if (
            position.lat == JSON.parse(doc.data().position).lat &&
            position.lng == JSON.parse(doc.data().position).lng &&
            add
          ) {
            alert("that field already exists");
            add = false;
            if (sessionStorage.getItem("update_button_added") == "false") {
              sessionStorage.removeItem("update_button_added");
              sessionStorage.setItem("update_button_added", true);
              let update = document.createElement("button");
              update.innerHTML = "update field";
              update.onclick = function () {
                db.collection("fields")
                  .doc(doc.id)
                  .update({
                    Sport: document.getElementById("sports").value,
                    name: document.getElementById("name").value,
                    position: JSON.stringify({
                      lat: Number(document.getElementById("lat").value),
                      lng: Number(document.getElementById("lng").value),
                    }),
                    easy: [],
                    medium: [],
                    hard: [],
                  })
                  .catch(function (error) {
                    console.log(error);
                    console.log("Contact Bornaj (pi)");
                    alert(
                      "Something went wrong. Contact developers or admins."
                    );
                  });
                alert(`field "${name}" updated`);
                delete_suggestion();
              };
              update.classList = "btn btn-danger";
              document.getElementById("suggestion").append(update);
            }
          }
        });
      })
      .catch(function (error) {
        console.log(error);
        console.log("Contact Bornaj (pi)");
        alert("Something went wrong. Contact developers or admins.");
      })
      .then((q) => {
        if (add) {
          sessionStorage.removeItem("update_button_added");
          db.collection("fields")
            .add({
              Sport: sport,
              name: name,
              position: JSON.stringify({
                lat: Number(document.getElementById("lat").value),
                lng: Number(document.getElementById("lng").value),
              }),
              easy: [],
              medium: [],
              hard: [],
            })
            .then(() => {
              alert("succes");
              delete_suggestion();
            });
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log("Contact Bornaj (pi)");
        alert("Something went wrong. Contact developers or admins.");
      });
  } else {
    alert("ne");
  }
}

function toProfile() {
  window.location = `../../profile/profile.html`;
}

function toMap() {
  window.location = "../../map/map.html";
}

function toAdmin() {
  window.location = "../../adminPage/admin.html";
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../../Friends-Blocked/Friends-blocked.html";
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../../Friends-Blocked/Friends-blocked.html";
}

function toChat() {
  window.location = "../chat/chat.html";
}
