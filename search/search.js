function searchPeople() {
  const searchTerm = document.getElementById("userEntered");

  let db = firebase.firestore();
  let user = [];

  db.collection("users")
    .get()
    .then((querySearch) => {
      querySearch.forEach((doc) => {
        let Username = doc.data().username;
        if (Username.includes(searchTerm.value)) {
          user.push({
            username: Username,
            docId: doc.id,
            name: doc.data().name,
          });
        }
      });
    })
    .then(() => {
      let repetitions;
      if (user.length > 4) {
        repetitions = 4;
      } else {
        repetitions = user.length;
      }
      document.getElementById("Results").innerHTML = "";
      for (let i = 0; i < repetitions; i++) {
        let child = document.createElement("button");
        child.innerHTML = user[i].username;
        child.classList.add("btn");
        child.classList.add("btn-outline-dark");
        child.classList.add("SearchResult");
        child.classList.add("btn-lg");
        child.value = user[i].docId;
        child.data = user[i].name;
        child.onclick = function (e) {
          goToPerson(this);
        };
        document.getElementById("Results").appendChild(child);
      }
    });
}

function goToPerson(elm) {
  let docId = {
    username: elm.innerText,
    name: elm.data,
    docId: elm.value,
  };

  sessionStorage.removeItem("docId");
  sessionStorage.setItem("docId", JSON.stringify(docId));

  window.location = "../othersProfile/others.html";
}
