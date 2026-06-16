let utenteSessione = "";
let passwordSessione = "";
let elencoGiornateLocali = []; // Conserva temporaneamente i dati per non rifare fetch continui

function inviaConInvio(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        verificaPassword();
    }
}

function verificaPassword() {
    const utenteInput = document.getElementById("username-input");
    const passInput = document.getElementById("password-input");
    const erroreBox = document.getElementById("error-msg");

    if (!utenteInput || !passInput) return;

    const utente = utenteInput.value.trim();
    const pass = passInput.value.trim();

    if (!utente || !pass) {
        if (erroreBox) erroreBox.innerText = "Inserisci sia l'username che la password.";
        document.getElementById("login-screen").classList.add("shake");
        setTimeout(() => document.getElementById("login-screen").classList.remove("shake"), 300);
        return;
    }

    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: utente, Password: pass })
    })
    .then(res => {
        if (!res.ok) throw new Error("Credenziali errate o API irraggiungibile.");
        return res.json();
    })
    .then(risposta => {
        if (risposta.autorizzato) { 
            utenteSessione = utente;
            passwordSessione = pass;
            
            document.getElementById("nomeUtenteLoggato").innerText = utente;
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("diario-content").style.display = "block";
            
            caricaTabellaGiornate();
        }
    })
    .catch(err => { if (erroreBox) erroreBox.innerText = err.message; });
}

function caricaTabellaGiornate() {
    fetch('http://localhost:5000/api/giornate', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-DB-User': utenteSessione,
            'X-DB-Pass': passwordSessione
        }
    })
    .then(res => res.json())
    .then(dati => {
        elencoGiornateLocali = dati; 
        const container = document.getElementById("timelineContainer");
        if (!container) return;
        
        container.innerHTML = "";
        let totOre = 0, totCaffe = 0, totBug = 0;

        dati.forEach(g => {
            totOre += parseFloat(g.ore_lavorate || 0);
            totCaffe += parseInt(g.caffe_presi || 0);
            totBug += parseInt(g.bug_riscontrati || 0);

            container.innerHTML += `
                <div class="entry-card" onclick="apriDettaglio(${g.id})">
                    <div class="entry-date">📅 ${g.data_giorno} - Fase: ${g.fase_progetto}</div>
                    <h3>${g.descrizione_attivita.substring(0, 50)}...</h3>
                    <p>Ore: ${g.ore_lavorate}h | Caffè: ${g.caffe_presi} | Bug: ${g.bug_riscontrati}</p>
                </div>
            `;
        });

        document.getElementById("stat-ore").innerText = totOre;
        document.getElementById("stat-caffe").innerText = totCaffe;
        document.getElementById("stat-bug").innerText = totBug;
    })
    .catch(err => console.error("Errore di caricamento:", err));
}

function apriDettaglio(id) {
    const giornata = elencoGiornateLocali.find(x => x.id === id);
    if (!giornata) return;

    document.getElementById("modalTitle").innerText = "Modifica Report Missione";
    document.getElementById("txtId").value = giornata.id;
    document.getElementById("txtData").value = giornata.data_giorno;
    document.getElementById("txtOre").value = giornata.ore_lavorate;
    document.getElementById("txtCaffe").value = giornata.caffe_presi;
    document.getElementById("txtBug").value = giornata.bug_riscontrati;
    document.getElementById("ddlFase").value = giornata.fase_progetto;
    document.getElementById("txtTitolo").value = giornata.bug_dettaglio || "";
    document.getElementById("txtDescrizione").value = giornata.descrizione_attivita;
    
    document.getElementById("btnElimina").style.display = "block";
    document.getElementById("popup-dettaglio").style.display = "flex";
}

function apriFormNuovo() {
    document.getElementById("modalTitle").innerText = "Nuovo Report Missione";
    document.getElementById("txtId").value = "0";
    document.getElementById("txtData").value = new Date().toISOString().split('T')[0];
    document.getElementById("txtOre").value = "8";
    document.getElementById("txtCaffe").value = "0";
    document.getElementById("txtBug").value = "0";
    document.getElementById("ddlFase").value = "Sviluppo";
    document.getElementById("txtTitolo").value = "";
    document.getElementById("txtDescrizione").value = "";
    
    document.getElementById("btnElimina").style.display = "none";
    document.getElementById("popup-dettaglio").style.display = "flex";
}

function salvaGiornata() {
    const payload = {
        id: parseInt(document.getElementById("txtId").value),
        data_giorno: document.getElementById("txtData").value,
        ore_lavorate: parseFloat(document.getElementById("txtOre").value),
        caffe_presi: parseInt(document.getElementById("txtCaffe").value),
        bug_riscontrati: parseInt(document.getElementById("txtBug").value),
        fase_progetto: document.getElementById("ddlFase").value,
        bug_dettaglio: document.getElementById("txtTitolo").value,
        descrizione_attivita: document.getElementById("txtDescrizione").value
    };

    fetch('http://localhost:5000/api/giornate/salva', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-DB-User': utenteSessione,
            'X-DB-Pass': passwordSessione
        },
        body: JSON.stringify(payload)
    })
    .then(res => { if(!res.ok) throw new Error("Errore nel salvataggio dei dati."); return res.json(); })
    .then(() => { chiudiDettaglio(); caricaTabellaGiornate(); })
    .catch(err => alert(err.message));
}

function eliminaGiornata() {
    const id = parseInt(document.getElementById("txtId").value);
    if (id === 0 || !confirm("Vuoi davvero cancellare questo report?")) return;

    fetch(`http://localhost:5000/api/giornate/elimina/${id}`, {
        method: 'DELETE',
        headers: {
            'X-DB-User': utenteSessione,
            'X-DB-Pass': passwordSessione
        }
    })
    .then(res => { if(!res.ok) throw new Error("Impossibile eliminare l'elemento."); return res.json(); })
    .then(() => { chiudiDettaglio(); caricaTabellaGiornate(); })
    .catch(err => alert(err.message));
}

function chiudiDettaglio() { document.getElementById("popup-dettaglio").style.display = "none"; }
function logout() { location.reload(); }
function cambiaTema() { document.body.classList.toggle("light-mode"); }