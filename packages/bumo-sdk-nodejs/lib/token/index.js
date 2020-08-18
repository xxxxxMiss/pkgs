'use strict';

const Asset = require('./asset');
const Ctp10Token = require('./ctp10Token');

module.exports = Collection;

function Collection(options) {
  if (!(this instanceof Collection)) {
    return new Collection(options);
  }

  this.options = options;

  this.asset = new Asset(options);
  this.ctp10Token = new Ctp10Token(options);
}
