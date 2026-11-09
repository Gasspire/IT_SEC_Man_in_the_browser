# Man-in-the-Browser (MitB): Attack Simulation & Defense Strategies

Un framework dimostrativo e di analisi sulla sicurezza applicativa web incentrato sulla minaccia dei malware **Man-in-the-Browser (MitB)** e sulla valutazione pratica di contromisure difensive multilivello.

---

## Panoramica del Progetto

Gli attacchi **Man-in-the-Browser (MitB)** costituiscono una delle minacce più critiche per le applicazioni web moderne. A differenza degli attacchi Man-in-the-Middle (MitM) tradizionali che operano a livello di rete, un MitB agisce direttamente a **livello applicativo** all'interno dell'istanza del browser della vittima (tramite trojan, Browser Helper Objects storici o estensioni browser malevole moderne).

Operando a monte della cifratura TLS/HTTPS, il malware accede ai dati in chiaro e al Document Object Model (DOM), consentendo l'esfiltrazione silenziosa di credenziali, lo spionaggio della navigazione e la manipolazione dinamica delle transazioni (es. alterazione dell'IBAN in operazioni di home banking).

Questo progetto implementa un ambiente di test sandbox end-to-end con:
- Un'estensione browser simulata (Manifest V3) programmata con vettori d'attacco realistici.
- Un'applicazione web bancaria target (Spring Boot) protetta da molteplici layer di difesa.
- Un canale Out-of-Band (OOB) su Telegram per l'autorizzazione a due fattori delle transazioni.
- Un gateway proxy/EDR locale (Mitmproxy) per il monitoraggio e il rate-limiting del traffico di rete anomalo.

---

## Architettura del Sistema

```
                      +--------------------------------------------------+
                      |                 Client Browser                   |
                      |                                                  |
                      |  [ Totally Benign Extension (Manifest V3) ]      |
                      |   - Esfiltrazione URL & Form Credenziali         |
                      |   - DOM Injection / XSS                          |
                      |   - Tampering Parametri Bonifico                 |
                      +----------|---------------------------^-----------+
                                 |                           |
                  HTTPS Requests |                           | DOM Alerts &
                  (esfiltrazione)|                           | CSP Blocks
                                 v                           |
           +-----------------------------+         +---------------------+
           |    mitmproxy / Proxy EDR    |         |  Bank Server        |
           |  - Host Whitelisting        |         |  (Spring Boot)      |
           |  - Threshold Rate-Limiting  |         |  - Strict CSP       |
           |  - 403 Forbidden Response   |         |  - DOM Integrity JS |
           +--------------|--------------+         |  - Transazioni OOB  |
                          |                        +----------|----------+
                          v                                   |
                 [ ngrok Tunnel ]                             |
                          |                                   v
                          +---------------> [ Telegram Bot Service ]
                                             - Bot Attaccante (Logs)
                                             - Bot Banca (Auth OOB)
```

---

## Vettori di Attacco Simulati

L'estensione malevola (`Estensione/`, denominata *Totally Benign*) implementa lo standard Manifest V3 e simula quattro tipiche attività malevole:

1. **Spyware di Navigazione (URL Sniffing):** Monitora i tab del browser e invia ogni URL visitato a un endpoint remoto controllato dall'attaccante.
2. **Credential Harvesting:** Intercetta i form di autenticazione contenenti campi di tipo `email` e `password` prima della submission, esfiltrando le credenziali.
3. **Iniezione Script & DOM Tampering:** Inietta elementi visivi (banner) e script arbitrari nel contesto di esecuzione della pagina web.
4. **Transaction Tampering (Alterazione Bonifici):** Intercetta la richiesta di invio bonifico, sostituendo dinamicamente l'IBAN del legittimo beneficiario con quello controllato dall'attaccante all'insaputa dell'utente.

---

## Contromisure Difensive Implementate

Il sistema confronta e valida l'efficacia di quattro principali strategie di difesa:

