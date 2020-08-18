'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const tou8 = require('buffer-to-uint8array');

/**
 * createAccount operation: Activate Account
 * @param {string} args
 * @returns {string}
 */
module.exports = function (args) {
  try {
    const { sourceAddress, destAddress, initBalance, metadata } = args;
    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));

    const accountThreshold = root.lookupType('protocol.AccountThreshold');
    const accountThresholdMsg = accountThreshold.create({
      txThreshold: 1,
    });

    const accountPrivilege = root.lookupType('protocol.AccountPrivilege');

    const accountPrivilegeMsg = accountPrivilege.create({
      masterWeight: 1,
      thresholds: accountThresholdMsg,
    });

    const createAccount = root.lookupType('protocol.OperationCreateAccount');
    const createAccountMsg = createAccount.create({
      destAddress,
      initBalance: long.fromValue(initBalance),
      priv: accountPrivilegeMsg,
    });

    const operation = root.lookupType('protocol.Operation');
    const payload = {
      createAccount: createAccountMsg,
      type: operation.Type.CREATE_ACCOUNT,
      sourceAddress,
    };

    if (metadata) {
      payload.metadata = tou8(Buffer.from(metadata, 'utf8'));
    }

    const err = operation.verify(payload);

    if (err) {
      throw Error(err);
    }

    return operation.create(payload);
  } catch (err) {
    throw err;
  }
};
