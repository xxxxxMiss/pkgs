'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const tou8 = require('buffer-to-uint8array');

/**
 * Account set metadata
 * @param args
 * @return {payload}
 */
module.exports = function (args) {
  try {

    const { key, value, version, sourceAddress, deleteFlag, metadata } = args;
    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));
    const setMetadata = root.lookupType('protocol.OperationSetMetadata');

    const opt = {
      key,
      value,
    };

    if (version) {
      opt.version = parseInt(version);
    }

    if (deleteFlag) {
      opt.deleteFlag = deleteFlag;
    }

    const setMetadataMsg = setMetadata.create(opt);
    const operation = root.lookupType('protocol.Operation');
    const payload = {
      setMetadata: setMetadataMsg,
      type: operation.Type.SET_METADATA,
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
