var admin = require('firebase-admin');
var _ = require('lodash');
var conf = require('../config.json');
var serviceAccount = require(conf.db.serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: conf.db.url
});
var database = admin.database();

exports.setWallet = function setWallet(username, chatId, walletAddress) {
    return database.ref('/directory/' + chatId + '/users/' + username).set({
        username: username,
        address: walletAddress
    });
};

exports.getWallet = function getWallet(username, chatId) {
    return database.ref('/directory/' + chatId + '/users/' + username).once('value').then(function (snapshot) {
        if (snapshot.val()) {
            return snapshot.val().address;
        }
        throw new Error('AliasNotFound');
    });
};

exports.getAllWallets = function getAllWallets(chatId) {
    return database.ref('/directory/' + chatId + '/users').once('value').then(function (snapshot) {
        if (snapshot.val()) {
            return _.values(snapshot.val());
        }
        throw new Error('ChatNotFound');
    });
};

exports.deleteWallet = function deleteWallet(username, chatId) {
    return database.ref('/directory/' + chatId + '/users/' + username).remove();
};