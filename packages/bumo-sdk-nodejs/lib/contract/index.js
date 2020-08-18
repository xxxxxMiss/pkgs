'use strict';

const wrap = require('co-wrap-all');
const is = require('is-type-of');
const merge = require('merge-descriptors');
const long = require('long');
const JSONbig = require('json-bigint');
const humps = require('humps');
const { keypair } = require('bumo-encryption');
const errors = require('../exception');

module.exports = Contract;

function Contract(options) {
  if (!(this instanceof Contract)) {
    return new Contract(options);
  }

  this.options = options;
}

const proto = Contract.prototype;

merge(proto, require('../common/util'));

proto.getInfo = function* (contractAddress) {
  if (!keypair.checkAddress(contractAddress)) {
    return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR );
  }

  const addressStatus = yield this.checkValid(contractAddress);

  if (addressStatus.errorCode !== 0 || !addressStatus.result.isValid) {
    return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
  }

  const res = yield this._request('get', 'getAccount', {
    address: contractAddress,
  });

  if (res.error_code !== 0) {
    return this._responseError(errors.ACCOUNT_NOT_EXIST);
  }
  const result = res.result;

  if (result.contract && result.contract.payload) {
    return this._responseData({
      contract : {
        type: 0,
        payload: result.contract.payload,
      },
    });
  }

  return this._responseData(this._responseError(errors.INVALID_CONTRACT_HASH_ERROR));
};

proto.checkValid = function* (contractAddress) {
  if (!keypair.checkAddress(contractAddress)) {
    return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR);
  }

  const data = yield this._request('get', 'getAccount', {
    address: contractAddress,
  });

  if (data.error_code !== 0) {
    return this._responseError(errors.ACCOUNT_NOT_EXIST);
  }

  const result = data.result;

  if (result.contract) {
    return this._responseData({
      isValid: true,
    });
  }

  return this._responseData({
    isValid: false,
  });
};


proto.call = function* (args) {
  try {

    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const schema = {
      contractAddress: {
        required: false,
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
      input: {
        required: false,
        string: true,
      },
      contractBalance: {
        required: false,
        numeric: true,
      },
      feeLimit: {
        required: false,
        numeric: true,
      },
      gasPrice: {
        required: false,
        numeric: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    if (![0, 1, 2].includes(args.optType)) {
      return this._responseError(errors.INVALID_OPTTYPE_ERROR);
    }

    if (!args.contractAddress && !args.code) {
      return this._responseError(errors.CONTRACTADDRESS_CODE_BOTH_NULL_ERROR);
    }

    const isContractAddress = yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR);
    }

    args = humps.decamelizeKeys(args, { separator: '_' });
    // convert long to int
    args = this._longToInt(args);

    let data = JSONbig.stringify(args);

    const info = yield this._request('post', 'callContract', data);

    if (info.error_code === 0) {
      return this._responseData(info.result);
    }
    return this._responseData(info);
  } catch (err) {
    throw err;
  }
};

proto.getAddress = function* (hash) {
  try {
    const schema = {
      hash: {
        required: true,
        string: true,
      },
    };

    const args = {
      hash,
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors.INVALID_HASH_ERROR);
    }

    const accountInfo = yield this._request('get', 'getTransactionHistory', {
      hash,
    });

    const contractAddressList = [];

    if (accountInfo.error_code === 0 &&
        accountInfo.result.transactions &&
        accountInfo.result.transactions.length > 0) {
      let account = accountInfo.result.transactions[0];

      if (account.error_desc) {
        let info = JSON.parse(account.error_desc);

        if (is.array(info) && info.length > 0) {
          info.forEach(item => {
            contractAddressList.push(item);
          });
        }
      }

      return this._responseData({
        contractAddressList,
      });
    }

    return this._responseData({
      contractAddressList,
    });

  } catch (err) {
    throw err;
  }
};

wrap(proto);