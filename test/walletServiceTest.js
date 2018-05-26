const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { describe, it, beforeEach, afterEach } = require('mocha');

const mockAddress = '0x12345';
const mockUsername = '@testUser';
let walletService;
let firebaseMock;
let conf;
const database = {
  ref: sinon.spy(() => database),
  set: sinon.spy(() => Promise.resolve({})),
  remove: sinon.spy(() => Promise.resolve({})),
  once: sinon.spy(() => Promise.resolve({ val: sinon.stub().returns({ address: mockAddress }) })),
};

describe('walletService', () => {
  beforeEach(() => {
    conf = {
      db: {
        url: 'http://testurl',
        serviceAccount: '../dummyServiceAccount',
      },
    };
    firebaseMock = {
      initializeApp: sinon.stub(),
      database: () => database,
      credential: {
        cert: sinon.stub(),
      },
    };
    walletService = proxyquire('../src/walletService', {
      '../config': conf,
      'firebase-admin': firebaseMock,
    });
  });
  afterEach(() => {
    database.ref.resetHistory();
  });
  describe('setWallet', () => {
    it('sets username and wallet address in db for the right chatId', () => {
      const username = '@testUser';
      const chatId = '12345';
      const walletAddress = '0x12345';
      return walletService.setWallet(username, chatId, walletAddress)
        .then(() => {
          const refArgs = database.ref.getCall(0).args[0];
          const setArgs = database.set.getCall(0).args[0];
          assert.equal(refArgs, `/directory/${chatId}/users/${username}`);
          assert.equal(setArgs.username, username);
          assert.equal(setArgs.address, walletAddress);
        });
    });
  });
  describe('deleteWallet', () => {
    it('removes entry for username in the right chatId', () => {
      const username = '@testUser';
      const chatId = '12345';
      return walletService.deleteWallet(username, chatId)
        .then(() => {
          const refArgs = database.ref.getCall(0).args[0];
          assert.equal(refArgs, `/directory/${chatId}/users/${username}`);
          assert.equal(database.remove.called, true);
        });
    });
  });
  describe('getWallet', () => {
    it('returns wallet address for given username from the right chatId', () => {
      const username = '@testUser';
      const chatId = '12345';
      return walletService.getWallet(username, chatId)
        .then((address) => {
          const refArgs = database.ref.getCall(0).args[0];
          assert.equal(refArgs, `/directory/${chatId}/users/${username}`);
          assert.equal(database.once.called, true);
          assert.equal(address, mockAddress);
        });
    });
  });

  describe('getAllWallets', () => {
    beforeEach(() => {
      database.once = sinon.spy(() => Promise.resolve({
        val: sinon.stub().returns([{ username: mockUsername, address: mockAddress }]),
      }));
      walletService = proxyquire('../src/walletService', {
        '../config': conf,
        'firebase-admin': firebaseMock,
      });
    });
    it('returns all wallet addresses in chat', () => {
      const chatId = '12345';
      return walletService.getAllWallets(chatId)
        .then(() => {
          const refArgs = database.ref.getCall(0).args[0];
          assert.equal(refArgs, `/directory/${chatId}/users`);
        });
    });
  });
});
