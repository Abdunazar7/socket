let messages = document.querySelector(".messages");
let inp = document.querySelector(".inp");
let btn = document.querySelector(".btn");
let btnJoin = document.querySelector(".btnJoin");
let gr = document.querySelector(".gr");
let btnLeave = document.querySelector(".btnLeave");
let privateIdInput = document.querySelector(".privateId");
let btnPrivate = document.querySelector(".btnPrivate");

const socket = io("http://localhost:3000/");

socket.on("message", (m) => {
  const date = new Date(m.date).toLocaleTimeString();
  messages.insertAdjacentHTML(
    "beforeend",
    `<div class="msg">
        <p>${m.text}</p>
        <b>From: ${m.from}</b> | <small>${date}</small>
    </div>`
  );
});

socket.on("private-message", (m) => {
  const date = new Date(m.date).toLocaleTimeString();
  messages.insertAdjacentHTML(
    "beforeend",
    `<div class="msg private-msg">
        <p><i>(Private)</i> ${m.text}</p>
        <b>From: ${m.from}</b> | <small>${date}</small>
    </div>`
  );
});

btn.addEventListener("click", (e) => {
  if (inp.value) {
    socket.emit("newmessage", { text: inp.value, gr: gr.value });
    inp.value = "";
  }
});

btnJoin.addEventListener("click", (e) => {
  if (gr.value) {
    socket.emit("join-gr", gr.value);
  }
});

btnLeave.addEventListener("click", (e) => {
  if (gr.value) {
    socket.emit("leave-gr", gr.value);
  }
});

btnPrivate.addEventListener("click", (e) => {
  const recipientId = privateIdInput.value;
  if (inp.value && recipientId) {
    socket.emit("private-message", { text: inp.value, to: recipientId });
    inp.value = "";
  }
});