'use strict';

const is = require('is-type-of');
const errors = require('../exception');

const proto = exports;

proto.logCreateOperation = function(args) {
  try {
    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      sourceAddress: {
        required: false,
        address: true,
      },
      topic: {
        required: true,
        topic: true,
      },
      data: {
        required: true,
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

    return this._responseData({
      operation: {
        type: 'createLog',
        data: args,
      },
    });
  } catch (err) {
    throw err;
  }
};