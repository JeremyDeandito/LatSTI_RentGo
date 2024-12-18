import { db } from "../firebase-config.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const userList = document.getElementById("userList");
const messages = document.getElementById("messages");
const messageInput = document.getElementById("message");
const submitButton = document.getElementById("submit");

let selectedUser = null;

// Jennifer sebagai current user
const currentUser = "Jennifer";
const users = ["You"]; // Daftar user yang bisa diajak chat

// Load Sidebar User List
users.forEach((user) => {
  const li = document.createElement("li");
  li.textContent = user;
  li.addEventListener("click", () => loadChat(user));
  userList.appendChild(li);
});

// Load Messages from Firestore
async function loadChat(user) {
  selectedUser = user;
  messages.innerHTML = "";
  document.getElementById("chatHeader").innerText = `Chat with ${user}`;

  const chatId = [currentUser, user].sort().join("_");

  const q = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp")
  );

  onSnapshot(q, (snapshot) => {
    messages.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.className =
        msg.sender === currentUser ? "message-sent" : "message-received";
      div.textContent = `${msg.sender}: ${msg.text}`;
      messages.appendChild(div);
    });
  });
}

// Send Message
submitButton.addEventListener("click", async () => {
  if (messageInput.value.trim() && selectedUser) {
    const chatId = [currentUser, selectedUser].sort().join("_");

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      sender: currentUser,
      text: messageInput.value,
      timestamp: new Date(),
    });

    messageInput.value = "";
  }
}); 