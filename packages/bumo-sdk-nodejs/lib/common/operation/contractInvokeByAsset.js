'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const tou8 = require('buffer-to-uint8array');

/**
 * contractInvokeByAsset operation
 * @param args
 * @return {object}
 */
module.exports = function (args) {
  try {
    const { sourceAddress, contractAddress, code, issuer, assetAmount, metadata, input } = args;

    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));

    const assetKey = root.lookupType('protocol.AssetKey');
    const assetKeyMsg = assetKey.create({
      issuer,
      code,
    });

    const asset = root.lookupType('protocol.Asset');

    let arg = {
      key: assetKeyMsg,
    };

    if (assetAmount) {
      arg.amount = long.fromValue(assetAmount);
    }

    const assetMsg = asset.create(arg);

    const operationPayAsset = root.lookupType('protocol.OperationPayAsset');

    const opt = {
      destAddress: contractAddress,
      asset: assetMsg,
    };

    if (input) {
      opt.input = input;
    }

    const operationPayAssetMsg = operationPayAsset.create(opt);

    const operation = root.lookupType('protocol.Operation');

    const payload = {
      payAsset: operationPayAssetMsg,
      type: operation.Type.PAY_ASSET,
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
