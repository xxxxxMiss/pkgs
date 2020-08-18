'use strict';

const request = require('request-promise');
const is = require('is-type-of');
const long = require('long');
const JSONbig = require('json-bigint');
// const bigNumberToString = require('bignumber-to-string')
const BigNumber = require('bignumber.js');
const protobuf = require("protobufjs");
const tou8 = require('buffer-to-uint8array');
const humps = require('humps');
const { keypair, signature } = require('bumo-encryption');
const errors = require('../exception');


const proto = exports;


/**
 * GET/POST request
 *
 * @param  {String} method
 * @param  {String} path
 * @param  {Object} data
 * @return {Object}
 */
proto._request = function* (method, path, data = {}) {
  try {
    const protocol = this.options.secure ? 'https://' : 'http://';
    const uri = `${protocol}${this.options.host}/${path}`;

    if (!is.string(method) || this._isEmptyString(method)) {
      throw new Error('method must be a non-empty string');
    }

    if (!is.string(path) || this._isEmptyString(path)) {
      throw new Error('path must be a non-empty string');
    }

    const methods = [ 'get', 'post' ];

    if (!methods.includes(method.toLowerCase())) {
      throw new Error(`${method} http method is not supported`);
    }

    const options = {
      method,
      uri,

    };

    if (method === 'get') {
      options.qs = data;
    }

    if (method === 'post') {
      options.body = data;
    }
    const result = yield request(options);
    const obj = JSONbig.parse(result);
    const error_code = obj.error_code;
    const final =  this._bigNumberToString(obj);
    final.error_code = error_code;
    return final;
  } catch (err) {
    throw err;
  }
};

proto._response = function(obj) {
  const data = {
    errorCode: obj.error_code || 0,
    errorDesc: obj.error_desc || 'Success',
  };

  if (is.object(obj) && obj.error_code) {
    if (obj.error_code === 0) {
      data.result = obj.result || {};
    } else {
      data.errorDesc = obj.error_desc || '';
      data.result = {};
    }
  } else {
    data.result = obj;
  }

  return JSONbig.stringify(data);
};

proto._getBlockNumber = function* () {
  try {
    const data = yield this._request('get', 'getLedger');
    if (data && data.error_code === 0) {
      const seq = data.result.header.seq;
      return this._responseData({
        header: {
          blockNumber: seq,
        },
      });
    } else {
      return this._responseError(errors.INTERNAL_ERROR);
    }
  } catch (err) {
    throw err;
  }
};

proto._isEmptyString = function(str) {
  if (!is.string(str)) {
    throw new Error('str must be a string');
  }
  return (str.trim().length === 0);
};

proto._postData = function(blob, signature) {
  const data = {
    items: [
      {
        transaction_blob: blob,
        signatures: signature
      },
    ],
  };
  return JSONbig.stringify(data);
};

proto._isBigNumber = function (object) {
  return object instanceof BigNumber ||
      (object && object.constructor && object.constructor.name === 'BigNumber');
};

proto._toBigNumber = function(number) {
  number = number || 0;
  //
  if (this._isBigNumber(number)) {
    return number;
  }
  return new BigNumber(number);
};

proto._stringFromBigNumber = function(number) {
  return this._toBigNumber(number).toString(10);
};

proto._verifyValue = function(str) {
  const reg = /^[1-9]\d*$/;
  return (
      is.string(str) &&
      reg.test(str) &&
      long.fromValue(str).greaterThan(0) &&
      long.fromValue(str).lessThanOrEqual(long.MAX_VALUE)
  );
};

proto._isAvailableValue = function(str, from=-1, to=long.MAX_VALUE) {
  const reg = /^[0-9]\d*$/;
  return (
      is.string(str) &&
      reg.test(str) &&
      long.fromValue(str).greaterThan(from) &&
      long.fromValue(str).lessThanOrEqual(to)
  );
};

