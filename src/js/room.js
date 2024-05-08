import imageToBase64 from "../utils/imageToBase64";
import base64ToImage from "../utils/base64ToImage";
import getRandomAvatar from "../utils/getRandomAvatar";
import getRandomUsername from "../utils/getRandomUsername";
import updateUsersCounter from "../utils/updateUsersCounter";
import scrollToBottom from "../utils/scrollToBottom";

const socket = io(import.meta.env.VITE_SERVER_URL);

let usersData = [];
let messagesData = [];
let userId = crypto.randomUUID();

// elems
const form = document.getElementById("message-form");
const messagesContainer = document.getElementById("chat-messages");
const textInputEl = document.getElementById("message-input");
const fileInputEl = document.getElementById("file-input");
const fileIconEl = document.getElementById("file-icon");

// funcs
function handleSubmit(e) {
  e.preventDefault();
  sendMessage();
}

async function sendMessage() {
  const text = textInputEl.value.trim();
  const file = [...fileInputEl.files][0];

  const pic = file && (await imageToBase64(file));

  if (text.length || pic) {
    socket.emit("addMessage", { text, pic });
    fileIconEl.className = "fa-regular fa-file-image";
    form.reset();
  }
}

function removeUser(userId) {
  const usersListItem = document.querySelector(`[data-id="${userId}"]`);
  usersListItem.remove();
}

async function addUser() {
  const avatar = await getRandomAvatar();

  const user = {
    id: userId,
    name: getRandomUsername(),
    avatar,
  };

  socket.emit("addUser", user);
}

function renderNewUser(user) {
  const usersListEl = document.getElementById("users-list");

  const { avatar, name, id } = user;
  usersListEl.insertAdjacentHTML(
    `beforeend`,
    `
    <li class="users-list__item" data-id="${id}">
    ${userId === id ? `<small class=users-list__symbol>you</small>` : ""}
    <div class="users-list__user-avatar">
      <img src="${avatar}" alt="${name}">
    </div>
    <span class="users-list__username">${name}</span>
  </li>
`
  );
}

function renderUsers() {
  const usersListEl = document.getElementById("users-list");

  const markup = usersData
    .map(
      ({ id, name, avatar }) => `
  <li class="users-list__item" data-id="${id}">
  ${userId === id ? `<small class=users-list__symbol>you</small>` : ""}
    <div class="users-list__user-avatar">
      <img src="${avatar}" alt="${name}">
    </div>
    <span class="users-list__username">${name}</span>
  </li>
  `
    )
    .join("");

  usersListEl.innerHTML = markup;
}

async function renderNewMessage(messageData) {
  const {
    message: { text, pic },
    sender: { id, name, avatar },
  } = messageData;

  const image = pic && (await base64ToImage(pic));

  messagesContainer.insertAdjacentHTML(
    "beforeend",
    `

    <div class="chat__item">
    <div class="chat__user-info">
    <div class="chat__user-img">
      <img
        src="${avatar}"
        alt="${name}"
      />
    </div>
    <span class="chat__username">${name}</span>
  </div>
      <div class="chat__message ${id === userId ? "you" : ""}">
        ${text ? `<div class="chat__text">${text}</div>` : ""}
        ${
          image
            ? `<div class="chat__image"><img src="${image.src}" alt="some pic" /></div>`
            : ""
        }
      </div>
    </div>`
  );
}

async function renderMessages() {
  const promises = messagesData.map(async (item) => {
    const {
      message: { text, pic },
      sender: { id, name, avatar },
    } = item;

    const image = pic && (await base64ToImage(pic));

    return `
    <div class="chat__item">
    <div class="chat__user-info">
    <div class="chat__user-img">
      <img
        src="${avatar}"
        alt="${name}"
      />
    </div>
    <span class="chat__username">${name}</span>
  </div>
      <div class="chat__message ${id === userId ? "you" : ""}">
        <div class="chat__text">
          ${text}
        </div>

        ${
          image
            ? `<div class="chat__image">
          <img src="${image.src}" alt="some pic" />
        </div>`
            : ""
        }
      </div>
    </div>

  `;
  });

  const markup = await Promise.all(promises);

  messagesContainer.innerHTML = markup.join("");
}

socket.on("newUser", (user) => {
  usersData.push(user);
  updateUsersCounter(usersData);
  renderNewUser(user);
});

socket.on("users", (users) => {
  usersData = users;
  updateUsersCounter(usersData);
  renderUsers();
});

socket.on("messages", (messages) => {
  messagesData = messages;
  renderMessages();
  setTimeout(() => {
    scrollToBottom();
  }, 50);
});

socket.on("leaveUser", (leaveUserId) => {
  usersData = usersData.filter((u) => u.id !== leaveUserId);
  updateUsersCounter(usersData);
  removeUser(leaveUserId);
});

socket.on("newMessage", (newMessage) => {
  renderNewMessage(newMessage);

  setTimeout(() => {
    scrollToBottom();
  }, 50);
});

function uploadImage(e) {
  const file = e.target.files[0];
  if (!/^image\//.test(file.type)) {
    alert("You can only send images.");
    e.target.value = "";
    return false;
  } else {
    fileIconEl.className = "fa-solid fa-file-circle-check";
  }
}

// listeners
document.addEventListener("DOMContentLoaded", addUser);
form.addEventListener("submit", handleSubmit);
fileInputEl.addEventListener("change", uploadImage);
