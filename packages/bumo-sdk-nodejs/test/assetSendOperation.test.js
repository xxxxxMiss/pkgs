'use strict';

require('chai').should();
const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('Test asset send operation', function() {

  it('test operation.assetSendOperation(args)', function() {
    let data = sdk.operation.assetSendOperation({
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      destAddress: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
      code: 'TEST1',
      issuer: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
      assetAmount: '1',
      metadata: 'oh my test send asset',
    });
    data.errorCode.should.equal(0);
    data.result.should.be.a('object');
    data.result.should.have.property('operation');
    data.result.operation.should.be.a('object');
    data.result.operation.should.have.property('type').equal('payAsset');
    data.result.operation.should.have.property('data');

    // sourceAddress === destAddress
    data = sdk.operation.assetSendOperation({
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      destAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: 'leo',
      issuer: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      assetAmount: '100',
      metadata: 'oh my test send asset',
    });
    data.errorCode.should.equal(11005);

    // Invalid sourceAddress
    data = sdk.operation.assetSendOperation({
      sourceAddress: '',
      destAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: 'leo',
      issuer: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      assetAmount: '100',
      metadata: 'oh my test send asset',
    });
    data.errorCode.should.equal(11002);

    // sourceAddress is undefined
    data = sdk.operation.assetSendOperation({
      destAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: 'leo',
      issuer: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      assetAmount: '100',
      metadata: 'oh my test send asset',
    });
    data.errorCode.should.equal(0);

    // Invalid code
    data = sdk.operation.assetSendOperation({
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      destAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: '',
      issuer: 'buQsBMbFNH3NRJBbFRCPWDzjx7RqRc1hhvn1',
      assetAmount: '100',
      metadata: 'oh my test send asset',
    });
    data.errorCode.should.equal(11023);

    // Invalid assetAmount
    data = sdk.operation.assetSendOperation({
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      destAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: 'leo',
      issuer: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      assetAmount: '',
      metadata: 'oh my test send asset',
    });
    data.errorCode.should.equal(11024);

    // Invalid metadata
    data = sdk.operation.assetSendOperation({
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      destAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: 'leo',
      issuer: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      assetAmount: '100',
      metadata: '',
    });
    data.errorCode.should.equal(15028);

    // metadata is undefined
    data = sdk.operation.assetSendOperation({
      sourceAddress: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      destAddress: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
      code: 'TEST1',
      issuer: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
      assetAmount: '100',
    });
    data.errorCode.should.equal(0);
  });
});
