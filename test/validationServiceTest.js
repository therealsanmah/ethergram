const assert = require('assert');
const validationService = require('../src/validationService');
const { describe, it } = require('mocha');

describe('ValidationService', () => {
  describe('isValidSet', () => {
    it('accepts valid username and address', () => {
      const username = '@goodUser';
      const walletAddress = '0x0123456789ABCDEF';
      const isValid = validationService.isValidSet(username, walletAddress);
      assert.equal(isValid, true);
    });

    it('does not accept invalid address', () => {
      const username = '@goodUser';
      const walletAddress = '0x0123456789ABCDEFpoi';
      const isValid = validationService.isValidSet(username, walletAddress);
      assert.equal(isValid, false);
    });

    it('does not accept invalid name', () => {
      const username = '12;3132';
      const walletAddress = '0x0123456789ABCDEF';
      const isValid = validationService.isValidSet(username, walletAddress);
      assert.equal(isValid, false);
    });
  });

  describe('isValidGet', () => {
    it('accepts valid username', () => {
      const username = '@goodUser';
      const isValid = validationService.isValidGet(username);
      assert.equal(isValid, true);
    });

    it('does not accept invalid name', () => {
      const username = '12;3132';
      const isValid = validationService.isValidGet(username);
      assert.equal(isValid, false);
    });
  });

  describe('isValidDelete', () => {
    it('accepts valid username', () => {
      const username = '@goodUser';
      const isValid = validationService.isValidDelete(username);
      assert.equal(isValid, true);
    });

    it('does not accept invalid name', () => {
      const username = '12;3132';
      const isValid = validationService.isValidDelete(username);
      assert.equal(isValid, false);
    });
  });
});
