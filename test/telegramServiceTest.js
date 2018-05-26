const assert = require('assert');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { describe, it, before } = require('mocha');

let requestMock;
let telegramService;

describe('telegramService', () => {
  before(() => {
    const conf = {
      telegram: {
        botId: '123',
      },
    };
    requestMock = {};
    telegramService = proxyquire('../src/telegramService', {
      '../config': conf,
      'request-promise': requestMock,
    });
  });
  describe('isCommand', () => {
    it('accepts valid command', () => {
      const message = { entities: [{ type: 'bot_command' }] };
      const isCommand = telegramService.isCommand(message);
      assert.equal(isCommand, true);
    });
    it('rejects invalid command', () => {
      const message = { entities: [{ type: 'not a bot_command' }] };
      const isCommand = telegramService.isCommand(message);
      assert.equal(isCommand, false);
    });
  });

  describe('sendReply', () => {
    before(() => {
      const postMock = sinon.stub().returns(Promise.resolve({}));
      requestMock.post = sinon.spy(postMock);
    });

    it('Makes call to telegram api successfully', () => {
      const chatId = 123;
      const messageId = 1234;
      const message = 'Address saved successfully';
      telegramService.sendReply(chatId, messageId, message).then(() => {
        const postArgs = requestMock.post.getCall(0).args[0];
        assert.equal(postArgs.body.chat_id, chatId);
        assert.equal(postArgs.body.text, message);
        assert.equal(postArgs.body.reply_to_message_id, messageId);
      });
    });

    it('Throws if telegram api call fails', () => {
      const chatId = 123;
      const messageId = 1234;
      const message = 'Address saved successfully';
      const postMock = sinon.stub().returns(Promise.reject(new Error('Throw')));
      requestMock.post = sinon.spy(postMock);
      return telegramService.sendReply(chatId, messageId, message).catch((err) => {
        assert.equal(err.message, 'Throw');
        const postArgs = requestMock.post.getCall(0).args[0];
        assert.equal(postArgs.body.chat_id, chatId);
        assert.equal(postArgs.body.text, message);
        assert.equal(postArgs.body.reply_to_message_id, messageId);
      });
    });
  });
});
