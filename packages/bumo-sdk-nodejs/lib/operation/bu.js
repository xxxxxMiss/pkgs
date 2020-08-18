'use strict';

const is = require('is-type-of');
const errors = require('../exception');

const proto = exports;

proto.buSendOperation = function(args) {
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
      buAmount: {
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
        type: 'payCoin',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};
