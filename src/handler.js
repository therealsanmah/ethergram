const _ = require('lodash');
const telegramService = require('./telegramService');
const walletService = require('./walletService');
const validationService = require('./validationService');

function processMessage(message, root) {
  const messageElements = message.split(' ');
  const command = messageElements[0];
  const username = messageElements[1];
  const ethWallet = messageElements[2];
  console.log(messageElements);
  switch (command) {
    case '/set':
    case '/set@EthgramBot':
      if (!validationService.isValidSet(username, ethWallet)) {
        return Promise.reject(new Error('SyntaxError'));
      }
      walletService.setWallet(username, root, ethWallet);
      console.log('saveSuccess');
      return Promise.resolve(`Wallet address saved for ${username}`);
    case '/get':
    case '/get@EthgramBot':
      if (!username) {
        return walletService.getAllWallets(root)
          .then((values) => {
            let response = '';
            _.each(values, (value) => {
              response += `${value.username} ${value.address}\n`;
            });
            return response;
          });
      }
      if (!validationService.isValidGet(username)) {
        return Promise.reject(new Error('SyntaxError'));
      }
      return walletService.getWallet(username, root);
    case '/delete':
    case '/delete@EthgramBot':
      if (!validationService.isValidDelete(username)) {
        return Promise.reject(new Error('SyntaxError'));
      }
      walletService.deleteWallet(username, root);
      return Promise.resolve(`Alias ${username} deleted successfully`);
    default:
      console.log('Command not found');
      return Promise.reject(new Error('CommandNotFound'));
  }
}

exports.handleTelegramRequest = function handleTelegramRequest(message) {
  if (telegramService.isCommand(message)) {
    return processMessage(message.text, message.chat.id)
      .then(responseMessage => telegramService.sendReply(message.chat.id, message.message_id, responseMessage)
        .then(() => 'success')).catch((e) => {
        console.error(e);
        if (e.message === 'CommandNotFound') {
          console.log(`Unknown command: ${message.text}`);
        } else if (e.message === 'SyntaxError') {
          const help = 'Incorrect usage. Try: \n/set <alias> <address>\n/get <alias>\n/delete <alias>';
          return telegramService.sendReply(message.chat.id, message.message_id, help)
            .then(() => 'success')
            .catch(() => {
              throw new Error('InternalError');
            });
        } else {
          throw new Error('InternalError');
        }
        return {};
      });
  }
  console.log(`Not a command: ${message.text}`);
  return Promise.resolve('No operation');
};
