const validUserName = /^[\w@]+$/;
const validWallet = /^0x[0-9a-fA-F]+$/;

exports.isValidSet = function isValidSet(username, ethWallet) {
  if (!username || !ethWallet) {
    return false;
  }

  return validUserName.test(username) && validWallet.test(ethWallet);
};

exports.isValidGet = function isValidGet(username) {
  return !username || validUserName.test(username);
};

exports.isValidDelete = function isValidDelete(username) {
  return !username || validUserName.test(username);
};
