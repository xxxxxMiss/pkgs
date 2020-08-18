'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const ctp = require('../ctp');

/**
 * Ctp10TokenChangeOwnerOperation
 * @param args
 * @return {payload}
 */
module.exports = function (args) {
  try {
    const { contractAddress, tokenOwner, sourceAddress, metadata } = args;
    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));
    const payCoin = root.lookupType('protocol.OperationPayCoin');
    const opt = {
      destAddress: contractAddress,
      // amount: 0,
    };

    let inputObj = {
      method: 'changeOwner',
      params: {
        address: tokenOwner,
      },
    };

    opt.input = JSON.stringify(inputObj);

    const payCoinMsg = payCoin.create(opt);

    const operation = root.lookupType('protocol.Operation');
    const payload = {
      payCoin: payCoinMsg,
      type: operation.Type.PAY_COIN,
    };

    if (sourceAddress) {
      payload.sourceAddress = sourceAddress;
    }

    if (metadata) {
      payload.metadata = metadata;
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
