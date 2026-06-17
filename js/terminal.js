// --- 1. CONFIGURAZIONE EFFETTO MATRIX CASCATA ---
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Ridimensiona il canvas a tutto schermo
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Caratteri usati nella cascata (Katakana giapponesi + numeri)
const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1023456789";
const alphabet = katakana.split("");

const fontSize = 16;
let columns = canvas.width / fontSize;

// Array per tracciare la coordinata Y di ogni colonna
const rainDrops = [];
for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}

// Funzione che disegna la pioggia di codice
function drawMatrix() {
    // Sfondo semi-trasparente nero per creare l'effetto scia delle lettere
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0'; // Verde Matrix
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        // Prendi un carattere a caso
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        // Disegna il carattere
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        // Se il carattere arriva a fondo schermo, rimandalo in alto con un ritardo casuale
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
}

// Avvia l'animazione della cascata a 30 fotogrammi al secondo
let matrixInterval = setInterval(drawMatrix, 30);


// --- 2. LOGICA DELLA PAGINA SEGRETA ---
const popup = document.getElementById('crypto-popup');
const errorMsg = document.getElementById('error-msg');
const passInput = document.getElementById('pass-input');

function openTerminal() {
    // Mostra il pop-up inserimento dati
    popup.style.display = 'block';
    passInput.focus();
}

function closeTerminal() {
    // Nasconde il pop-up e pulisce i campi
    popup.style.display = 'none';
    errorMsg.style.display = 'none';
    passInput.value = '';
}

function checkPassword() {
    // La tua password esatta richiesta
    if (passInput.value === "Mussolini") {
        errorMsg.style.display = 'none';
        alert("🔓 DECRIPTAZIONE COMPLETATA. ENTRANDO NEL LIVELLO SEGRETO...");
        window.location.href = "paginasegreta.html"; // Metti qui il nome della tua pagina segreta vera
    } else {
        // Mostra il messaggio di errore se sbagli
        errorMsg.style.display = 'block';
        passInput.value = '';
        passInput.focus();
    }
}

// Permette di premere "Invio" sulla tastiera per confermare la password
passInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});