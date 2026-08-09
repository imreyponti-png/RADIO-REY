const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("sendBtn");
const messagesContainer = document.getElementById("messages");

const storageKey = "radioReyChatMessages";

let chatMessages =
    JSON.parse(localStorage.getItem(storageKey)) || [];


/* =========================================
   PROTEJARE TEXT
========================================= */

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================================
   AFISARE MESAJE
========================================= */

function displayMessages() {

    messagesContainer.innerHTML = "";


    if (chatMessages.length === 0) {

        messagesContainer.innerHTML = `
            <div class="welcome-message">

                <div class="welcome-icon">
                    👋
                </div>

                <strong>
                    Bine ai venit!
                </strong>

                <span>
                    Intră în conversație și salută ascultătorii RADIO REY.
                </span>

            </div>
        `;

        return;
    }


    chatMessages.forEach(function (message) {

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "chat-message";


        messageElement.innerHTML = `
            <span class="message-name">
                ${escapeHtml(message.username)}
            </span>

            <span class="message-text">
                ${escapeHtml(message.text)}
            </span>

            <span class="message-time">
                ${escapeHtml(message.time)}
            </span>
        `;


        messagesContainer.appendChild(
            messageElement
        );

    });


    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


/* =========================================
   SALVARE MESAJE
========================================= */

function saveMessages() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(chatMessages)
    );

}


/* =========================================
   TRIMITERE MESAJ
========================================= */

function sendMessage() {

    const username =
        usernameInput.value.trim();

    const text =
        messageInput.value.trim();


    if (username === "") {

        usernameInput.focus();

        usernameInput.placeholder =
            "Introdu numele tău";

        return;
    }


    if (text === "") {

        messageInput.focus();

        messageInput.placeholder =
            "Scrie un mesaj";

        return;
    }


    const now = new Date();


    const time =
        now.toLocaleTimeString(
            "ro-RO",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    const newMessage = {

        username: username,

        text: text,

        time: time

    };


    chatMessages.push(newMessage);


    /* MAXIM 100 MESAJE */

    if (chatMessages.length > 100) {

        chatMessages.shift();

    }


    saveMessages();


    messageInput.value = "";


    displayMessages();


    messageInput.focus();

}


/* =========================================
   BUTON TRIMITE
========================================= */

sendButton.addEventListener(
    "click",
    sendMessage
);


/* =========================================
   ENTER PENTRU TRIMITERE
========================================= */

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================================
   SINCRONIZARE INTRE TAB-URI
========================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (event.key === storageKey) {

            chatMessages =
                JSON.parse(event.newValue) || [];

            displayMessages();

        }

    }
);


/* =========================================
   INCARCARE INITIALA
========================================= */

displayMessages();
