var _ = require('lodash');
var telegramService = require('./telegramService');
var walletService = require('./walletService');
var validationService = require('./validationService');

function processMessage(message, root) {
    var messageElements = message.split(' ');
    var command = messageElements[0];
    var username = messageElements[1];
    var ethWallet = messageElements[2];
    console.log(messageElements);
    switch (command) {
        case '/set':
        case '/set@EthgramBot':
            if (!validationService.isValidSet(username, ethWallet)) {
                return Promise.reject(new Error('SyntaxError'));
            }
            walletService.setWallet(username, root, ethWallet);
            console.log("saveSuccess");
            return Promise.resolve("Wallet address saved for " + username);
        case '/get':
        case '/get@EthgramBot':
            if (!username) {
                return walletService.getAllWallets(root)
                    .then(function (values) {
                        var response = '';
                        _.each(values, function (value) {
                            response += value.username + ' ' + value.address + '\n';
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
            return Promise.resolve('Alias ' + username + ' deleted successfully');
        default:
            console.log("Command not found");
            return Promise.reject(new Error('CommandNotFound'));
    }
}

exports.handleTelegramRequest = function handleTelegramRequest(message) {
    if (telegramService.isCommand(message)) {
        return processMessage(message.text, message.chat.id)
            .then(function (responseMessage) {
                return telegramService.sendReply(message.chat.id, message.message_id, responseMessage)
                    .then(function (data) {
                        return 'success';
                    });

            }).catch(function (e) {
                console.error(e);
                if (e.message === 'CommandNotFound') {
                    console.log("Unknown command: " + message.text);
                } else if (e.message === 'SyntaxError') {
                    var help = 'Incorrect usage. Try: \n/set <alias> <address>\n/get <alias>\n/delete <alias>';
                    return telegramService.sendReply(message.chat.id, message.message_id, help)
                        .then(function (data) {
                            return 'success'
                        })
                        .catch(function (err) {
                            throw new Error('InternalError');
                        });
                } else {
                    throw new Error('InternalError');
                }
            });
    } else {
        console.log('Not a command: ' + message.text);
        return Promise.resolve('No operation');
    }
}