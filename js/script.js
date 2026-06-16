/* ==========================================
   🌐 CONFIGURAZIONE BASE API (BACKEND)
   ========================================== */
   const API_BASE_URL = "http://localhost:5000/api";
   let idModificaInCorso = 0; // Serve per capire se stiamo salvando un nuovo report o modificando uno esistente
   
   // Al caricamento della pagina, mostra solo il login e resetta i campi
   window.onload = function() {
       document.getElementById("sezione-login").style.display = "flex";
       document.getElementById("sezione-dashboard").style.display = "none";
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
   
   /* ==========================================
      📊 MOTORE DIARIO: CARICAMENTO E TABELLA
      ========================================== */
      function caricaGiornateDalServer() {
        fetch(`${API_BASE_URL}/giornate`)
        .then(res => res.json())
        .then(giornate => {
            const corpoTabella = document.getElementById("tabella-giornate-corpo");
            corpoTabella.innerHTML = ""; // Svuota la tabella prima di ricaricare
    
            // 🧮 Variabili per i calcoli dei totali
            let sommaOre = 0;
            let sommaBug = 0;
            let sommaCaffe = 0;
    
            if (giornate.length === 0) {
                corpoTabella.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#8fa0dd;">Nessun report presente nel database JSON. Creatne uno!</td></tr>`;
                // Resetta i contatori grafici a 0 se non ci sono dati
                document.getElementById("totale-ore").innerText = "0.0";
                document.getElementById("totale-bug").innerText = "0";
                document.getElementById("totale-caffe").innerText = "0";
                return;
            }
    
            giornate.forEach(g => {
                // Somma matematica riga per riga prendendo i dati dal JSON
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
    
            // 🎯 Inietta i risultati della somma direttamente nei quadratini in cima alla pagina
            document.getElementById("totale-ore").innerText = sommaOre.toFixed(1);
            document.getElementById("totale-bug").innerText = sommaBug;
            document.getElementById("totale-caffe").innerText = sommaCaffe;
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