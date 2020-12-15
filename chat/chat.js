let db = firebase.firestore();
const username = document.getElementById("username");

username.innerHTML = sessionStorage.getItem("username");

if (sessionStorage.getItem("admin") == "true") {
  document.getElementById("adminPage").classList.remove("invis");
}

let pref = JSON.parse(sessionStorage.getItem("pref"));

if (pref.dark) {
  darkMode(true);
}

function darkMode(toDark) {
  if (toDark) {
    document.getElementById("chatBg").classList.add("dark");
    document.getElementById("content").classList.add("darkTxt");
  } else {
    document.getElementById("chatBg").classList.remove("dark");
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

function toMain() {
  window.location = "../mainPage/main.html";
}

function goToFriends() {
  sessionStorage.setItem("friend", true);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

function goToBlocked() {
  sessionStorage.setItem("friend", false);
  window.location = "../Friends-Blocked/Friends-blocked.html";
}

let selector = document.getElementById("chatSelector");
let talk = document.getElementById("chatTalk");
let chs = [];

document.onload = getChs();

function getChs() {
  chs = [];

  selector.innerHTML = "";

  db.collection("chat")
    .get()
    .then((chq) => {
      chq.forEach((ch) => {
        let users = ch.data().users;
        if (users.includes(sessionStorage.getItem("DocName"))) {
          chs.push({ ...ch.data(), id: ch.id });
        }
        db.collection("chat")
          .doc(ch.id)
          .onSnapshot((doc) => {
            newMsg(doc);
          });
      });

      if (chs.length == 0) {
        selector.innerHTML += "Wow such empty";
      }

      chs.forEach((ch) => {
        let child = document.createElement("button");
        child.innerHTML = ch.name;
        child.classList.add("btn");
        child.classList.add("btn-outline-dark");
        child.classList.add("button");
        child.classList.add("channel");
        child.data = JSON.stringify(ch);
        child.onclick = function (e) {
          selectChat(this);
        };
        selector.appendChild(child);
      });
    });
}

function stopCChat() {
  document.getElementById("newChatT").classList.add("invis");
}

function selectChat(el) {
  sessionStorage.setItem("chatCh", JSON.parse(el.data).id);
  document.getElementById("textingArea").classList.remove("invis");
  document.getElementById("newChatT").classList.add("invis");
  db.collection("chat")
    .doc(sessionStorage.getItem("chatCh"))
    .get()
    .then((doc) => {
      newMsg(doc);
    });
}

function newChatIn() {
  console.log("hi");
  document.getElementById("newChatT").classList.remove("invis");
  document.getElementById("textingArea").classList.add("invis");
}

function createChat() {
  let usernames = document.getElementById("usernames");
  usernames = usernames.value;
  usernames = usernames.split(",");
  let name = document.getElementById("group_name");
  name = name.value;

  if (name == "" || usernames.includes("")) {
    return alert("You need to fill all inputs");
  } else {
    for (let i = 0; i < usernames.length; i++) {
      usernames[i] = usernames[i].replace(/\s+/g, " ").trim();
    }

    let ids = [];
    db.collection("users")
      .get()
      .then((q) => {
        q.forEach((doc) => {
          usernames.forEach((un) => {
            if (doc.data().username == un) {
              ids.push(doc.id);
            }
          });
        });
      })
      .then(() => {
        if (ids.length == 0) {
          return alert("You must enter valid usernames");
        }

        if (!ids.includes(sessionStorage.getItem("DocName"))) {
          ids.push(sessionStorage.getItem("DocName"));
        }

        db.collection("chat")
          .add({
            users: ids,
            name: name,
            msgs: [],
          })
          .then(() => {
            getChs();
            document.getElementById("newChatT").classList.add("invis");
            return alert("Success");
          });
      });
  }
}

function newMsg(doc) {
  if (doc.data() == undefined) return;
  let area = document.getElementById("msgs");
  let msgs = doc.data().msgs;

  area.innerHTML = "";
  let topDiv = document.createElement("div");
  let title = document.createElement("h3");
  title.innerHTML = doc.data().name;
  topDiv.appendChild(title);
  let del = document.createElement("button");
  del.classList.add("btn");
  del.classList.add("btn-outline-danger");
  del.innerHTML = "Delete group";
  del.onclick = function (e) {
    delGroup();
  };
  topDiv.appendChild(del);
  area.appendChild(topDiv);
  area.appendChild(document.createElement("hr"));

  msgs.forEach((msg) => {
    msg = JSON.parse(msg);
    let child = document.createElement("div");

    if (msg.username == sessionStorage.getItem("username")) {
      child.classList.add("myMsg");
      if (pref.dark) {
        child.classList.add("myMsgDark");
      }
    } else {
      child.classList.add("otherMsg");
      if (pref.dark) {
        child.classList.add("otherMsgDark");
      }
    }

    let name = document.createElement("div");
    name.innerHTML = msg.username;
    name.classList.add("name");
    child.appendChild(name);

    let content = document.createElement("div");
    content.classList.add("contentMsg");
    content.innerHTML = msg.msg;
    child.appendChild(content);

    area.appendChild(child);
  });
  let last = document.getElementById("msgs").children;
  last = last[last.length - 1];
  last.scrollIntoView();
}

function sendMsg() {
  let input = document.getElementById("newMsg");
  input = input.value;
  if (input == "") return;
  db.collection("chat")
    .doc(sessionStorage.getItem("chatCh"))
    .get()
    .then((doc) => {
      let msgs = doc.data().msgs;
      msgs.push(
        JSON.stringify({
          user: sessionStorage.getItem("DocName"),
          username: sessionStorage.getItem("username"),
          msg: input,
        })
      );
      db.collection("chat").doc(doc.id).update({
        msgs: msgs,
      });
      document.getElementById("newMsg").value = "";
    });
}

function delGroup() {
  db.collection("chat").doc(sessionStorage.getItem("chatCh")).delete();
  getChs();
  document.getElementById("textingArea").classList.add("invis");
}
