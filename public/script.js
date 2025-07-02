const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const socket = io();
const user = prompt('What is your name?');

// Join the chat
appendMessage("", "right", "You joined");
socket.emit('new-user', user);

// Listen for messages from other users
socket.on('chat-message', data => {
    appendMessage(data.user, "left", data.message);
});

// Listen for user connections
socket.on('user-connected', user => {
    appendMessage("", "left", `${user} connected`);
});

// Listen for user disconnections
socket.on('user-disconnected', user => {
    appendMessage("", "left", `${user} disconnected`);
});

// Handle form submission
msgerForm.addEventListener("submit", event => {
    event.preventDefault();
    
    const msgText = msgerInput.value;
    if (!msgText) return;
    
    appendMessage(user, "right", msgText);
    socket.emit('send-chat-message', msgText);
    msgerInput.value = "";
});

function appendMessage(name, side, text) {
    const msgHTML = `
        <div class="msg ${side}-msg">
            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${name}</div>
                    <div class="msg-info-time">${formatDate(new Date())}</div>
                </div>
                <div class="msg-text">${text}</div>
            </div>
        </div>
    `;
    
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop = msgerChat.scrollHeight;
}

function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}