const { axiosInstance } = require("./axios");

function sendMessage(messageObj, messageText){
    return axiosInstance.get("sendMessage", {  
        chat_id: messageObj.chat.id,
        text: messageText,
    });
}

function handleMessageBank(messageObj){
    const messageText = messageObj.text || "";

    if(messageText.charAt(0) == "/"){
        const parts = messageText.substr(1).split(" ");
        const command = parts[0];
        const params = parts.slice(1);

        switch (command){
            case "start":
                return sendMessage(messageObj, "Ciao sono il Bot di Dave_Bank! Qui potrai confermare in tutta sicurezza i tuoi bonifici");

            case "accept":
                if (params.length === 0) {
                    return sendMessage(messageObj, "Uso: /accept <id_transazione>");
                }
                transactionId = params[0];
                ConfermaTransazione(transactionId);
                return sendMessage(messageObj, "Confermo la transazione " + transactionId);
            case "deny":
                if (params.length === 0) {
                    return sendMessage(messageObj, "Uso: /deny <id_transazione>");
                }
                transactionId = params[0];
                EliminoTransazione(transactionId);
                return sendMessage(messageObj, "Elimino la transazione " + transactionId);
            default:
                return sendMessage(messageObj, "Purtroppo non posso aiutarti con questa richiesta");
        }
    }
    else{
        const username = messageObj.from?.username || messageObj.from?.first_name || "Utente anonimo";
        return sendMessage(messageObj, "Ciao "+username+" attendi il messaggio di conferma dopodiché scrivi /accept per confermare o /deny per rifiutare");
    }
}

function handleConfermaBonifico({ transazione_id, mittente, destinatario, importo }){
    const chat_id = 912527287;

    const message = `Stai effettuando bonifico ${transazione_id} da ${mittente} a ${destinatario} di ${importo}£. Vuoi confermare la transazione?`

    return axiosInstance.get("sendMessage", {  
        chat_id: chat_id,
        text: message,
    });
}


function ConfermaTransazione(transactionId){

    const targetUrl = `http://localhost:7070/transazione/invia/${transactionId}`;

    fetch(targetUrl, {
        method: 'GET',
    })
    .then(res => res.text())
    .catch(err => console.error("Errore nella fetch:", err));
}

function EliminoTransazione(transactionId){

    const targetUrl = `http://localhost:7070/transazione/elimina/${transactionId}`;

    fetch(targetUrl, {
        method: 'GET',
    })
    .then(res => res.text())
    .catch(err => console.error("Errore nella fetch:", err));
}





module.exports = {handleMessageBank, handleConfermaBonifico };