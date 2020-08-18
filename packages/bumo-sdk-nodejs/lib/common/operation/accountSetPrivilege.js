'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const errors = require('../../exception/errors');

/**
 * Account set priviliege
 * @param args
 * @return {payload}
 */
module.exports = function (args) {
  try {

    const { sourceAddress, masterWeight, txThreshold, metadata, signers, typeThresholds } = args;

    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));

    let signersList = [];
    let typeThresholdsList = [];

    const signer = root.lookupType('protocol.Signer');

    if (is.array(signers)) {
      signers.forEach(item => {
        let signerMsg = signer.create({
          address: item.address,
          weight: long.fromValue(item.weight),
        });
        signersList.push(signerMsg);
      });
    }


    const typeThreshold = root.lookupType('protocol.OperationTypeThreshold');

    if (is.array(typeThresholds)) {
      typeThresholds.forEach(item => {
        let typeThresholdMsg = typeThreshold.create({
          type: parseInt(item.type),
          threshold: long.fromValue(item.threshold),
        });
        typeThresholdsList.push(typeThresholdMsg);
      });
    }

    const setPrivilege = root.lookupType('protocol.OperationSetPrivilege');

    const opt = {};

    if (masterWeight) {
      opt.masterWeight = masterWeight;
    }

    if (txThreshold) {
      opt.txThreshold = txThreshold;
    }

    if (signersList.length > 0) {
      opt.signers = signersList;
    }

    if (typeThresholdsList.length > 0) {
      opt.typeThresholds = typeThresholdsList;
    }

    const setPrivilegeMsg = setPrivilege.create(opt);
    const operation = root.lookupType('protocol.Operation');

    const payload = {
      sourceAddress,
      type: operation.Type.SET_PRIVILEGE,
      setPrivilege: setPrivilegeMsg,
    };

    if (metadata) {
      payload.metadata = metadata;
    }
      // const err = operation.verify(payload);
      //
      // if (err) {
      //   throw Error(err);
      // }

    return operation.create(payload);
  } catch (err) {
    throw err;
  }
};
