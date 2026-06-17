  //==========================================

   //🌐 CONFIGURAZIONE BASE API (BACKEND)

  // ========================================== */

   const API_BASE_URL = "http://localhost:5000/api";

   let idModificaInCorso = 0; // Serve per capire se stiamo salvando un nuovo report o modificando uno esistente

   let mioGrafico = null;

   // Al caricamento della pagina, mostra solo il login e resetta i campi

   // Al caricamento della pagina, mostra il login, resetta i campi e attiva il tasto Invio

window.onload = function() {

    document.getElementById("sezione-login").style.display = "flex";

    document.getElementById("sezione-dashboard").style.display = "none";



    // ⌨️ AGGIUNTA: Se premi INVIO mentre scrivi la password, esegue il login in automatico

    const campoPassword = document.getElementById("login-password");

    if (campoPassword) {

        campoPassword.addEventListener("keyup", function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                eseguiLogin();

            }

        });

    }

};

   

   /* ==========================================

      🔒 GESTIONE AUTENTICAZIONE (LOGIN)

      ========================================== */

   function eseguiLogin() {

       const user = document.getElementById("login-username").value;

       const pass = document.getElementById("login-password").value;

       const erroreDiv = document.getElementById("login-errore");

   

       erroreDiv.style.display = "none";

   

       // Chiamata FETCH verso il server C#

       fetch(`${API_BASE_URL}/login`, {

           method: "POST",

           headers: { "Content-Type": "application/json" },

           body: JSON.stringify({ Username: user, Password: pass })

       })

       .then(response => {

           if (!response.ok) {

               throw new Error("Credenziali errate o Server spento!");

           }

           return response.json();

       })

       .then(data => {

           if (data.autorizzato) {

               // Sblocca la plancia comandi nascondendo il login

               document.getElementById("sezione-login").style.display = "none";

               document.getElementById("sezione-dashboard").style.display = "block";

               // Carica subito le giornate salvate nel file JSON

               caricaGiornateDalServer();

           }

       })

       .catch(err => {

           erroreDiv.innerText = "🚨 ACCESSO NEGATO: Credenziali non valide.";

           erroreDiv.style.display = "block";

       });

   }



   function apriDiario() {

    const nome = document.getElementById('username').value;

   

    if (nome.trim() !== "") {

        // 1. Nascondi il login (che ora non è stato minimamente spostato dal CSS)

        document.getElementById('login-section').style.display = 'none';

       

        // 2. Mostra l'area del libro (in questo momento la copertina è chiusa)

        const strutturaLibro = document.getElementById('struttura-libro');

        strutturaLibro.style.display = 'flex';

       

        // 3. Attendi un istante per far capire al browser che il libro esiste, poi sfoglialo

        setTimeout(() => {

            document.getElementById('copertina-diario').classList.add('aperta');

        }, 150); // 150 millisecondi di respiro prima dell'apertura

    } else {

        alert("Inserisci un nome operatore.");

    }

}

   

   /* ==========================================

      📊 MOTORE DIARIO: CARICAMENTO E TABELLA

      ========================================== */

      function caricaGiornateDalServer() {

        fetch(`${API_BASE_URL}/giornate`)

        .then(res => res.json())

        .then(giornate => {

            const corpoTabella = document.getElementById("tabella-giornate-corpo");

            corpoTabella.innerHTML = "";

   

            let sommaOre = 0;

            let sommaBug = 0;

            let sommaCaffe = 0;

   

            if (giornate.length === 0) {

                corpoTabella.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#8fa0dd;">Nessun report presente nel database JSON. Creatne uno!</td></tr>`;

                document.getElementById("totale-ore").innerText = "0.0";

                document.getElementById("totale-bug").innerText = "0";

                document.getElementById("totale-caffe").innerText = "0";

               

                // Aggiorna anche la barra a 0 se il database viene svuotato

                document.getElementById("testo-predizione").innerHTML = `Sei al <strong style="color: #00f2fe;">0%</strong> del tuo percorso. Ore rimanenti: <strong style="color: #ff007f;">150.0</strong>`;

                document.getElementById("barra-progresso-interna").style.width = "0%";

               

                aggiornaGrafico(0, 0, 0);

                return;

            }

   

            giornate.forEach(g => {

                sommaOre += parseFloat(g.ore_lavorate) || 0;

                sommaBug += parseInt(g.bug_riscontrati) || 0;

                sommaCaffe += parseInt(g.caffe_presi) || 0;

   

                const dataFormattata = new Date(g.data_giorno).toLocaleDateString('it-IT');

                const stringaOggetto = JSON.stringify(g).replace(/"/g, '&quot;');

   

                const riga = document.createElement("tr");

                riga.innerHTML = `

                    <td style="font-weight:bold; color:#00f2fe;">${dataFormattata}</td>

                    <td>${g.ore_lavorate} ore</td>

                    <td>☕ ${g.caffe_presi}</td>

                    <td style="color:#ff007f; font-weight:bold;">🐛 ${g.bug_riscontrati}</td>

                    <td><span style="color:#00ff87;">[${g.fase_progetto}]</span></td>

                    <td style="font-style:italic; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${g.bug_dettaglio || '-'}</td>

                    <td style="max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${g.descrizione_attivita}</td>

                    <td style="text-align: center;">

                        <button onclick="avviaModifica(${stringaOggetto})" style="background:transparent; border:1px solid #00f2fe; color:#00f2fe; padding:4px 8px; border-radius:3px; cursor:pointer; margin-right:5px;">✍️</button>

                        <button onclick="eliminaGiornata(${g.id})" style="background:transparent; border:1px solid #ff007f; color:#ff007f; padding:4px 8px; border-radius:3px; cursor:pointer;">🗑️</button>

                    </td>

                `;

                corpoTabella.appendChild(riga);

            });

   

            document.getElementById("totale-ore").innerText = sommaOre.toFixed(1);

            document.getElementById("totale-bug").innerText = sommaBug;

            document.getElementById("totale-caffe").innerText = sommaCaffe;

   

            // 🎯 CALCOLO PREDIZIONE ED EVOLUZIONE BARRA DI AVANZAMENTO (Ora dentro il flusso dei dati!)

            const ORE_TOTALI_RICHIESTE = 160;

           

            let percentuale = (sommaOre / ORE_TOTALI_RICHIESTE) * 100;

            if (percentuale > 100) percentuale = 100;

           

            let oreRimanenti = ORE_TOTALI_RICHIESTE - sommaOre;

            if (oreRimanenti < 0) oreRimanenti = 0;

   

            const elementoTesto = document.getElementById("testo-predizione");

            if (sommaOre >= ORE_TOTALI_RICHIESTE) {

                elementoTesto.innerHTML = `🎉 <strong style="color: #00ff87;">STAGE COMPLETATO!</strong> (${sommaOre.toFixed(1)} / ${ORE_TOTALI_RICHIESTE} ore)`;

            } else {

                elementoTesto.innerHTML = `Sei al <strong style="color: #00f2fe;">${percentuale.toFixed(0)}%</strong> del tuo percorso. Ore rimanenti: <strong style="color: #ff007f;">${oreRimanenti.toFixed(1)}</strong>`;

            }

   

            document.getElementById("barra-progresso-interna").style.width = `${percentuale}%`;

   

            // Aggiorna il grafico con i nuovi totali

            aggiornaGrafico(sommaOre, sommaBug, sommaCaffe);

        })

        .catch(err => console.error("Errore nel caricamento delle giornate:", err));

    }

   /* ==========================================

      📝 APERTURA/CHIUSURA FINESTRE POPUP DIARIO

      ========================================== */

   function apriPopupNuovoReport() {

       idModificaInCorso = 0; // Reset modalità inserimento

       document.getElementById("txtData").value = new Date().toISOString().split('T')[0]; // Imposta data di oggi automatica

       document.getElementById("txtOre").value = "";

       document.getElementById("txtCaffe").value = "";

       document.getElementById("txtBug").value = "0";

       document.getElementById("txtTitolo").value = "";

       document.getElementById("txtDescrizione").value = "";

       document.getElementById("popup-dettaglio").style.display = "flex";

   }

   

   function chiudiPopupNuovoReport() {

       document.getElementById("popup-dettaglio").style.display = "none";

   }

   

   function avviaModifica(giornata) {

       idModificaInCorso = giornata.id;

       // Popoliamo i campi con i dati esistenti da modificare

       document.getElementById("txtData").value = giornata.data_giorno.split('T')[0];

       document.getElementById("txtOre").value = giornata.ore_lavorate;

       document.getElementById("txtCaffe").value = giornata.caffe_presi;

       document.getElementById("txtBug").value = giornata.bug_riscontrati;

       document.getElementById("ddlFase").value = giornata.fase_progetto;

       document.getElementById("txtTitolo").value = giornata.bug_dettaglio;

       document.getElementById("txtDescrizione").value = giornata.descrizione_attivita;

       

       document.getElementById("popup-dettaglio").style.display = "flex";

   }

   

   /* ==========================================

      💾 SCRITTURA E CANCELLAZIONE DATI

      ========================================== */

   function salvaDatiGiornata() {

       const report = {

           id: idModificaInCorso,

           data_giorno: document.getElementById("txtData").value,

           ore_lavorate: parseFloat(document.getElementById("txtOre").value) || 0,

           caffe_presi: parseInt(document.getElementById("txtCaffe").value) || 0,

           bug_riscontrati: parseInt(document.getElementById("txtBug").value) || 0,

           fase_progetto: document.getElementById("ddlFase").value,

           bug_dettaglio: document.getElementById("txtTitolo").value,

           descrizione_attivita: document.getElementById("txtDescrizione").value

       };

   

       fetch(`${API_BASE_URL}/giornate/salva`, {

           method: "POST",

           headers: { "Content-Type": "application/json" },

           body: JSON.stringify(report)

       })

       .then(res => res.json())

       .then(() => {

           chiudiPopupNuovoReport();

           caricaGiornateDalServer(); // Ricarica la tabella aggiornata dal file JSON

       })

       .catch(err => alert("Errore durante il salvataggio dei dati. Controlla il server API."));

   }

   

   function eliminaGiornata(id) {

       if (!confirm("Sei sicuro di voler eliminare definitivamente questo report dal file JSON?")) return;

   

       fetch(`${API_BASE_URL}/giornate/elimina/${id}`, {

           method: "DELETE"

       })

       .then(() => {

           caricaGiornateDalServer();

       })

       .catch(err => alert("Impossibile eliminare l'elemento."));

   }

   

   

   /* ==========================================

      🕹️ MOTORINO GIOCO: BUG SMASHER (ARCADE MODE)

      ========================================== */

   let gameScore = 0;

   let gameTimeLeft = 30;

   let countdownInterval;

   let spawnInterval;

   let gameActive = false;

   

   const bugDatabase = ["NullReferenceException", "Error 500: Crash", "StackOverflow", "404: Not Found", "IndexOutOfRange", "FATAL_ERROR", "SyntaxError"];

   

   function apriGioco() {

       document.getElementById("game-overlay").style.display = "flex";

       resetTabellone();

   }

   

   function chiudiGioco() {

       gameActive = false;

       clearInterval(countdownInterval);

       clearInterval(spawnInterval);

       document.getElementById("game-overlay").style.display = "none";

   }

   

   function resetTabellone() {

       gameScore = 0;

       gameTimeLeft = 30;

       document.getElementById("game-score").innerText = gameScore;

       document.getElementById("game-timer").innerText = gameTimeLeft;

       document.getElementById("game-area").innerHTML = `

           <div id="start-screen" style="text-align: center;">

               <p style="color: #ffffff; font-family: 'Poppins', sans-serif; margin-bottom: 20px; font-size: 14px;">

                   Il sistema è sotto attacco! Elimina tutti i bug fluttuanti prima dello scadere del timer.

               </p>

               <button id="start-game-btn" class="btn-action btn-success" onclick="iniziaGioco()" style="margin: 0 auto;">

                   AVVIA DISINFESTAZIONE

               </button>

           </div>

       `;

   }

   

   function iniziaGioco() {

       if (gameActive) return;

       gameActive = true;

       

       document.getElementById("game-area").innerHTML = "";

       

       countdownInterval = setInterval(aggiornaOrologio, 1000);

       spawnInterval = setInterval(generaBugInMappa, 700); // 700ms velocizza un filo lo spawn rispetto a prima!

   }

   

   function aggiornaOrologio() {

       gameTimeLeft--;

       document.getElementById("game-timer").innerText = gameTimeLeft;

       

       if (gameTimeLeft <= 0) {

           arrestaGioco();

       }

   }

   

   function generaBugInMappa() {

       if (!gameActive) return;

       

       const area = document.getElementById("game-area");

       const bugElement = document.createElement("div");

       bugElement.className = "bug-target";

       

       const testoErrore = bugDatabase[Math.floor(Math.random() * bugDatabase.length)];

       bugElement.innerText = "🐛 " + testoErrore;

       

       const coordinataMaxX = area.clientWidth - 190;

       const coordinataMaxY = area.clientHeight - 45;

       

       const coordinataX = Math.floor(Math.random() * Math.max(0, coordinataMaxX));

       const coordinataY = Math.floor(Math.random() * Math.max(0, coordinataMaxY));

       

       bugElement.style.left = coordinataX + "px";

       bugElement.style.top = coordinataY + "px";

       

       bugElement.onclick = function() {

           gameScore++;

           document.getElementById("game-score").innerText = gameScore;

           bugElement.remove();

       };

       

       area.appendChild(bugElement);

       

       setTimeout(() => {

           if (bugElement.parentNode) {

               bugElement.remove();

           }

       }, 1200); // Il bug scompare se non cliccato entro 1.2s

   }

   

   function arrestaGioco() {

       gameActive = false;

       clearInterval(countdownInterval);

       clearInterval(spawnInterval);

       

       document.getElementById("game-area").innerHTML = `

           <div style="text-align: center; font-family: 'Orbitron', sans-serif; color: #00f2fe;">

               <h3 style="font-size: 26px; color: #00f2fe; text-shadow: 0 0 10px #00f2fe; margin-bottom: 5px;">SISTEMA DECONTAMINATO</h3>

               <p style="font-size: 16px; color: #ffffff; margin-bottom: 25px;">Hai fixato in tempo record ben <strong style="color:#ff007f;">${gameScore}</strong> bug critici!</p>

               <button class="btn-action btn-success" onclick="resetTabellone()" style="margin: 0 auto;">RIPROVA</button>

           </div>

       `;

   }



   /* ==========================================

   📊 FUNZIONE GENERAZIONE GRAFICO (CHART.JS)

   ========================================== */

function aggiornaGrafico(ore, bug, caffe) {

    const ctx = document.getElementById('kpiChart').getContext('2d');



    // Se il grafico esiste già, aggiorna solo i dati interni senza distruggere la grafica

    if (mioGrafico !== null) {

        mioGrafico.data.datasets[0].data = [ore, bug, caffe];

        mioGrafico.update();

        return;

    }



    // Configurazione iniziale del grafico Chart.js (Stile Cyberpunk)

    mioGrafico = new Chart(ctx, {

        type: 'bar',

        data: {

            labels: ['Ore', 'Bug', 'Caffè'],

            datasets: [{

                data: [ore, bug, caffe],

                backgroundColor: [

                    'rgba(0, 242, 254, 0.25)',  // Azzurro Neon (Ore)

                    'rgba(255, 0, 127, 0.25)',  // Rosa Neon (Bug)

                    'rgba(0, 255, 135, 0.25)'   // Verde Neon (Caffè)

                ],

                borderColor: [

                    '#00f2fe',

                    '#ff007f',

                    '#00ff87'

                ],

                borderWidth: 2,

                borderRadius: 4

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: { display: false } // Nasconde la legenda inutile

            },

            scales: {

                y: {

                    beginAtZero: true,

                    grid: { color: 'rgba(255, 255, 255, 0.05)' },

                    ticks: {

                        color: '#8fa0dd',

                        font: { family: 'Orbitron', size: 10 }

                    }

                },

                x: {

                    grid: { display: false },

                    ticks: {

                        color: '#ffffff',

                        font: { family: 'Orbitron', size: 11, weight: 'bold' }

                    }

                }

            }

        }

    });

}

/* ==========================================

   📥 FUNZIONE SCARICAMENTO DIARIO (BACKUP JSON)

   ========================================== */

   function scaricaBackupJSON() {

    // 1. Preleviamo i dati aggiornati dal server C#

    fetch(`${API_BASE_URL}/giornate`)

    .then(res => {

        if (!res.ok) throw new Error("Impossibile recuperare i dati dal server");

        return res.json();

    })

    .then(giornate => {

        // 2. Convertiamo l'oggetto JavaScript in una stringa JSON formattata e leggibile

        const datiFormattati = JSON.stringify(giornate, null, 4);

       

        // 3. Creiamo un "Blob" (un oggetto simile a un file) di tipo JSON

        const blob = new Blob([datiFormattati], { type: "application/json" });

       

        // 4. Creiamo un link di download temporaneo "invisibile" nel browser

        const urlTemporaneo = URL.createObjectURL(blob);

        const linkScaricamento = document.createElement("a");

       

        linkScaricamento.href = urlTemporaneo;

        linkScaricamento.download = "Frociagine.json"; // Nome del file che verrà salvato

       

        // 5. Simuliamo il clic dell'utente per avviare il download e puliamo la memoria

        document.body.appendChild(linkScaricamento);

        linkScaricamento.click();

        document.body.removeChild(linkScaricamento);

        URL.revokeObjectURL(urlTemporaneo);

    })

    .catch(err => {

        console.error("Errore durante il download del backup:", err);

        alert("🚨 Impossibile scaricare il backup. Controlla che il server API sia acceso.");

    });

}

/* ==========================================

   📤 FUNZIONE CARICAMENTO DIARIO (UPLOAD JSON)

   ========================================== */

   function caricaFileJSON(input) {

    // Controlliamo se l'utente ha effettivamente selezionato un file

    if (!input.files || input.files.length === 0) return;



    const file = input.files[0];

    const reader = new FileReader();



    // 1. Il browser legge il file JSON locale dell'utente

    reader.onload = function(e) {

        try {

            // Verifichiamo che sia un JSON valido per evitare crash

            const datiControllati = JSON.parse(e.target.result);

           

            if (!Array.isArray(datiControllats = datiControllati)) {

                alert("🚨 Errore: Il file caricato non ha la struttura corretta di un diario.");

                return;

            }



            if (!confirm(`Rilevati ${datiControllati.length} report nel file. Vuoi caricarli sul server? ATTENZIONE: Questo sovrascriverà i dati correnti.`)) {

                input.value = ""; // Resetta l'input

                return;

            }



            // 2. Inviamo l'intero array al server C# tramite una chiamata API

            // NOTA: Usiamo l'endpoint di salvataggio massivo se presente, oppure un ciclo.

            // La cosa più pulita è inviarlo a un endpoint dedicato nel tuo controller C#, ad esempio "/giornate/importa"

            fetch(`${API_BASE_URL}/giornate/importa`, {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(datiControllati)

            })

            .then(res => {

                if (!res.ok) throw new Error("Errore del server durante l'importazione");

                return res.json();

            })

            .then(() => {

                alert("🎉 Database sincronizzato con successo! Dati importati.");

                caricaGiornateDalServer(); // Rinfresca tabella e grafico in tempo reale

                input.value = ""; // Svuota il campo file

            })

            .catch(err => {

                console.error(err);

                alert("🚨 Errore durante l'invio al server. Verifica che l'endpoint backend sia configurato.");

                input.value = "";

            });



        } catch (erroreSintassi) {

            alert("🚨 File corrotto o non valido. Assicurati che sia il file .json scaricato in precedenza.");

            input.value = "";

        }

    };



    // Avvia la lettura del file come testo semplice

    reader.readAsText(file);

}



/* ==========================================

   🔍 FUNZIONE DI FILTRO DINAMICO TABELLA & KPI

   ========================================== */

   function filtraTabellaCyber() {

    // 1. Prendiamo il testo digitato (tutto in minuscolo per non fare confusione tra MAIUSCOLE e minuscole)

    const testoCercato = document.getElementById("input-ricerca-cyber").value.toLowerCase();

    const righeTabella = document.querySelectorAll("#tabella-giornate-corpo tr");

   

    // Variabili per ricalcolare i totali filtrati

    let oreFiltrate = 0;

    let bugFiltrati = 0;

    let caffeFiltrati = 0;

    let righeVisibili = 0;



    righeTabella.forEach(riga => {

        // Saltiamo la riga di avviso se la tabella è vuota

        if (riga.cells.length <= 1) return;



        // Estraiamo il testo della Fase (cella 4) e della Descrizione (cella 6)

        const faseProgetto = riga.cells[4].innerText.toLowerCase();

        const descrizione = riga.cells[6].innerText.toLowerCase();

        const dettaglioBug = riga.cells[5].innerText.toLowerCase();



        // 2. Controlliamo se la parola cercata è dentro uno di questi campi

        if (faseProgetto.includes(testoCercato) || descrizione.includes(testoCercato) || dettaglioBug.includes(testoCercato)) {

            riga.style.display = ""; // Mostra la riga

            righeVisibles = righeVisibili++;



            // Recuperiamo i valori numerici direttamente dal testo della riga per fare la nuova somma

            oreFiltrate += parseFloat(riga.cells[1].innerText) || 0;

            // Estraiamo il numero togliendo l'emoticon del caffè ☕

            caffeFiltrati += parseInt(riga.cells[2].innerText.replace('☕', '').trim()) || 0;

            // Estraiamo il numero togliendo l'emoticon del bug 🐛

            bugFiltrati += parseInt(riga.cells[3].innerText.replace('🐛', '').trim()) || 0;

        } else {

            riga.style.display = "none"; // Nascondi la riga se non corrisponde

        }

    });



    // 3. Aggiorniamo i quadratini dei totali con i dati filtrati

    document.getElementById("totale-ore").innerText = oreFiltrate.toFixed(1);

    document.getElementById("totale-bug").innerText = bugFiltrati;

    document.getElementById("totale-caffe").innerText = caffeFiltrati;



    // 4. Ricalcoliamo al volo la barra di avanzamento in base ai dati filtrati

    const ORE_TOTALI_RICHIESTE = 150;

    let percentuale = (oreFiltrate / ORE_TOTALI_RICHIESTE) * 100;

    if (percentuale > 100) percentuale = 100;

    let oreRimanenti = ORE_TOTALI_RICHIESTE - oreFiltrate;

    if (oreRimanenti < 0) oreRimanenti = 0;



    const elementoTesto = document.getElementById("testo-predizione");

    if (testoCercato === "") {

        // Se non sto cercando nulla, mostra il testo normale dello stage

        if (oreFiltrate >= ORE_TOTALI_RICHIESTE) {

            elementoTesto.innerHTML = `🎉 <strong style="color: #00ff87;">STAGE COMPLETATO!</strong> (${oreFiltrate.toFixed(1)} / ${ORE_TOTALI_RICHIESTE} ore)`;

        } else {

            elementoTesto.innerHTML = `Sei al <strong style="color: #00f2fe;">${percentuale.toFixed(0)}%</strong> del tuo percorso. Ore rimanenti: <strong style="color: #ff007f;">${oreRimanenti.toFixed(1)}</strong>`;

        }

    } else {

        // Se sto cercando qualcosa, mostra il riepilogo degli elementi trovati

        elementoTesto.innerHTML = `Filtro attivo: trovati <strong style="color: #00f2fe;">${righeVisibili}</strong> report. Ore parziali: <strong style="color: #00ff87;">${oreFiltrate.toFixed(1)}</strong>`;

    }

    document.getElementById("barra-progresso-interna").style.width = `${percentuale}%`;



    // 5. Aggiorna istantaneamente anche il grafico a colonne!

    aggiornaGrafico(oreFiltrate, bugFiltrati, caffeFiltrati);

}

let sequenzaTasti = "";



document.addEventListener('keydown', function(evento) {

    // Aggiunge l'ultimo tasto premuto alla stringa

    sequenzaTasti += evento.key.toLowerCase();

   

    // Tiene solo gli ultimi 6 caratteri (la lunghezza di "matrix")

    if (sequenzaTasti.length > 6) {

        sequenzaTasti = sequenzaTasti.substring(sequenzaTasti.length - 6);

    }

   

    // Se la parola digitata è "matrix", reindirizza alla pagina segreta

    if (sequenzaTasti === "matrix") {

        window.location.href = "terminal.html";

    }

});