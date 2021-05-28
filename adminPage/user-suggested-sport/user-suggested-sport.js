let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

db.collection("sport_suggestions")
  .doc(sessionStorage.getItem("suggestion-doc-id"))
  .get()
  .then((q) => {
    document.getElementById("suggestao").innerHTML =
      "suggested by: " + q.data().user_name;
    document.getElementById("suggestao").onclick = function () {
      let osoba = {
        innerText: q.data().user_name,
        data: "",
        value: q.data().user_doc,
      };
      goToPerson(osoba);
    };
    document.getElementById("name").value = q.data().name;
    document.getElementById("min").value = q.data().min;
    document.getElementById("max").value = q.data().max;
    document.getElementById("comment").innerHTML =
      "comment: " + q.data().comment;
  });

function delete_suggestion() {
  db.collection("sport_suggestions")
    .doc(sessionStorage.getItem("suggestion-doc-id"))
    .delete()
    .then(function () {
      sessionStorage.removeItem("suggestion-doc_id");
      alert("Suggestion deleted");
      window.location = "../admin.html";
    })
}

sessionStorage.setItem("update_button_added", false)
function add_sport() {
  let add = true;
  let name = document.getElementById("name").value;
  let min = document.getElementById("min").value;
  let max = document.getElementById("max").value;
  let description = document.getElementById("description").value
  if (name !== "" && min > 0 && max >= min && max % 1 == 0 && min % 1 == 0 && description !== "") {
    db.collection("sports")
      .get()
      .then((querySearch) => {
        querySearch.forEach((doc) => {
          if (doc.data().name.toLowerCase() == name.toLowerCase() && add) {
            alert("that sport already exists");
            add = false;
            if (sessionStorage.getItem("update_button_added") == "false") {
              sessionStorage.removeItem("update_button_added")
              sessionStorage.setItem("update_button_added", true)
              let update = document.createElement("button");
              update.innerHTML = "update sport";
              update.onclick = function () {
                db.collection("sports")
                  .doc(doc.id)
                  .update({
                    min: document.getElementById("min").value,
                    max: document.getElementById("max").value,
                    description: document.getElementById("description").value,
                    reviews: `{"avg":0, "reviews":[]}`
                }).catch(function(error) {
                  console.log(error)
                  console.log("Contact Bornaj (pi)")
                  alert("Something went wrong. Contact developers or admins.");
                })
              alert(`sport "${name}" updated`);
              delete_suggestion()
            };
            update.classList = "btn btn-danger";
            document.getElementById("suggestion").append(update);
          }}
        });
      }).catch(function(error) {
        console.log(error)
        console.log("Contact Bornaj (pi)")
        alert("Something went wrong. Contact developers or admins.")
      })
      .then((q) => {
  if (add) {
    sessionStorage.removeItem("update_button_added")
    db.collection("sports").add({
        name: name,
        min: Number(min),
        max: Number(max),
        description: description,
        reviews: '{"avg":0,"reviews":[]}',
      }).then(() => {
        alert("succes")
        delete_suggestion()
      })
  }}).catch(function(error) {
    console.log(error)
    console.log("Contact Bornaj (pi)")
    alert("Something went wrong. Contact developers or admins.")
  })
} else {
  alert("ne")
}
}

function toProfile() {
  window.location = `../../profile/profile.html`;
  sessionStorage.removeItem("update_button_added")
}

function toMap() {
  window.location = "../../map/map.html";
  sessionStorage.removeItem("update_button_added")
}

function toAdmin() {
  window.location = "../../adminPage/admin.html";
  sessionStorage.removeItem("update_button_added")
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../../Friends-Blocked/Friends-blocked.html";
  sessionStorage.removeItem("update_button_added")
}

function toChat() {
  window.location = "../chat/chat.html";
  sessionStorage.removeItem("update_button_added")
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../../Friends-Blocked/Friends-blocked.html";
  sessionStorage.removeItem("update_button_added")
}
