'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const tou8 = require('buffer-to-uint8array');

/**
 * log operation: Create Log
 * @param {string} args
 * @returns {string}
 */
module.exports = function (args) {
  try {
    const { sourceAddress, topic, data, metadata } = args;
    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));
    const log = root.lookupType('protocol.OperationLog');
    const logMsg = log.create({
      topic,
      datas: [data],
    });

    const operation = root.lookupType('protocol.Operation');
    const payload = {
      log: logMsg,
      type: operation.Type.LOG,
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
