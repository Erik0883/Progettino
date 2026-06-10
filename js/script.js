function verificaPassword() {
    const passwordCorretta = "Droga"; 
    const passwordInserita = document.getElementById("password-input").value;
    const loginScreen = document.getElementById("login-screen");
    const diarioContent = document.getElementById("diario-content");
    const errore = document.getElementById("error-msg");

    if (passwordInserita === passwordCorretta) {
        loginScreen.style.opacity = "0";
        loginScreen.style.transform = "scale(0.9) translateY(-30px)";
        setTimeout(() => {
            loginScreen.style.display = "none";
            diarioContent.style.display = "block";
        }, 400);
    } else {
        errore.innerText = "❌ ACCESSO NEGATO: Credenziali errate.";
        loginScreen.classList.add("shake");
        setTimeout(() => { loginScreen.classList.remove("shake"); }, 300);
        document.getElementById("password-input").value = "";
    }
}

function logout() {
    document.getElementById("diario-content").style.display = "none";
    const loginScreen = document.getElementById("login-screen");
    loginScreen.style.display = "block";
    setTimeout(() => { loginScreen.style.opacity = "1"; }, 50);
    document.getElementById("password-input").value = "";
}

function apriDettaglio(giorno) {
    const modal = document.getElementById("popup-dettaglio");
    const container = document.getElementById("modal-body-content");
    
    if (giorno === 'giorno1') {
        container.innerHTML = `
            <span class="exotic-badge">REPORT DI MISSIONE</span>
            <h2 style="font-family: 'Orbitron'; color: #00f2fe; margin-bottom: 15px;">Fase 01: Il Primo Impatto</h2>
            
            <div class="stats-container" style="margin-bottom: 20px;">
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">⏱️</span>
                    <div>
                        <div class="stat-value" style="font-size:14px;">8 Ore</div>
                        <div class="stat-label">Durata</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">🐛</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff4a5a;">Nessuno</div>
                        <div class="stat-label">Bug Risolto</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">☕</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff9f43;">Troppi</div>
                        <div class="stat-label">Caffè Presi</div>
                    </div>
                </div>
            </div>

            <p style="color:#a4b3c6; line-height:1.6;">Nel primo giorno ho affrontato la parte burocratica e organizzativa dello stage. Il tutor mi ha presentato il team di sviluppo e illustrato gli obiettivi delle prossime settimane.</p>
            
            <div class="bug-box">
                <strong style="color: #ff4a5a;">🛠️ Dettaglio del Bug:</strong>
                <p style="font-size: 14px; margin-top: 5px; color: #e0e6ed;">L'installazione dell'ambiente Git dava un errore di permessi sulla cartella locale. Risolto avviando il terminale come amministratore.</p>
            </div>
            
            <div style="margin-top: 20px;">
                <strong style="display:block; margin-bottom: 5px;">Skills Acquisite:</strong>
                <span class="skill-tag">#Git</span> <span class="skill-tag">#VSCode</span>
            </div>
        `;
    } 
    else if (giorno === 'giorno2') {
        container.innerHTML = `
            <span class="exotic-badge">REPORT DI MISSIONE</span>
            <h2 style="font-family: 'Orbitron'; color: #00f2fe; margin-bottom: 15px;">Fase 02: Lettura di codici</h2>
            
            <div class="stats-container" style="margin-bottom: 20px;">
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">⏱️</span>
                    <div>
                        <div class="stat-value" style="font-size:14px;">8 Ore</div>
                        <div class="stat-label">Durata</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">🐛</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#39ff14;">Nessuno</div>
                        <div class="stat-label">Bug Risolti</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">☕</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff9f43;">Troppi</div>
                        <div class="stat-label">Caffè Presi</div>
                    </div>
                </div>
            </div>

            <p style="color:#a4b3c6; line-height:1.6;">Oggi ho analizzato dei codici e chiedendo a gemini a cosa fosserò utili nel progrmma cosi da avere un ricordo di quello che facevo l'anno scorso.</p>
            
            <div style="margin-top: 20px;">
                <strong style="display:block; margin-bottom: 5px;">Skills Acquisite:</strong>
                <span class="skill-tag">#ArchitetturaSoftware</span> <span class="skill-tag">#Documentazione</span>
            </div>
        `;
    }

    else if (giorno === 'giorno3') {
        container.innerHTML = `
            <span class="exotic-badge">REPORT DI MISSIONE</span>
            <h2 style="font-family: 'Orbitron'; color: #00f2fe; margin-bottom: 15px;">Fase 02: Riscoperta del mio vecchio programma</h2>
            
            <div class="stats-container" style="margin-bottom: 20px;">
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">⏱️</span>
                    <div>
                        <div class="stat-value" style="font-size:14px;">8 Ore</div>
                        <div class="stat-label">Durata</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">🐛</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#39ff14;">0</div>
                        <div class="stat-label">Bug Risolti</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">☕</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff9f43;">troppi</div>
                        <div class="stat-label">Caffè Presi</div>
                    </div>
                </div>
            </div>

            <p style="color:#a4b3c6; line-height:1.6;">Oggi mi hanno dato da continuare il mio programma dell'anno scorso, e piano piano ho riniziato a riguardare cosa avevo fatto l0anno scorso.</p>
            
            <div style="margin-top: 20px;">
                <strong style="display:block; margin-bottom: 5px;">Skills Acquisite:</strong>
                <span class="skill-tag">#ArchitetturaSoftware</span> <span class="skill-tag">#PranzoConIBro</span>
            </div>
        `;
    }

    else if (giorno === 'giorno4') {
        container.innerHTML = `
            <span class="exotic-badge">REPORT DI MISSIONE</span>
            <h2 style="font-family: 'Orbitron'; color: #00f2fe; margin-bottom: 15px;">Fase 04: La continuazione</h2>
            
            <div class="stats-container" style="margin-bottom: 20px;">
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">⏱️</span>
                    <div>
                        <div class="stat-value" style="font-size:14px;">8 Ore</div>
                        <div class="stat-label">Durata</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">🐛</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#39ff14;">Nessuno</div>
                        <div class="stat-label">Bug Risolti</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">☕</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff9f43;">troppi</div>
                        <div class="stat-label">Caffè Presi</div>
                    </div>
                </div>
            </div>

            <p style="color:#a4b3c6; line-height:1.6;">Oggi ho continuato il programma insieme a gianni il quale mi da una mano a trovare i file.</p>
            
            <div style="margin-top: 20px;">
                <strong style="display:block; margin-bottom: 5px;">Skills Acquisite:</strong>
                <span class="skill-tag">#Aiuto</span> <span class="skill-tag">#OdioIlLunedì</span>
            </div>
        `;
    }

    else if (giorno === 'giorno5') {
        container.innerHTML = `
            <span class="exotic-badge">REPORT DI MISSIONE</span>
            <h2 style="font-family: 'Orbitron'; color: #00f2fe; margin-bottom: 15px;">Fase 05: Lettura di altri codici</h2>
            
            <div class="stats-container" style="margin-bottom: 20px;">
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">⏱️</span>
                    <div>
                        <div class="stat-value" style="font-size:14px;">8 Ore</div>
                        <div class="stat-label">Durata</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">🐛</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#39ff14;">Nessuno</div>
                        <div class="stat-label">Bug Risolti</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">☕</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff9f43;">Troppi</div>
                        <div class="stat-label">Caffè Presi</div>
                    </div>
                </div>
            </div>

            <p style="color:#a4b3c6; line-height:1.6;">Oggi ho letto altri codice e ho sempre chiesto a gemini il motivo di utilizzo dei codici trovati.</p>
            
            <div style="margin-top: 20px;">
                <strong style="display:block; margin-bottom: 5px;">Skills Acquisite:</strong>
                <span class="skill-tag">#AmoLeggere</span> <span class="skill-tag">#UnaBomba</span>
            </div>
        `;
    }

    else if (giorno === 'giorno6') {
        container.innerHTML = `
            <span class="exotic-badge">REPORT DI MISSIONE</span>
            <h2 style="font-family: 'Orbitron'; color: #00f2fe; margin-bottom: 15px;">Fase 06: La creazione</h2>
            
            <div class="stats-container" style="margin-bottom: 20px;">
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">⏱️</span>
                    <div>
                        <div class="stat-value" style="font-size:14px;">8 Ore</div>
                        <div class="stat-label">Durata</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">🐛</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#39ff14;">Nessuno</div>
                        <div class="stat-label">Bug Risolti</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">☕</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff9f43;">Troppi</div>
                        <div class="stat-label">Caffè Presi</div>
                    </div>
                </div>
            </div>

            <p style="color:#a4b3c6; line-height:1.6;">Oggi siccome erano impegnati ho creato questo progetto, con l'aiuto di gemini mi sono fatto fare la grafica del sito. Perché con la mia conoscenza del settore non andavo avanti.</p>
            
            <div style="margin-top: 20px;">
                <strong style="display:block; margin-bottom: 5px;">Skills Acquisite:</strong>
                <span class="skill-tag">#Divertimento</span> <span class="skill-tag">#Smanettone</span>
            </div>
        `;
    }

    else if (giorno === 'giorno7') {
        container.innerHTML = `
            <span class="exotic-badge">REPORT DI MISSIONE</span>
            <h2 style="font-family: 'Orbitron'; color: #00f2fe; margin-bottom: 15px;">Fase 07: Assente</h2>
            
            <div class="stats-container" style="margin-bottom: 20px;">
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">⏱️</span>
                    <div>
                        <div class="stat-value" style="font-size:14px;">0</div>
                        <div class="stat-label">Durata</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">🐛</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#39ff14;">Nessuno</div>
                        <div class="stat-label">Bug Risolti</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">☕</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff9f43;">Pochi</div>
                        <div class="stat-label">Caffè Presi</div>
                    </div>
                </div>
            </div>

            <p style="color:#a4b3c6; line-height:1.6;">Oggi per via di un'imprevisto non sono potuto andare a fare stage.</p>
            
            <div style="margin-top: 20px;">
                <strong style="display:block; margin-bottom: 5px;">Skills Acquisite:</strong>
                <span class="skill-tag">#SiStaBeneACasa</span> <span class="skill-tag">#Stupendo</span>
            </div>
        `;
    }

    else if (giorno === 'giorno8') {
        container.innerHTML = `
            <span class="exotic-badge">REPORT DI MISSIONE</span>
            <h2 style="font-family: 'Orbitron'; color: #00f2fe; margin-bottom: 15px;">Fase 0: Da segnare</h2>
            
            <div class="stats-container" style="margin-bottom: 20px;">
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">⏱️</span>
                    <div>
                        <div class="stat-value" style="font-size:14px;">0</div>
                        <div class="stat-label">Durata</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">🐛</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#39ff14;">Nessuno</div>
                        <div class="stat-label">Bug Risolti</div>
                    </div>
                </div>
                <div class="stat-box" style="padding: 8px 12px;">
                    <span class="stat-emoji">☕</span>
                    <div>
                        <div class="stat-value" style="font-size:14px; color:#ff9f43;">Pochi</div>
                        <div class="stat-label">Caffè Presi</div>
                    </div>
                </div>
            </div>

            <p style="color:#a4b3c6; line-height:1.6;">Devo segnare quello che farò.</p>
            
            <div style="margin-top: 20px;">
                <strong style="display:block; margin-bottom: 5px;">Skills Acquisite:</strong>
                <span class="skill-tag">#SiStaBeneACasa</span> <span class="skill-tag">#Stupendo</span>
            </div>
        `;
    }

    modal.style.display = "flex";
}

function chiudiDettaglio() {
    document.getElementById("popup-dettaglio").style.display = "none";
}

// Tasto Invio per la password
document.getElementById("password-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") { verificaPassword(); }
});

// FUNZIONE PER IL CAMBIO TEMA (LIGHT/DARK)
function cambiaTema() {
    // Dice al body di attivare/disattivare la modalità chiara
    document.body.classList.toggle("light-mode");
}

// Funzione per intercettare il tasto Invio direttamente dall'HTML
function inviaConInvio(event) {
    if (event.key === "Enter") {
        verificaPassword();
    }
}