proto._checkParams = function (obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      let value = obj[prop];
      if (!is.undefined(value)) {
        if (!this._verifyValue(value)) {
          throw new Error(errors.INVALID_FORMAT_OF_ARG.msg);
        }
      }
    }
  }
};

proto._getDefaultValue = function* () {
  try {
     let ledgerInfo = yield this._request('get', 'getLedger', {
      with_fee: true,
    });
    const gasPrice = long.fromValue(ledgerInfo.result.fees.gas_price);
    const feeLimit = long.fromValue(1000).mul(gasPrice);
    return {
      gasPrice,
      feeLimit,
    }
  } catch (err) {
    throw err;
  }
};

proto._responseData = function(data) {
  const errorCode = 0;
  const errorDesc = '';

  return {
    errorCode,
    errorDesc,
    result: data,
  }
};

proto._responseError = function(message) {
  if (!message) {
    throw new Error('require message');
  }
  const errorCode = message.CODE;

  return {
    errorCode,
    errorDesc: message.MSG,
  };
};

proto._submitTransaction = function* (data) {
  try {
    const res = yield this._request('post', 'submitTransaction', data);
    const results = res.results;
    if (Array.isArray(results) && results.length > 0) {
      const info = results[0];

      if (info.error_code === '0') {
        return this._responseData({
          hash: info.hash,
        });
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

proto._buildOperation = function(type, data) {
  try {
    return require(`./operation/${type}`)(data);
  } catch (err) {
    console.log(err);
    throw new Error('Operation cannot be resolved');
  }
};

proto._decodeOperation = function(hexString) {
  const root = protobuf.Root.fromJSON(require('../crypto/protobuf/bundle.json'));
  const operation = root.lookupType('protocol.Operation');
  const msgBuffer = Buffer.from(hexString, 'hex');
  return operation.decode(msgBuffer);
};

proto._buildBlob = function(args) {
  try {
    let { sourceAddress, gasPrice, feeLimit, nonce, ceilLedgerSeq, operations, metadata } = args;

    const operationList = [];

    operations.forEach(item => {
      const type = item.type;
      const argsData = item.data;

      const operationItem =  this._buildOperation(type, argsData);
      operationList.push(operationItem);
    });

    const root = protobuf.Root.fromJSON(require('../crypto/protobuf/bundle.json'));
    const tx = root.lookupType('protocol.Transaction');

    ceilLedgerSeq = ceilLedgerSeq ? long.fromValue(ceilLedgerSeq) : undefined;

    const payload = {
      sourceAddress,
      gasPrice: long.fromValue(gasPrice),
      feeLimit: long.fromValue(feeLimit),
      nonce: long.fromValue(nonce),
      ceilLedgerSeq,
      operations: operationList,
      // metadata,
    };

    if (metadata) {
      // payload.metadata = tou8(Buffer.from(metadata, 'hex'));
      payload.metadata = metadata;
    }

    const errMsg = tx.verify(payload);

    if (errMsg) {
      throw Error(errMsg);
    }

    const message = tx.create(payload);
    const bufferData = tx.encode(message).finish();

    return {
      transactionBlob: bufferData.toString('hex'),
    }
  } catch (err) {
    throw err;
  }
};

proto._signBlob = function({ privateKeys, blob } = args) {
  try {
    const buffer = Buffer.from(blob, 'hex');
    const uint8ArrayData = tou8(buffer);
    const signatureArr = [];
    privateKeys.forEach(privateKey => {
      signatureArr.push({
        signData: signature.sign(uint8ArrayData, privateKey),
        publicKey: keypair.getEncPublicKey(privateKey),
      });
    });
    // return signatureArr;
    return {
      signatures: signatureArr,
    };
  } catch (err) {
    throw err;
  }
};

proto._submit = function* (args) {
  const { blob, signature} = args;
  const postData = this._postData(blob, signature);
  return yield this._submitTransaction(postData);
};


proto._isHexString = function(str) {
  if ((str === '' || !is.string(str))) {
    return false;
  }
  const hexString = Buffer.from(str, 'hex').toString('hex');
  return (hexString === str);
};

proto._isString = function(str) {
  if (!is.string(str) ||
      str.trim().length === 0 ||
      str.length > 1024) {
    return false;
  }
  return true;
};

proto._isTopic = function(str) {
  if (!is.string(str) ||
      str.trim().length === 0 ||
      str.length > 128) {
    return false;
  }
  return true;
};

proto._isSignature = function(arr) {
  let tag = true;
  if (!is.array(arr) || arr.length === 0) {
    tag = false;
    return tag;
  }

  arr.some(item => {
    if (!is.object(item)) {
      tag = false;
      return true;
    }

    if (!item.signData || !item.publicKey) {
      tag = false;
      return true;
    }

    if (!this._isHexString(item.signData)) {
      tag = false;
      return true;
    }

    if (!keypair.checkEncPublicKey(item.publicKey)) {
      tag = false;
      return true;
    }
  });

  return tag;
};

proto._isOperation = function(arr) {
  let tag = true;
  if (!is.array(arr) || arr.length === 0) {
    tag = false;
    return tag;
  }

  arr.some(item => {
    if (!is.object(item)) {
      tag = false;
      return true;
    }
    if (!item.type || !item.data) {
      tag = false;
      return true;
    }
  });

  return tag;
};


proto._isPrivateKeys = function(arr) {
  let tag = true;
  if (!is.array(arr) || arr.length === 0) {
    tag = false;
    return tag;
  }

  arr.some(item => {
    if (!keypair.checkEncPrivateKey(item)) {
      tag = false;
      return true;
    }
  });

  return tag;
};


/**
 *
 * @param obj
 * @param schema
 * @returns {boolean}
 * @private
 *
 * eg:
    schema: {
      required: false,
      string: true,
      address: true,
      numeric: true,
    }
 */
proto._validate = function(obj, schema) {
  let tag = true;
  let msg = '';

  if (!is.object(obj) || !is.object(schema)) {
    tag = false;
    msg = 'INVALID_NUMBER_OF_ARG';
    return {
      tag,
      msg,
    };
  }

  Object.keys(schema).some(item => {

    // required is true
    if (schema[item].required && is.undefined(obj[item])) {
      obj[item] = '';
    }

    // numeric is true
    if (!is.undefined(obj[item]) &&
        schema[item].numeric &&
        !this._verifyValue(obj[item])) {
      tag = false;

      switch(item) {
        case 'amount':
          msg = 'INVALID_BU_AMOUNT_ERROR';
          break;
        case 'buAmount':
          msg = 'INVALID_BU_AMOUNT_ERROR';
          break;
        case 'assetAmount':
          msg = 'INVALID_ASSET_AMOUNT_ERROR';
          break;
        case 'gasPrice':
          msg = 'INVALID_GASPRICE_ERROR';
          break;
        case 'feeLimit':
          msg = 'INVALID_FEELIMIT_ERROR';
          break;
        case 'ceilLedgerSeq':
          msg = 'INVALID_CEILLEDGERSEQ_ERROR';
          break;
        case 'nonce':
          msg = 'INVALID_NONCE_ERROR';
          break;
        case 'initBalance':
          msg = 'INVALID_INITBALANCE_ERROR';
          break;
        case 'signtureNumber':
          msg = 'INVALID_SIGNATURENUMBER_ERROR';
          break;
        case 'totalSupply':
          msg = 'INVALID_TOKEN_TOTALSUPPLY_ERROR';
          break;
        case 'tokenAmount':
          msg = 'INVALID_TOKEN_AMOUNT_ERROR';
          break;
        default:
          msg = 'INVALID_ARGUMENTS';
      }

      return true;
    }

    // privateKeys is true
    if (!is.undefined(obj[item]) &&
        schema[item].privateKeys &&
        !this._isPrivateKeys(obj[item])) {
      tag = false;
      msg = `PRIVATEKEY_ONE_ERROR`;
      return true;
    }

    // address is true
    if (!is.undefined(obj[item]) &&
        schema[item].address &&
        !keypair.checkAddress(obj[item])) {
      tag = false;

      switch(item) {
        case 'sourceAddress':
          msg = 'INVALID_SOURCEADDRESS_ERROR';
          break;
        case 'destAddress':
          msg = 'INVALID_DESTADDRESS_ERROR';
          break;
        case 'issuer':
          msg = 'INVALID_ISSUER_ADDRESS_ERROR';
          break;
        case 'address':
          msg = 'INVALID_ADDRESS_ERROR';
          break;
        case 'contractAddress':
          msg = 'INVALID_CONTRACTADDRESS_ERROR';
          break;
        case 'fromAddress':
          msg = 'INVALID_FROMADDRESS_ERROR';
          break;
        case 'spender':
          msg = 'INVALID_SPENDER_ERROR';
          break;
        case 'tokenOwner':
          msg = 'INVALID_TOKENOWNER_ERRPR';
          break;
        default:
          msg = 'INVALID_ARGUMENTS';
      }

      return true;
    }

    // operations is true
    if (!is.undefined(obj[item]) &&
        schema[item].operations &&
        !this._isOperation(obj[item])) {
      tag = false;
      msg = 'INVALID_OPERATIONS';
      return true;
    }

    // signatures is true
    if (!is.undefined(obj[item]) &&
        schema[item].signatures &&
        !this._isSignature(obj[item])) {
      tag = false;
      msg = 'INVALID_SIGNATURE_ERROR';
      return true;
    }

    // hex is true
    if (!is.undefined(obj[item]) &&
        schema[item].hex &&
        !this._isHexString(obj[item])) {
      tag = false;

      switch(item) {
        case 'metadata':
          msg = 'METADATA_NOT_HEX_STRING_ERROR';
          break;
        case 'blob':
          msg = 'INVALID_BLOB_ERROR';
          break;
        default:
          msg = 'METADATA_NOT_HEX_STRING_ERROR';
      }

      return true;
    }

    // string is true
    if (!is.undefined(obj[item]) &&
        schema[item].string &&
        !this._isString(obj[item])) {
      tag = false;

      switch(item) {
        case 'code':
          msg = 'INVALID_ASSET_CODE_ERROR';
          break;
        case 'issuer':
          msg = 'INVALID_ISSUER_ADDRESS_ERROR';
          break;
        case 'data':
          msg = 'INVALID_LOG_DATA_ERROR';
          break;
        case 'metadata':
          msg = 'INVALID_METADATA_ERROR';
          break;
        case 'payload':
          msg = 'PAYLOAD_EMPTY_ERROR';
          break;
        case 'input':
          msg = 'INVALID_INPUT_ERROR';
          break;
        case 'name':
          msg = 'INVALID_TOKEN_NAME_ERROR';
          break;
        case 'symbol':
          msg = 'INVALID_TOKEN_SYMBOL_ERROR';
          break;
        case 'key':
          msg = 'INVALID_DATAKEY_ERROR';
          break;
        default:
          msg = 'INVALID_ARGUMENTS';
      }

      return true;
    }

    // topic is true
    if (!is.undefined(obj[item]) &&
        schema[item].topic &&
        !this._isTopic(obj[item])) {
      tag = false;
      msg = 'INVALID_LOG_TOPIC_ERROR';
      return true;
    }

    // boolean is true
    if (!is.undefined(obj[item]) &&
        schema[item].boolean &&
        (typeof obj[item] !== 'boolean')) {
      tag = false;

      switch(item) {
        case 'deleteFlag':
          msg = 'INVALID_DELETEFLAG_ERROR';
          break;
        default:
          msg = 'INVALID_ARGUMENTS';
      }

      return true;
    }

  });

  return {
    tag,
    msg,
  };
};

proto._bufToHex = function(buf) {
  const utf8Str = buf.toString('utf8');
  return Buffer.from(utf8Str, 'utf8').toString('hex');
};

proto._bigNumberToString = function(obj, base) {
  // setup base
  base = base || 10;

  // check if obj is type object, not an array and does not have BN properties
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj) && !('lessThan' in obj)) {
    // move through plain object
    Object.keys(obj).forEach(function (key) {
      // recurively converty item
      obj[key] = proto._bigNumberToString(obj[key], base);
    })
  }

  // obj is an array
  if (Array.isArray(obj)) {
    // convert items in array
    obj = obj.map(function (item) {
      // convert item to a string if bignumber
      return proto._bigNumberToString(item, base);
    })
  }

  // if obj is number, convert to string
  if (typeof obj === 'number') return obj + '';

  // if not an object bypass
  if (typeof obj !== 'object' || obj === null) return obj;

  // if the object to does not have BigNumber properties, bypass
  if (!('toString' in obj) || !('lessThan' in obj)) return obj;

  // if object has bignumber properties, convert to string with base
  return obj.toString(base);
};


proto._longToInt = function(obj) {
  // check if obj is type object, not an array and does not have long properties
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj) && !('low' in obj)) {
    // move through plain object
    Object.keys(obj).forEach(function (key) {
      // recurively converty item
      obj[key] = proto._longToInt(obj[key]);
    })
  }

  // obj is an array
  if (Array.isArray(obj)) {
    // convert items in array
    obj = obj.map(function (item) {
      // convert item to an int if long
      return proto._longToInt(item);
    })
  }

  // if not an object bypass
  if (typeof obj !== 'object' || obj === null) return obj;

  // if the object to does not have long properties, bypass
  if (!('low' in obj)) return obj;

  // if object has long properties, convert to int
  return long.fromValue(obj).toInt();
};

