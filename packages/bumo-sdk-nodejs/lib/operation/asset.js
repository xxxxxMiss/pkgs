'use strict';

const is = require('is-type-of');
const errors = require('../exception');

const proto = exports;

proto.assetIssueOperation = function(args) {
  try {
    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      sourceAddress: {
        required: false,
        address: true,
      },
      code: {
        required: true,
        string: true,
      },
      assetAmount: {
        required: true,
        numeric: true,
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

    if (args.sourceAddress && args.destAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'issueAsset',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};


proto.assetSendOperation = function(args) {
  try {
    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      sourceAddress: {
        required: false,
        address: true,
      },
      destAddress: {
        required: true,
        address: true,
      },
      code: {
        required: true,
        string: true,
      },
      issuer: {
        required: true,
        string: true,
        address: true,
      },
      assetAmount: {
        required: true,
        numeric: true,
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

    if (args.sourceAddress && args.destAddress === args.sourceAddress) {
      return this._responseError(errors.SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR);
    }

    return this._responseData({
      operation: {
        type: 'payAsset',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};
