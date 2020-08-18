'use strict';

const is = require('is-type-of');
const protobuf = require('protobufjs');
const long = require('long');
const ctp = require('../ctp');

/**
 * ctp10TokenIssueOperation
 * @param args
 * @return {payload}
 */
module.exports = function (args) {
  try {
    const { initBalance, name, symbol, decimals, totalSupply, sourceAddress, metadata } = args;
    const root = protobuf.Root.fromJSON(require('../../crypto/protobuf/bundle.json'));

    const contract = root.lookupType('protocol.Contract');
    const contractMsg = contract.create({
      payload: ctp.v10,
    });

    const accountThreshold = root.lookupType('protocol.AccountThreshold');
    const accountThresholdMsg = accountThreshold.create({
      txThreshold: 1,
    });

    const accountPrivilege = root.lookupType('protocol.AccountPrivilege');
    const accountPrivilegeMsg = accountPrivilege.create({
      // masterWeight: 0,
      thresholds: accountThresholdMsg,
    });

    const createAccount = root.lookupType('protocol.OperationCreateAccount');
    const opt = {
      initBalance: long.fromValue(initBalance),
      priv: accountPrivilegeMsg,
      contract: contractMsg,
    };

    let initInputObj = {
      params: {
        name,
        symbol,
        decimals,
        supply: totalSupply,
      },
    };

    opt.initInput = JSON.stringify(initInputObj);

    const createAccountMsg = createAccount.create(opt);

    const operation = root.lookupType('protocol.Operation');
    const operationPayload = {
      type: operation.Type.CREATE_ACCOUNT,
      createAccount: createAccountMsg,
    };

    if (sourceAddress) {
      operationPayload.sourceAddress = sourceAddress;
    }

    if (metadata) {
      operationPayload.metadata = metadata;
    }

    const err = operation.verify(operationPayload);

    if (err) {
      throw Error(err);
    }

    return operation.create(operationPayload);
  } catch (err) {
    throw err;
  }
};
