import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyB1UTGfRK_I6A9qRHkdJCYGvzVRSzzAzn8",
    authDomain: "radio-rey-b81ea.firebaseapp.com",
    projectId: "radio-rey-b81ea",
    storageBucket: "radio-rey-b81ea.firebasestorage.app",
    messagingSenderId: "209865095703",
    appId: "1:209865095703:web:1954df12fa3f6bf7877a52",
    measurementId: "G-TJCFBZE3J1"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


const messagesDiv = document.getElementById("messages");

const usernameInput = document.getElementById("username");

const messageInput = document.getElementById("message");

const sendBtn = document.getElementById("sendBtn");


const messagesRef = collection(db, "messages");


const messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "asc")
);


/* PĂSTRĂM NUMELE UTILIZATORULUI */

const savedUsername = localStorage.getItem("radioReyUsername");

if (savedUsername) {
    usernameInput.value = savedUsername;
}


/* AFIȘARE MESaje */

onSnapshot(messagesQuery, (snapshot) => {

    messagesDiv.innerHTML = "";

    const currentUsername = usernameInput.value.trim();

    snapshot.forEach((doc) => {

        const data = doc.data();

        const username = data.username || "Anonim";

        const message = data.message || "";

        const isMine = currentUsername !== "" && username === currentUsername;


        /* AVATAR */

        const firstLetter = username
            .charAt(0)
            .toUpperCase();


        /* ORA */

        let time = "";

        if (data.createdAt) {

            time = data.createdAt.toDate().toLocaleTimeString(
                "ro-RO",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }


        /* MESAJ */

        const messageElement = document.createElement("div");

        messageElement.className =
            isMine
                ? "message-row mine"
                : "message-row";


        messageElement.innerHTML = `

            <div class="avatar">
                ${escapeHtml(firstLetter)}
            </div>

            <div class="message">

                <div class="message-header">

                    <strong>
                        ${escapeHtml(username)}
                    </strong>

                    <span>
                        ${time}
                    </span>

                </div>

                <div class="message-text">
                    ${escapeHtml(message)}
                </div>

            </div>

        `;


        messagesDiv.appendChild(messageElement);

    });


    messagesDiv.scrollTop = messagesDiv.scrollHeight;

});


/* BUTON TRIMITE */

sendBtn.addEventListener("click", sendMessage);


/* ENTER = TRIMITE */

messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        sendMessage();

    }

});


/* TRIMITERE MESAJ */

async function sendMessage() {

    const username = usernameInput.value.trim();

    const message = messageInput.value.trim();


    if (!username) {

        alert("Introdu numele tău.");

        usernameInput.focus();

        return;

    }


    if (!message) {

        messageInput.focus();

        return;

    }


    try {

        sendBtn.disabled = true;


        /* SALVĂM NUMELE */

        localStorage.setItem(
            "radioReyUsername",
            username
        );


        /* SALVĂM MESAJUL ÎN FIREBASE */

        await addDoc(messagesRef, {

            username: username,

            message: message,

            createdAt: serverTimestamp()

        });


        messageInput.value = "";

        messageInput.focus();


    } catch (error) {

        console.error(
            "Eroare Firebase:",
            error
        );

        alert(
            "Mesajul nu a putut fi trimis."
        );


    } finally {

        sendBtn.disabled = false;

    }

}


/* PROTECȚIE HTML */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
