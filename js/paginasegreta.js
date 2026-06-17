let datiPaesi = [];
let mappa;
let canvas, ctx;
let particles = [];
let coloreNodi = 'rgba(0, 242, 255, '; 
let moltiplicatoreVelocita = 0.5;

const datiEmergenza = [
    { "nazione": "Italia", "rischio": 1, "stato": "Sicuro", "lat": 41.8719, "lng": 12.5674, "pop": "59 Mln", "pil": "2.1 Tril$", "dis": 6.2, "nota": "Nessuna allerta. Ottima situazione per viaggiare ed esplorare." },
    { "nazione": "Giappone", "rischio": 1, "stato": "Sicuro", "lat": 36.2048, "lng": 138.2529, "pop": "125 Mln", "pil": "4.2 Tril$", "dis": 2.5, "nota": "Nessuna restrizione geopolitica rilevata. Ottimo momento per viaggiare." },
    { "nazione": "Australia", "rischio": 1, "stato": "Sicuro", "lat": -25.2744, "lng": 133.7751, "pop": "26 Mln", "pil": "1.7 Tril$", "dis": 4.1, "nota": "Stato stabile. Regolari controlli di biosicurezza standard agli ingressi." },
    { "nazione": "Kazakistan", "rischio": 1, "stato": "Sicuro", "lat": 48.0196, "lng": 66.9237, "pop": "20 Mln", "pil": "260 Mld$", "dis": 4.7, "nota": "Situazione interna calma nelle principali rotte commerciali e urbane." },
    { "nazione": "Argentina", "rischio": 2, "stato": "Attenzione", "lat": -38.4161, "lng": -63.6167, "pop": "46 Mln", "pil": "630 Mld$", "dis": 7.4, "nota": "Attenzione a possibili scioperi o manifestazioni sindacali a Buenos Aires." },
    { "nazione": "Stati Uniti", "rischio": 2, "stato": "Attenzione", "lat": 37.0902, "lng": -95.7129, "pop": "335 Mln", "pil": "27.3 Tril$", "dis": 3.9, "nota": "Allerta meteo e possibili scioperi dei trasporti nelle città principali." },
    { "nazione": "Francia", "rischio": 2, "stato": "Attenzione", "lat": 46.2276, "lng": 2.2137, "pop": "68 Mln", "pil": "3.0 Tril$", "dis": 7.3, "nota": "Elevato rischio di manifestazioni nelle piazze del centro a Parigi." },
    { "nazione": "Messico", "rischio": 2, "stato": "Attenzione", "lat": 23.6345, "lng": -102.5528, "pop": "128 Mln", "pil": "1.8 Tril$", "dis": 2.7, "nota": "Zone turistiche sicure. Si raccomanda prudenza negli spostamenti notturni." },
    { "nazione": "Colombia", "rischio": 2, "stato": "Attenzione", "lat": 4.5709, "lng": -74.2973, "pop": "52 Mln", "pil": "360 Mld$", "dis": 10.2, "nota": "Monitorare la situazione locale. Evitare le aree rurali non tracciate." },
    { "nazione": "Cina", "rischio": 2, "stato": "Attenzione", "lat": 35.8617, "lng": 104.1954, "pop": "1.4 Mld", "pil": "17.7 Tril$", "dis": 5.1, "nota": "Controlli amministrativi standard intensificati per i visti d'ingresso." },
    { "nazione": "Sudafrica", "rischio": 2, "stato": "Attenzione", "lat": -30.5595, "lng": 22.9375, "pop": "60 Mln", "pil": "380 Mld$", "dis": 32.1, "nota": "Consigliata cautela nelle ore notturne nei grandi centri urbani." },
    { "nazione": "Nigeria", "rischio": 3, "stato": "Critico", "lat": 9.0820, "lng": 8.6753, "pop": "224 Mln", "pil": "390 Mld$", "dis": 5.3, "nota": "Forte instabilità in alcune regioni del nord. Viaggiare solo se necessario." },
    { "nazione": "Egitto", "rischio": 3, "stato": "Critico", "lat": 26.8206, "lng": 30.8025, "pop": "112 Mln", "pil": "395 Mld$", "dis": 6.9, "nota": "Sconsigliate alcune zone di confine. Richiesta massima prudenza." },
    { "nazione": "Russia", "rischio": 3, "stato": "Critico", "lat": 61.5240, "lng": 105.3188, "pop": "144 Mln", "pil": "2.0 Tril$", "dis": 2.6, "nota": "Restrizioni sui voli diretti e sanzioni bancarie attive sui circuiti esteri." },
    { "nazione": "Iran", "rischio": 3, "stato": "Critico", "lat": 32.4279, "lng": 53.6880, "pop": "89 Mln", "pil": "400 Mld$", "dis": 8.1, "nota": "Sconsigliati viaggi a qualsiasi titolo. Elevata tensione geopolitica nell'area." },
    { "nazione": "Iraq", "rischio": 3, "stato": "Critico", "lat": 33.2232, "lng": 43.6793, "pop": "45 Mln", "pil": "250 Mld$", "dis": 15.5, "nota": "Quadro di sicurezza instabile. Monitoraggio radar militare costante." }
];

