'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');

/**
 * issueAsset operation
 * @param {string} args
 * @returns {string}
 */
module.exports = function (args) {
  try {
    const { sourceAddress, code, assetAmount, metadata } = args;
    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));

    const issueAsset = root.lookupType('protocol.OperationIssueAsset');
    const issueAssetMsg = issueAsset.create({
      sourceAddress,
      code: code,
      amount: long.fromValue(assetAmount),
    });

    const operation = root.lookupType('protocol.Operation');
    return operation.create({
      issueAsset: issueAssetMsg,
      type: operation.Type.ISSUE_ASSET,
    });

    // const buffer = operation.encode(operationMsg).finish();
    // return buffer.toString('hex');
  } catch (err) {
    throw err;
  }
};
