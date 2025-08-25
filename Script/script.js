let isListening = false;
let themeTurn = false;
let transcript = "";
const message = "Para usar o comando de voz, permita o acesso ao microfone.";

const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");
const circle1 = document.getElementById("circle_1");
const circle2 = document.getElementById("circle_2");
const circle3 = document.getElementById("circle_3");
const body = document.body;

function updateUI() {
    body.className = themeTurn ? "themeBody themeDark" : "themeBody themeLight";
    circle1.className = isListening ? "circle_1 speech_animation" : "circle_1";
    circle2.className = isListening ? "circle_2 speech_animation" : "circle_2";
    circle3.className = isListening ? "circle_3 speech_animation" : "circle_3";
    statusEl.textContent = isListening ? "Estou ouvindo" : "Diga Olá!";
    transcriptEl.textContent = transcript ? transcript : message;
}

function toggleListening() {
    isListening = !isListening;
    updateUI();
    if (isListening) {
        startRecognition();
    }
}

function startRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript;
        if (result === "limpar texto") {
            transcript = "";
        } else if (result === "trocar tema") {
            themeTurn = !themeTurn;
        } else if (result === "parar") {
            toggleListening();
        } else if (result === "copiar texto") {
            if (transcript) {
                navigator.clipboard.writeText(transcript);
                statusEl.textContent = "Texto copiado!";
            }
        } else if (result === "apagar última palavra") {
            transcript = transcript.trim().split(" ").slice(0, -1).join(" ");
        } else if (result === "ajuda") {
            transcript = "Comandos disponíveis: limpar texto, trocar tema, parar, copiar texto, apagar última palavra, ajuda.";
        } else {
            transcript += (transcript ? " " : "") + result;
        }
        updateUI();
        recognition.stop();
        if (isListening) recognition.start();
    };
    recognition.onend = function() {
        if (isListening) recognition.start();
    };
    recognition.start();
}

function applyGlobalTheme() {
    const savedTheme = localStorage.getItem("themeTurn");
    if (savedTheme === "dark") {
        document.body.className = "themeBody themeDark";
    } else {
        document.body.className = "themeBody themeLight";
    }
}

applyGlobalTheme();

circle3.addEventListener("click", toggleListening);

updateUI();