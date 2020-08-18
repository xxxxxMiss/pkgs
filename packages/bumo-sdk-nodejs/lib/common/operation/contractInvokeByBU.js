'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const tou8 = require('buffer-to-uint8array');

/**
 * contractInvokeByBU Operation
 * @param args
 * @return {object}
 */
module.exports = function (args) {
  try {
    const { sourceAddress, contractAddress, buAmount, metadata, input } = args;
    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));
    const payCoin = root.lookupType('protocol.OperationPayCoin');
    let opt = {
      destAddress: contractAddress,
    };

    if (buAmount) {
      opt.amount = long.fromValue(buAmount);
    }

    if (input) {
      opt.input = input;
    }

    const payCoinMsg = payCoin.create(opt);

    const operation = root.lookupType('protocol.Operation');
    const payload = {
      payCoin: payCoinMsg,
      type: operation.Type.PAY_COIN,
      sourceAddress,
    };

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
