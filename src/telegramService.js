const request = require('request-promise');
const _ = require('lodash');
const conf = require('../config.json');

const { botId } = conf.telegram;
const callBackUrl = `https://api.telegram.org/bot${botId}`;

exports.sendReply = function sendReply(chatId, messageId, responseMessage) {
  const body = {
    chat_id: chatId,
    text: responseMessage,
    reply_to_message_id: messageId,
  };

  const options = {
    url: `${callBackUrl}/sendMessage`,
    method: 'POST',
    body,
    json: true,
  };

  return request
    .post(options)
    .then(data => data)
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

exports.isCommand = function isCommand(message) {
  return _.some(message.entities, { type: 'bot_command' });
};
