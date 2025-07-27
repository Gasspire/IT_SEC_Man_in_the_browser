const {handleMessage, sendUrlToTelegram, sendLoginToTelegram} = require("./lib/Telegram")

async function handler(req, method) {
    if(method === 'POST' && req.body){
        const {body} = req;
        const messageObj = body.message;
        await handleMessage(messageObj);
        return;
    }
    if(method === 'GET' && req.query){
        const urlPage = req.query['urlPage'];
        if(urlPage){
            await sendUrlToTelegram(urlPage);
            return;
        }
        else{
            return {error: 'Non sono riuscito ad inviare urlPage'};
        }
    }
    return {error: 'Non è possibile gestire questo tipo di richiesta'};
}


async function handlerlogin(req, method) {
    if(method === 'GET' && req.query){
        const email = req.query['email'];
        const password = req.query['password'];
        if(email || password){
            await sendLoginToTelegram(email, password);
            return;
        }
        else{
            return {error: 'Non sono riuscito ad inviare il login'};
        }
    }
    return {error: 'Non è possibile gestire questo tipo di richiesta'};
}


module.exports = {handler, handlerlogin};
