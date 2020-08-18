'use strict';

const is = require('is-type-of');
const co = require('co');
const errors = require('../exception');

const proto = exports;

proto.ctp10TokenIssueOperation = function(args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      initBalance: {
        required: true,
        numeric: true,
      },
      name: {
        required: true,
        string: true,
      },
      symbol: {
        required: true,
        string: true,
      },
      totalSupply: {
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
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    const { decimals } = args;

    if (!decimals || typeof decimals !== 'number' || decimals < 0 || decimals > 8) {
      return this._responseError(errors.INVALID_TOKEN_DECIMALS_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'ctp10TokenIssue',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};


proto.ctp10TokenAssignOperation = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      contractAddress: {
        required: true,
        address: true,
      },
      destAddress: {
        required: true,
        address: true,
      },
      tokenAmount: {
        required: true,
        numeric: true,
      },
      sourceAddress: {
        required: false,
        address: true,
      },
      metadata: {
        required: false,
        string: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    const isContractAddress = yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    if (args.sourceAddress && args.destAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR);
    }

    if (args.sourceAddress && args.contractAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR);
    }

    const tokenInfo = yield this._isAvailableToken(args.contractAddress);

    if (!tokenInfo.result.isValid) {
      return this._responseError(errors.NO_SUCH_TOKEN_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'ctp10TokenAssign',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};


proto.ctp10TokenTransferOperation = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      contractAddress: {
        required: true,
        address: true,
      },
      destAddress: {
        required: true,
        address: true,
      },
      tokenAmount: {
        required: true,
        numeric: true,
      },
      sourceAddress: {
        required: false,
        address: true,
      },
      metadata: {
        required: false,
        string: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    const isContractAddress = yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    if (args.sourceAddress && args.destAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR);
    }

    if (args.sourceAddress && args.contractAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR);
    }

    const tokenInfo = yield this._isAvailableToken(args.contractAddress);

    if (!tokenInfo.result.isValid) {
      return this._responseError(errors.NO_SUCH_TOKEN_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'ctp10TokenTransfer',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};


proto.ctp10TokenTransferFromOperation = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      contractAddress: {
        required: true,
        address: true,
      },
      fromAddress: {
        required: true,
        address: true,
      },
      destAddress: {
        required: true,
        address: true,
      },
      tokenAmount: {
        required: true,
        numeric: true,
      },
      sourceAddress: {
        required: false,
        address: true,
      },
      metadata: {
        required: false,
        string: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    if (args.fromAddress === args.destAddress) {
      return this._responseError(errors.FROMADDRESS_EQUAL_DESTADDRESS_ERROR);
    }

    const isContractAddress =  yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    if (args.sourceAddress && args.destAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR);
    }

    if (args.sourceAddress && args.contractAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR);
    }

    const tokenInfo = yield this._isAvailableToken(args.contractAddress);

    if (!tokenInfo.result.isValid) {
      return this._responseError(errors.NO_SUCH_TOKEN_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'ctp10TokenTransferFrom',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};


proto.ctp10TokenApproveOperation = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      contractAddress: {
        required: true,
        address: true,
      },
      spender: {
        required: true,
        address: true,
      },
      tokenAmount: {
        required: true,
        numeric: true,
      },
      sourceAddress: {
        required: false,
        address: true,
      },
      metadata: {
        required: false,
        string: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    if (args.contractAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress =  yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    const tokenInfo = yield this._isAvailableToken(args.contractAddress);

    if (!tokenInfo.result.isValid) {
      return this._responseError(errors.NO_SUCH_TOKEN_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'ctp10TokenApprove',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};

proto.ctp10TokenChangeOwnerOperation = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      contractAddress: {
        required: true,
        address: true,
      },
      tokenOwner: {
        required: true,
        address: true,
      },
      sourceAddress: {
        required: false,
        address: true,
      },
      metadata: {
        required: false,
        string: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    if (args.contractAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress =  yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    const tokenInfo = yield this._isAvailableToken(args.contractAddress);

    if (!tokenInfo.result.isValid) {
      return this._responseError(errors.NO_SUCH_TOKEN_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'ctp10TokenChangeOwner',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};
