const usernameInput =
    document.getElementById("username");

const messageInput =
    document.getElementById("message");

const sendButton =
    document.getElementById("sendBtn");

const messages =
    document.getElementById("messages");


let chatMessages =
    JSON.parse(
        localStorage.getItem("radioReyChat")
    ) || [];


/* AFIȘARE MESAJE */

function displayMessages() {

    messages.innerHTML = "";


    if (chatMessages.length === 0) {

        messages.innerHTML = `
            <div class="welcome-message">
                👋 Bine ai venit în chatul RADIO REY!
            </div>
        `;

        return;
    }


    chatMessages.forEach(function(message) {

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "chat-message";


        const nameElement =
            document.createElement("span");

        nameElement.className =
            "message-name";

        nameElement.textContent =
            message.username;


        const textElement =
            document.createElement("span");

        textElement.className =
            "message-text";

        textElement.textContent =
            message.text;


        const timeElement =
            document.createElement("span");

        timeElement.className =
            "message-time";

        timeElement.textContent =
            message.time;


        messageElement.appendChild(
            nameElement
        );

        messageElement.appendChild(
            textElement
        );

        messageElement.appendChild(
            timeElement
        );


        messages.appendChild(
            messageElement
        );

    });


    messages.scrollTop =
        messages.scrollHeight;

}


/* TRIMITERE MESAJ */

function sendMessage() {

    const username =
        usernameInput.value.trim();

    const text =
        messageInput.value.trim();


    if (username === "") {

        alert(
            "Te rog scrie numele tău."
        );

        usernameInput.focus();

        return;
    }


    if (text === "") {

        alert(
            "Scrie un mesaj înainte să îl trimiți."
        );

        messageInput.focus();

        return;
    }


    const now =
        new Date();


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


    chatMessages.push(
        newMessage
    );


    /* PĂSTREAZĂ MAXIM 100 MESAJE */

    if (
        chatMessages.length > 100
    ) {

        chatMessages.shift();

    }


    localStorage.setItem(
        "radioReyChat",
        JSON.stringify(
            chatMessages
        )
    );


    messageInput.value = "";


    displayMessages();


    messageInput.focus();

}


/* BUTON TRIMITE */

sendButton.addEventListener(
    "click",
    sendMessage
);


/* ENTER PENTRU TRIMITERE */

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            sendMessage();

        }

    }
);


/* ÎNCĂRCARE MESAJE */

displayMessages();
