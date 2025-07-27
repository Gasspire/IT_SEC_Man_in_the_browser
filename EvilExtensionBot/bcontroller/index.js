const {handleMessageBank, handleConfermaBonifico} = require("./lib/TelegramBank")

async function handlerBank(req, method) {
    if(method === 'POST' && req.body){
        const {body} = req;
        const messageObj = body.message;
        await handleMessageBank(messageObj);
        return;
    }
    else{
        return {error: 'Non è possibile gestire questo tipo di richiesta'};
    }
}

async function handlerBankBonifico(req, method) {
    if (method === 'POST' && req.body) {
        const { transazione_id, mittente, destinatario, importo } = req.body;

        console.log('ID:', transazione_id);
        console.log('Mittente:', mittente);
        console.log('Destinatario:', destinatario);
        console.log('Importo:', importo);

        await handleConfermaBonifico({ transazione_id, mittente, destinatario, importo });
        return { success: true };
    } else {
        return { error: 'Non è possibile gestire questo tipo di richiesta' };
    }
}
module.exports = {handlerBank, handlerBankBonifico};
