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
  if (toDark) {
    document
      .getElementsByClassName("dropdown-menu")[0]
      .classList.add("dark-bg");
    document
      .getElementsByClassName("dropdown-menu")[0]
      .classList.add("darkTxt");
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
let loading = 0;
let audioNotif = new Audio("./soundNotif.wav");

document.onload = getChs();

function getChs() {
  exitSettings();
  loading = 0;
  chs = [];

  selector.innerHTML = "";

  db.collection("chat")
    .get()
    .then((chq) => {
      chq.forEach((ch) => {
        let users = ch.data().users;
        if (users.includes(sessionStorage.getItem("DocName"))) {
          chs.push({ ...ch.data(), id: ch.id });
          db.collection("chat")
            .doc(ch.id)
            .onSnapshot((doc) => {
              newMsg(doc, true);
            });
        }
      });

      if (chs.length == 0) {
        selector.innerHTML += "Wow such empty";
      }

      chs.forEach((ch) => {
        let child = document.createElement("button");
        child.innerHTML = ch.name;
        child.classList.add("btn");
        if (!pref.dark) {
          child.classList.add("btn-outline-dark");
        } else {
          child.classList.add("btn-outline-primary");
        }
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
  el.innerHTML = el.innerHTML.replace(" (New msg)", "");
  exitSettings();
  db.collection("chat")
    .doc(sessionStorage.getItem("chatCh"))
    .get()
    .then((doc) => {
      newMsg(doc, false);
    });
}

function newChatIn() {
  console.log("hi");
  exitSettings();
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

function newMsg(doc, playSound) {
  if (loading < chs.length) {
    loading++;
    return;
  }
  if (doc.data() == undefined) return;
  if (doc.id == sessionStorage.getItem("chatCh")) {
    let area = document.getElementById("msgs");
    let msgs = doc.data().msgs;

    area.innerHTML = "";
    let topDiv = document.createElement("div");
    let title = document.createElement("h3");
    title.innerHTML = doc.data().name;
    topDiv.appendChild(title);
    let del = document.createElement("button");
    del.classList.add("btn");
    del.classList.add("btn-outline-primary");
    del.innerHTML = "Settings";
    del.onclick = function (e) {
      openSettings();
    };

    if (pref.dark) {
      topDiv.classList.add("chatBgDark");
    } else {
      topDiv.classList.add("chatBgLight");
    }
    topDiv.appendChild(document.createElement("hr"));
    topDiv.appendChild(del);
    topDiv.setAttribute("id", "topDiv");
    document.getElementById("msgsBanner").innerHTML = "";
    document.getElementById("msgsBanner").appendChild(topDiv);

    let topDivBF = document.createElement("div");
    topDivBF.setAttribute("style", "height: 12vh");
    area.appendChild(topDivBF);

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

      msg.msg = checkForLink(msg.msg);

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
    if (playSound == true) {
      if (
        JSON.parse(msgs[msgs.length - 1]).user !==
        sessionStorage.getItem("DocName")
      ) {
        audioNotif.pause();
        audioNotif.currentTime = 0;
        audioNotif.play();
      }
    }
  } else {
    let docName;
    chs.forEach((ch) => {
      if (ch.name == doc.data().name) {
        docName = ch.name;
      }
    });
    console.log(docName);
    let chElms = document.getElementById("chatSelector").children;
    let elm;
    for (let i = 0; i < chElms.length; i++) {
      if (chElms[i].innerHTML == docName) {
        elm = chElms[i];
      }
    }
    elm.innerHTML += ` (New msg)`;
  }
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
  exitSettings();
  document.getElementById("textingArea").classList.add("invis");
}

function checkForLink(str) {
  let link = "";
  let last = -1;
  let first = str.indexOf("http");
  if (str.includes("http")) {
    for (let i = 0; i < str.length; i++) {
      if (i > str.indexOf("http")) {
        if (str[i] == " ") {
          last = i;
        }
      }
      if (i == str.length - 1) {
        last = str.length - 1;
      }
      if (last != -1) {
        i = str.length;
      }
    }
    link = str.substring(first, last + 1);

    let https = false;
    if (link.includes("https") && link.indexOf("https") == 0) {
      https = true;
    }

    if (https == true) {
      str = str.replace(
        link,
        `<a href="${link}" target="blank">${link.replace("https://", "")}</a>`
      );
    } else {
      str = str.replace(
        link,
        `<a href="${link}" target="blank">${link.replace("http://", "")}</a>`
      );
    }
  }

  return str;
}

function searchUsers() {
  const searchTerm = document.getElementById("searchBarNewChat");

  let user = [];

  db.collection("users")
    .get()
    .then((querySearch) => {
      querySearch.forEach((doc) => {
        let Username = doc.data().username;
        if (Username.toLowerCase().includes(searchTerm.value)) {
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
      document.getElementById("searchResNewChat").innerHTML = "";
      for (let i = 0; i < repetitions; i++) {
        console.log("hi");
        let child = document.createElement("button");
        child.innerHTML = user[i].username;
        child.classList.add("btn");
        if (!pref.dark) {
          child.classList.add("btn-outline-dark");
          child.classList.add("SearchResult");
        } else {
          child.classList.add("btn-outline-primary");
          child.classList.add("SearchResultDark");
        }
        child.setAttribute(
          "style",
          "width: calc(80vw*0.66*0.8); margin-left: calc(80vw*0.66*0.05)"
        );
        child.value = user[i].docId;
        child.data = user[i].username;
        child.onclick = function (e) {
          addToList(this);
        };
        document.getElementById("searchResNewChat").appendChild(child);
      }
    });
}

function addToList(elm) {
  let input = document.getElementById("usernames");
  if (input.value !== "") {
    input.value += `, ${elm.data}`;
  } else input.value = elm.data;
}

function sendMsgEnter(e) {
  if (e.keyCode === 13) {
    e.preventDefault(); // Ensure it is only this code that runs

    sendMsg();
  }
}

function openSettings(elm) {
  let settingsElm = document.getElementById("chatSettings");
  settingsElm.className = "";
  if (pref.dark) {
    settingsElm.classList.add("chatBgDark");
  } else {
    settingsElm.classList.add("chatBgLight");
  }

  let usersInChat = document.getElementById("usersInChatDisplay");
  usersInChat.innerHTML = "";
  db.collection("chat")
    .doc(sessionStorage.getItem("chatCh"))
    .get()
    .then((doc) => {
      let users = doc.data().users;
      users.forEach((user) => {
        db.collection("users")
          .doc(user)
          .get()
          .then((userDoc) => {
            let child = document.createElement("button");
            child.classList.add("btn");
            child.classList.add("btn-outline-primary");
            child.innerHTML = userDoc.data().username;
            child.data = userDoc.data().name;
            child.value = userDoc.id;
            child.onclick = function (e) {
              goToPerson(this);
            };
            usersInChat.appendChild(child);
          });
      });
    });
}

function exitSettings() {
  let settingsElm = document.getElementById("chatSettings");
  settingsElm.classList.add("invis");
}

function addToGroup() {
  let input = document.getElementById("addToGroupInput");

  let userData;

  db.collection("users")
    .get()
    .then((q) => {
      q.forEach((doc) => {
        if (doc.data().username == input.value) {
          userData = { ...doc.data(), id: doc.id };
        }
      });
      if (userData == undefined) {
        input.value = "";
        return alert("No user found");
      } else {
        db.collection("chat")
          .doc(sessionStorage.getItem("chatCh"))
          .get()
          .then((ch) => {
            let usersArr = ch.data().users;
            if (usersArr.includes(userData.id)) {
              input.value = "";
              return alert("User already in the chat group");
            } else {
              usersArr.push(userData.id);
              db.collection("chat")
                .doc(sessionStorage.getItem("chatCh"))
                .update({
                  users: usersArr,
                });
              input.value = "";
              return alert("Success");
            }
          });
      }
    });
}

function kickFromGroup() {
  let input = document.getElementById("kickFromGroupInput");

  let userData;
  db.collection("chat")
    .doc(sessionStorage.getItem("chatCh"))
    .get()
    .then((ch) => {
      db.collection("users")
        .get()
        .then((q) => {
          q.forEach((userDoc) => {
            if (userDoc.data().username == input.value) {
              userData = { ...userDoc.data(), id: userDoc.id };
            }
          });
          if (userData == undefined) {
            input.value = "";
            return alert("No user found");
          } else {
            if (ch.data().users.includes(userData.id)) {
              let userArr = ch.data().users;

              userArr = arrayRemove(userArr, userData.id);

              db.collection("chat")
                .doc(sessionStorage.getItem("chatCh"))
                .update({
                  users: userArr,
                });
              input.value = "";
              return alert("Success");
            } else {
              input.value = "";
              return alert("User not in the group");
            }
          }
        });
    });
}

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

function changeName() {
  let input = document.getElementById("changeNameInput");

  if (input.value.trim() != "") {
    db.collection("chat").doc(sessionStorage.getItem("chatCh")).update({
      name: input.value.trim(),
    });
    alert("Success");
    input.value = "";
    return getChs();
  } else {
    input.value = "";
    return alert("Invalid name");
  }
}
