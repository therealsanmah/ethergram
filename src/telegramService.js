var request = require('request-promise');
var _ = require('lodash');
var conf = require('../config.json');
var botId = conf.telegram.botId;
var callBackUrl = "https://api.telegram.org/bot" + botId;


exports.sendReply = function sendReply(chatId, messageId, responseMessage) {
    var body = {
        chat_id: chatId,
        text: responseMessage,
        reply_to_message_id: messageId
    };

    var options = {
        url: callBackUrl + '/sendMessage',
        method: 'POST',
        body: body,
        json: true
    };

    return request.post(options)
        .then(function (data) {
            return data;
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
};

exports.isCommand = function isCommand(message) {
    return _.some(message.entities, { type: 'bot_command' });
}
