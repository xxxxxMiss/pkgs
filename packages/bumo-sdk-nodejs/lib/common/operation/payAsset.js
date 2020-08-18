'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const tou8 = require('buffer-to-uint8array');

/**
 * payAsset operation
 * @param {object} args
 * @returns {string}
 */
module.exports = function (args) {
  try {
    const { sourceAddress, destAddress, code, issuer, assetAmount, metadata } = args;

    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));

    const assetKey = root.lookupType('protocol.AssetKey');
    const assetKeyMsg = assetKey.create({
      issuer,
      code,
    });

    const asset = root.lookupType('protocol.Asset');
    const assetMsg = asset.create({
      key: assetKeyMsg,
      amount: long.fromValue(assetAmount),
    });

    const operationPayAsset = root.lookupType('protocol.OperationPayAsset');
    const operationPayAssetMsg = operationPayAsset.create({
      destAddress,
      asset: assetMsg,
    });

    const operation = root.lookupType('protocol.Operation');

    const payload = {
      payAsset: operationPayAssetMsg,
      type: operation.Type.PAY_ASSET,
    };

    if (sourceAddress) {
      payload.sourceAddress = sourceAddress;
    }

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
