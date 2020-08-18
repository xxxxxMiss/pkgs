'use strict';

require('chai').should();
const BumoSDK = require('../index');

const sdk = new BumoSDK({
  host: '172.17.3.121:36002',
});

describe('Test asset service', function() {

  it('test asset.getInfo()', async() => {
    let data = await sdk.token.asset.getInfo({
      address: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
      code: 'TEST1',
      issuer: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
    });
    data.errorCode.should.equal(0);
    data.result.should.be.a('object');
    data.result.should.have.property('assets');
    data.result.assets.should.be.a('array');

    // empty argument
    data = await sdk.token.asset.getInfo();
    data.errorCode.should.equal(15016);

    // invalid address
    data = await sdk.token.asset.getInfo({
      address: '',
      code: 'TEST1',
      issuer: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
    });
    data.errorCode.should.equal(11006);

    // invalid code
    data = await sdk.token.asset.getInfo({
      address: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: '',
      issuer: 'ulpi3oHdLKVjCA9gdyN8rfj7Ja363qce67CAF3',
    });
    data.errorCode.should.equal(11023);

    // invalid issuer address
    data = await sdk.token.asset.getInfo({
      address: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: 'TEST1',
      issuer: '12345678',
    });
    data.errorCode.should.equal(11027);

    // BTCDEMO asset does not exist
    data = await sdk.token.asset.getInfo({
      address: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
      code: 'BTCDEMO',
      issuer: 'ulpi3r6xjCqtMfFr4Vf6v7v9e5ke3q6QaAHEjh',
    });
    data.errorCode.should.equal(0);
    data.result.should.be.a('object');
    data.result.should.have.property('assets');
    data.result.assets.should.have.lengthOf(0);
  });

});
