'use strict';

const wrap = require('co-wrap-all');
const is = require('is-type-of');
const merge = require('merge-descriptors');
const long = require('long');
const humps = require('humps');
const JSONbig = require('json-bigint');
const errors = require('../exception');


module.exports = Transaction;

function Transaction(options) {
  if (!(this instanceof Transaction)) {
    return new Transaction(options);
  }

  this.options = options;
}

const proto = Transaction.prototype;

merge(proto, require('../common/util'));

 proto.buildBlob = function(args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      sourceAddress: {
        required: true,
        string: true,
        address: true,
      },
      gasPrice: {
        required: true,
        numeric: true,
      },
      feeLimit: {
        required: true,
        numeric: true,
      },
      nonce: {
        required: true,
        numeric: true,
      },
      ceilLedgerSeq: {
        required: false,
        numeric: true,
      },
      operations: {
        required: true,
        operations: true,
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

    return this._responseData(this._buildBlob(args));
  } catch (err) {
    throw err;
  }
};

proto.sign = function(args) {
  // privateKeys, blob
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      privateKeys: {
        required: true,
        privateKeys: true,
      },
      blob: {
        required: true,
        hex: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    return this._responseData(this._signBlob(args));
  } catch (err) {
    throw err;
  }

};

// blob, signData, publicKey
proto.submit = function* (args) {

  if (is.array(args) || !is.object(args)) {
    return this._responseError(errors.INVALID_ARGUMENTS);
  }

  // blob, signature
  const schema = {
    signature: {
      required: true,
      signatures: true,
    },
    blob: {
      required: true,
      hex: true,
    },
  };

  if (!this._validate(args, schema).tag) {
    const msg = this._validate(args, schema).msg;
    return this._responseError(errors[msg]);
  }

  args = humps.decamelizeKeys(args, { separator: '_' });

  return yield this._submit(args);
};

proto.evaluateFee = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    let { sourceAddress, nonce, operations, signtureNumber, metadata, ceilLedgerSeq } = args;
    signtureNumber = signtureNumber || '1';
    const schema = {
      sourceAddress: {
        required: true,
        string: true,
        address: true,
      },
      nonce: {
        required: true,
        string: true,
        numeric: true,
      },
      operations: {
        required: true,
        operations: true,
      },
      signtureNumber: {
        required: false,
        string: true,
        numeric: true,
      },
      metadata: {
        required: false,
        string: true,
      },
      ceilLedgerSeq: {
        required: false,
        numeric: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    signtureNumber = signtureNumber || 1;

    const operationList = [];

    operations.forEach(item => {
      const type = item.type;
      const argsData = item.data;

      const operationItem =  this._buildOperation(type, argsData);
      let operationMsg = humps.decamelizeKeys(operationItem, { separator: '_' });
      // convert long to int
      operationMsg = this._longToInt(operationMsg);

      operationList.push(operationMsg);
    });



    let data = {
      items: [
        {
          transaction_json: {
            source_address: sourceAddress,
            metadata: metadata,
            nonce: nonce,
            operations: operationList,
            ceil_ledger_seq: ceilLedgerSeq,
          },
        }
      ]
    };

    data = JSONbig.stringify(data);
    const response = yield this._request('post', 'testTransaction', data);
    if (is.object(response)) {
      const info = response;
      if (info.error_code === 0) {
        if (info.result.txs && info.result.txs.length > 0) {
          const fee = info.result.txs[0].transaction_env.transaction;
          return this._responseData({
            feeLimit: fee.fee_limit,
            gasPrice: fee.gas_price,
          });
        }
      }

      return {
        errorCode: info.error_code,
        errorDesc: info.error_desc,
      };
    }
  } catch (err) {
    throw err;
  }
};

proto.getInfo = function* (hash) {
  try {

    if (!is.string(hash) || this._isEmptyString(hash)) {
      return this._responseError(errors.INVALID_HASH_ERROR);
    }

    const data = yield this._request('get', 'getTransactionHistory', {
      hash: hash,
    });

    if (data.error_code === 0) {
      return this._responseData(data.result);
    }

    if (data.error_code === 4) {
      return this._responseError(errors.QUERY_RESULT_NOT_EXIST, data.result);
    }

    return this._responseError(errors.FAIL);

  } catch (err) {
    throw err;
  }
};


wrap(proto);