proto._isContractAddress = function* (address) {
  const data = yield this._request('get', 'getAccount', {
    address,
  });

  if (data.error_code !== 0) {
    return this._responseError(errors.ACCOUNT_NOT_EXIST);
  }

  const result = data.result;

  if (result.contract) {
    return true;
  }

  return false;
};

proto._isAvailableToken = function* (contractAddress) {
  if (!keypair.checkAddress(contractAddress)) {
    return this._responseError(errors.INVALID_CONTRACTADDRESS_ERROR);
  }

  const isContractAddress = yield this._isContractAddress(contractAddress);
  if (!isContractAddress) {
    return this._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR);
  }

  let data = yield this._request('get', 'getAccount', {
    address: contractAddress,
  });


  if (data.error_code !== 0) {
    return this._responseData({
      isValid: false,
    });
  }

  data = data.result;
  const contract = data.contract.metadatas;
  const metadatas = data.metadatas;
  let key = '';
  let value = '';
  if (metadatas && is.array(metadatas)) {

    metadatas.some(item => {
      if (item.key === 'global_attribute') {
        key = 'global_attribute';
        value = item.value;
        return true;
      }
    });

    if (key !== 'global_attribute') {
      return this._responseData({
        isValid: false,
      });
    }

    const info = JSON.parse(value);

    if ('1.0' !== info.ctp) {
      return this._responseData({
        isValid: false,
      });
    }

    if (!info.symbol || info.symbol < 0 || info.symbol > 8) {
      return this._responseData({
        isValid: false,
      });
    }

    const schema = {
      balance: {
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
      contractOwner: {
        required: true,
        address: true,
      },
    };

    if (!this._validate(info, schema).tag) {
      return this._responseData({
        isValid: false,
      });
    }

    return this._responseData({
      isValid: true,
    });

  } else {
    return this._responseData({
      isValid: false,
    });
  }
};