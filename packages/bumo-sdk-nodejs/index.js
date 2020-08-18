'use strict';

const BUMOSDK = require('./lib/sdk');

if (typeof window !== 'undefined' && typeof window.BUMOSDK === 'undefined') {
  window.BUMOSDK = BUMOSDK;
}

module.exports = BUMOSDK;
