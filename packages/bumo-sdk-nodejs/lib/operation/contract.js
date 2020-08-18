'use strict';

const is = require('is-type-of');
const errors = require('../exception');

const proto = exports;

proto.contractCreateOperation = function(args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      initBalance: {
        required: true,
        numeric: true,
      },
      sourceAddress: {
        required: false,
        string: true,
        address: true,
      },
      metadata: {
        required: false,
        string: true,
      },
      initInput: {
        required: false,
        string: true,
      }
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    if (!is.string(args.payload) ||
      args.payload.trim().length === 0) {
      return this._responseError(errors.PAYLOAD_EMPTY_ERROR)
    }

    return this._responseData({
      operation: {
        type: 'contractCreate',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};

proto.contractInvokeByAssetOperation = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      contractAddress: {
        required: true,
        address: true,
      },
      sourceAddress: {
        required: false,
        address: true,
      },
      code: {
        required: false,
        string: true,
      },
      issuer: {
        required: false,
        address: true,
      },
      metadata: {
        required: false,
        string: true,
      },
      input: {
        required: false,
        string: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    if (!is.undefined(args.assetAmount)) {
      if (!this._isAvailableValue(args.assetAmount)) {
        return this._responseError(errors.INVALID_CONTRACT_ASSET_AMOUNT_ERROR);
      }
    }

    if (args.sourceAddress && args.contractAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress = yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'contractInvokeByAsset',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};

proto.contractInvokeByBUOperation = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      contractAddress: {
        required: true,
        address: true,
      },
      sourceAddress: {
        required: false,
        address: true,
      },
      input: {
        required: false,
        string: true,
      },
      metadata: {
        required: false,
        string: true,
      }
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    if (!is.undefined(args.buAmount)) {
      if (!this._isAvailableValue(args.buAmount)) {
        return this._responseError(errors.INVALID_CONTRACT_BU_AMOUNT_ERROR);
      }
    }

    if (args.sourceAddress && args.contractAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress = yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'contractInvokeByBU',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};
