'use strict';

require('chai').should();
const BigNumber = require('bignumber.js');
const co = require('co');

const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
  // host: '192.168.1.34:36002',
});

describe('Test ctp10Token Issue Operation', function() {

  it('Test ctp10Token Issue Operation ', function() {
    let data = sdk.operation.ctp10TokenIssueOperation({
      initBalance: '10000000',
      name: 'leo',
      symbol: 'LEO',
      decimals: 6,
      totalSupply: '30',
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      // metadata: '',
    });
    data.errorCode.should.equal(0);

    data = sdk.operation.ctp10TokenIssueOperation({
      initBalance: '10000000a',
      name: 'leo',
      symbol: 'LEO',
      decimals: 6,
      totalSupply: '30',
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      metadata: '',
    });
    data.errorCode.should.equal(11004);
  });

});