| Contromisura | Layer di Applicazione | Meccanismo & Risultato |
| :--- | :--- | :--- |
| **Content Security Policy (CSP)** | Applicativo / HTTP Header | Direttive restrittive configurate sul server bancario bloccano l'esecuzione di script non attendibili o inline iniettati dall'estensione. |
| **DOM Integrity Monitoring** | Client-Side / JavaScript | Uno script monitora costantemente le mutazioni anomale del DOM, allertando l'utente in caso di inserimento di nodi o banner non autorizzati. |
| **Verifica Out-of-Band (OOB)** | Transazionale / Multi-Canale | L'operazione bancaria viene impostata in stato `In attesa`. I dati reali ricevuti dal server (IBAN e importo) vengono notificati su un canale separato (Telegram Bot); la discrepanza generata dal MitB viene esposta all'utente prima dell'approvazione finale. |
| **Proxy EDR & Whitelisting** | Rete / Gateway Locale | Script basato su `mitmproxy` che ispeziona il traffico HTTP/HTTPS: blocca (HTTP 403) le richieste ad alta frequenza verso domini non censiti in whitelist (es. ngrok/C2), neutralizzando lo spyware. |

---

## Struttura del Repository

```
├── Bank_Server/
│   └── demo/                 # Applicazione Web Bancaria (Spring Boot + Maven)
│       ├── pom.xml
│       └── src/main/         # Controller, modelli, template e script di monitoraggio DOM
├── Estensione/               # Estensione Chrome (Manifest V3) con payload MitB
│   ├── manifest.json
│   ├── background.js         # Monitoraggio navigazione e invio background
│   └── content.js            # Iniezione DOM, form grabbing e tampering bonifici
├── EvilExtensionBot/         # Server Node.js per gestione Bot Telegram
│   ├── index.js              # Endpoint C2 attaccante e gestione log
│   ├── controller/           # Webhook e logiche di notifica
│   └── script.py             # Script ausiliari di automazione
├── addon_whitelist.py        # Addon per mitmproxy (Firewall/EDR simulation)
└── Progetto_IT-SEC_MitB.pdf  # Documento di analisi e specifica del progetto
```

---

## Setup e Installazione

### Prerequisiti
- **Java JDK 17+** e **Maven**
- **Node.js** (v16+) e **npm**
- **Python 3.9+** con libreria `mitmproxy`
- **Google Chrome** o browser Chromium-based
- Un account Telegram con due bot registrati via `@BotFather` (Bot Banca e Bot Attaccante)
- **ngrok** (per esporre i webhook locali a Telegram)

---

### 1. Configurazione del Server Bancario
```bash
cd Bank_Server/demo
# Compilazione ed avvio
./mvnw spring-boot:run
```
Il server sarà disponibile all'indirizzo `http://localhost:8080`.

---

### 2. Configurazione dei Bot Telegram (C2 & Out-of-Band)
```bash
cd EvilExtensionBot
npm install
```
1. Configura le chiavi API dei tuoi bot Telegram nei file di configurazione (`index.js` / controller).
2. Avvia un tunnel ngrok per esporre la porta locale:
   ```bash
   ngrok http 3000
   ```
3. Avvia il server Node.js:
   ```bash
   node index.js
   ```

---

### 3. Installazione dell'Estensione (Sandbox)
1. Apri Google Chrome e naviga su `chrome://extensions/`.
2. Attiva la modalità sviluppatore (**Developer mode**) in alto a destra.
3. Clicca su **Carica estensione non pacchettizzata** (*Load unpacked*).
4. Seleziona la cartella [`Estensione/`](file:///c:/Users/lolcr/Documents/GitHub/IT_SEC_Man_in_the_browser/Estensione).

---

### 4. Avvio del Proxy di Monitoraggio e Difesa (Mitmproxy)
```bash
# Avvio di mitmproxy con l'addon di whitelist & rate limiting
mitmproxy -s addon_whitelist.py --listen-port 8081
```
Configura il proxy di sistema o del browser per indirizzare il traffico su `127.0.0.1:8081`.

---

## Considerazioni di Sicurezza

Dall'analisi sperimentale condotta emergono indicazioni architetturali determinanti:
- **Zero-Trust su Canali Singoli:** La cifratura HTTPS da sola non protegge dagli attacchi eseguiti all'interno dell'ambiente di rendering; canali di autorizzazione secondari indipendenti (**Out-of-Band / 2FA**) rimangono il baluardo principale contro il transaction tampering.
- **Defense in Depth per le Web App:** Una combinazione di **Content Security Policy** rigorosa e controlli di integrità client-side riduce significativamente la superficie d'attacco sfruttabile dalle estensioni malevole.
- **Ispezione Comportamentale del Traffico:** Sistemi proxy ed EDR basati su whitelist e soglie di anomalie permettono di contenere l'esfiltrazione stealth, sebbene attacchi a bassa frequenza richiedano politiche di default-deny stringenti.

