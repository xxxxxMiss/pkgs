'use strict';

const wrap = require('co-wrap-all');
const is = require('is-type-of');
const merge = require('merge-descriptors');
const humps = require('humps');
const JSONbig = require('json-bigint');
const { keypair } = require('bumo-encryption');

const errors = require('../exception');


module.exports = Ctp10Token;

function Ctp10Token(options) {
  if (!(this instanceof Ctp10Token)) {
    return new Ctp10Token(options);
  }
  this.options = options;
}

const proto = Ctp10Token.prototype;

merge(proto, require('../common/util'));

proto.checkValid = function* (contractAddress) {
  try {
    return yield this._isAvailableToken(contractAddress)
  } catch (err) {
    throw err;
  }
};


proto.getInfo = function* (contractAddress) {
  try {
    if (!keypair.checkAddress(contractAddress)) {
      return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress = yield this._isContractAddress(contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    let args = {
      optType: 2,
      contractAddress,
      input: JSON.stringify({
        method: 'contractInfo',
      }),
    };

    args = humps.decamelizeKeys(args, { separator: '_' });
    // convert long to int
    args = this._longToInt(args);
    args = JSONbig.stringify(args);

    let info = yield this._request('post', 'callContract', args);
    info = JSONbig.parse(info.result.query_rets[0].result.value);
    const contractInfo = info;
    return this._responseData({
      ctp: contractInfo.ctp,
      name: contractInfo.name,
      symbol: contractInfo.symbol,
      totalSupply: contractInfo.totalSupply,
      decimals: contractInfo.decimals,
      contractOwner: contractInfo.contractOwner,
    });
  } catch (err) {
    throw err;
  }
};


proto.getName = function* (contractAddress) {
  try {
    if (!keypair.checkAddress(contractAddress)) {
      return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress = yield this._isContractAddress(contractAddress);
    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    const data = yield this.getInfo(contractAddress);

    if (data.result === '') {
      return this._responseData('');
    }

    return this._responseData({
      name: data.result.name,
    });
  } catch (err) {
    throw err;
  }
};

proto.getSymbol = function* (contractAddress) {
  try {
    if (!keypair.checkAddress(contractAddress)) {
      return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress = yield this._isContractAddress(contractAddress);
    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    const data = yield this.getInfo(contractAddress);

    if (data.result === '') {
      return this._responseData('');
    }

    return this._responseData({
      symbol: data.result.symbol,
    });
  } catch (err) {
    throw err;
  }
};

proto.getDecimals = function* (contractAddress) {
  try {
    if (!keypair.checkAddress(contractAddress)) {
      return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress = yield this._isContractAddress(contractAddress);
    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    const data = yield this.getInfo(contractAddress);

    if (data.result === '') {
      return this._responseData('');
    }

    return this._responseData({
      decimals: data.result.decimals,
    });
  } catch (err) {
    throw err;
  }
};

proto.getTotalSupply = function* (contractAddress) {
  try {
    if (!keypair.checkAddress(contractAddress)) {
      return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR);
    }

    const isContractAddress = yield this._isContractAddress(contractAddress);
    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    const data = yield this.getInfo(contractAddress);

    if (data.result === '') {
      return this._responseData('');
    }

    return this._responseData({
      totalSupply: data.result.totalSupply,
    });
  } catch (err) {
    throw err;
  }
};


proto.getBalance = function* (args) {
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
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    const isContractAddress = yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    let data = {
      optType: 2,
      contractAddress: args.contractAddress,
      input: JSON.stringify({
        method: 'balanceOf',
        params: {
          address: args.tokenOwner,
        }
      }),
    };

    data = humps.decamelizeKeys(data, { separator: '_' });
    // convert long to int
    data = this._longToInt(data);
    data = JSONbig.stringify(data);

    let info = yield this._request('post', 'callContract', data);

    if (info.result.query_rets[0].result) {
      info = JSONbig.parse(info.result.query_rets[0].result.value);
      return this._responseData(info);
    } else {
      return this._responseError(errors.NO_SUCH_TOKEN_ERROR);
    }
  } catch (err) {
    throw err;
  }
};

proto.allowance = function* (args) {
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
      spender: {
        required: true,
        address: true,
      }
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    const isContractAddress = yield this._isContractAddress(args.contractAddress);

    if (!isContractAddress) {
      return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
    }

    let data = {
      optType: 2,
      contractAddress: args.contractAddress,
      input: JSON.stringify({
        method: 'allowance',
        params: {
          owner: args.tokenOwner,
          spender: args.spender,
        }
      }),
    };

    data = humps.decamelizeKeys(data, { separator: '_' });
    // convert long to int
    data = this._longToInt(data);
    data = JSONbig.stringify(data);

    let info = yield this._request('post', 'callContract', data);

    if (info.result.query_rets[0].result) {
      info = JSONbig.parse(info.result.query_rets[0].result.value);
      return this._responseData(info);
    } else {
      return this._responseError(errors.NO_SUCH_TOKEN_ERROR);
    }
  } catch (err) {
    throw err;
  }
};


wrap(proto);