window.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    mappa = L.map('map', { zoomControl: false }).setView([25, 20], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mappa);

    fetch('api/secret/radar')
        .then(res => res.json())
        .then(data => { datiPaesi = data; costruisciRadar(); })
        .catch(() => {
            datiPaesi = datiEmergenza;
            costruisciRadar();
        });
});

function costruisciRadar() {
    const container = document.getElementById('country-selector');
    container.innerHTML = "";
    datiPaesi.forEach((paese, index) => {
        const btn = document.createElement('button');
        btn.className = "country-btn";
        btn.innerText = `> ${paese.nazione.toUpperCase()}`;
        btn.onclick = () => focusRegione(index);
        container.appendChild(btn);

        let colore = "#10b981";
        if (paese.rischio === 2) colore = "#f59e0b";
        if (paese.rischio === 3) colore = "#ef4444";

        let cerchio = L.circle([paese.lat, paese.lng], {
            color: colore, fillColor: colore, fillOpacity: 0.3, radius: 450000
        }).addTo(mappa);
        cerchio.on('click', () => focusRegione(index));
    });
}

function focusRegione(index) {
    const paese = datiPaesi[index];
    
    document.getElementById('txt-stato').innerText = paese.stato.toUpperCase();
    document.getElementById('txt-nota').innerText = paese.nota;

    document.getElementById('val-pop').innerText = paese.pop;
    document.getElementById('val-pil').innerText = paese.pil;
    document.getElementById('val-dis').innerText = paese.dis + "%";

    let larghezzaPop = paese.nazione === "Cina" ? 100 : Math.min((parseFloat(paese.pop) / 3.5), 85) + 15;
    let larghezzaPil = paese.nazione === "Stati Uniti" ? 100 : paese.nazione === "Cina" ? 75 : Math.min((parseFloat(paese.pil) * 16), 60) + 8;
    let larghezzaDis = Math.min((paese.dis * 3), 100);

    document.getElementById('bar-pop').style.width = larghezzaPop + "%";
    document.getElementById('bar-pil').style.width = larghezzaPil + "%";
    document.getElementById('bar-dis').style.width = larghezzaDis + "%";

    if (paese.rischio === 1) {
        coloreNodi = 'rgba(16, 185, 129, '; moltiplicatoreVelocita = 0.3;
        document.getElementById('txt-stato').style.color = "#10b981";
    } else if (paese.rischio === 2) {
        coloreNodi = 'rgba(245, 158, 11, '; moltiplicatoreVelocita = 1.3;
        document.getElementById('txt-stato').style.color = "#f59e0b";
    } else {
        coloreNodi = 'rgba(239, 68, 68, '; moltiplicatoreVelocita = 3.5;
        document.getElementById('txt-stato').style.color = "#ef4444";
    }

    particles.forEach(p => {
        p.vx = (Math.random() - 0.5) * moltiplicatoreVelocita;
        p.vy = (Math.random() - 0.5) * moltiplicatoreVelocita;
    });

    let livelloZoom = 4;
    if (["Russia", "Australia", "Cina", "Stati Uniti"].includes(paese.nazione)) livelloZoom = 3;
    mappa.flyTo([paese.lat, paese.lng], livelloZoom, { animate: true, duration: 1.2 });
}

function initCanvas() {
    canvas = document.getElementById('canvas-radar'); ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * moltiplicatoreVelocita; this.vy = (Math.random() - 0.5) * moltiplicatoreVelocita;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
    }
    for(let i = 0; i < 60; i++) particles.push(new Particle());
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); ctx.fillStyle = coloreNodi + '0.7)'; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill(); });
        for(let i = 0; i < particles.length; i++) {
            for(let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x; let dy = particles[i].y - particles[j].y; let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 130) { ctx.strokeStyle = coloreNodi + (1 - dist/130) * 0.2 + ')'; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}
// 1. Torna semplicemente alla schermata iniziale
function tornaHome() {
    window.location.href = "index.html"; 
}

// 2. Svuota i dati memorizzati (Sessione/Token) e disconnette l'utente