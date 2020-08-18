'use strict';

const wrap = require('co-wrap-all');
const is = require('is-type-of');
const merge = require('merge-descriptors');
const errors = require('../exception');


module.exports = Asset;

function Asset(options) {
  if (!(this instanceof Asset)) {
    return new Asset(options);
  }
  this.options = options;
}

const proto = Asset.prototype;

merge(proto, require('../common/util'));

proto.getInfo = function* (args) {
  try {
    if (is.array(args) || !is.object(args)) {
      return this._responseError(errors.INVALID_ARGUMENTS);
    }

    const { address, code, issuer } = args;

    const schema = {
      address: {
        required: true,
        address: true,
      },
      code: {
        required: true,
        string: true,
      },
      issuer: {
        required: true,
        address: true,
      },
    };

    if (!this._validate(args, schema).tag) {
      const msg = this._validate(args, schema).msg;
      return this._responseError(errors[msg]);
    }

    const data = yield this._request('get', 'getAccountAssets', {
      address,
    });
    if (data.error_code === 0 && data.result && data.result.length > 0 ) {
      let obj = [];
      data.result.some(item => {
        if (item.key.code === code &&
            item.key.issuer === issuer) {
          obj.push(item);
          return true;
        }
      });


      return this._responseData({
        assets: obj,
      });

    } else {
      return this._responseData({
        assets: [],
      });
    }

  } catch (err) {
    throw err;
  }
};

wrap(proto);
